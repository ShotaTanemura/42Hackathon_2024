// src/components/DataCollector.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { openDB, DBSchema } from 'idb';

// IndexedDB のスキーマ定義
interface CarbonTokenDB extends DBSchema {
  accelerometer: {
    key: number;
    value: {
      x: number;
      y: number;
      z: number;
      timestamp: number;
    };
  };
  tilt: {
    key: number;
    value: {
      alpha: number;
      beta: number;
      gamma: number;
      timestamp: number;
    };
  };
}

const DataCollector: React.FC = () => {
  const [accelerometerData, setAccelerometerData] = useState<{ x: number; y: number; z: number }>({ x: 0, y: 0, z: 0 });
  const [tiltData, setTiltData] = useState<{ alpha: number; beta: number; gamma: number }>({ alpha: 0, beta: 0, gamma: 0 });
  const [accelerometerLog, setAccelerometerLog] = useState<
    { x: number; y: number; z: number; timestamp: number }[]
  >([]);
  const [tiltLog, setTiltLog] = useState<
    { alpha: number; beta: number; gamma: number; timestamp: number }[]
  >([]);
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);
  const [permissionDenied, setPermissionDenied] = useState<boolean>(false);

  // IndexedDB の初期化
  useEffect(() => {
    const initializeDB = async () => {
      try {
        const db = await openDB<CarbonTokenDB>('CarbonTokenDB', 1, {
          upgrade(db) {
            if (!db.objectStoreNames.contains('accelerometer')) {
              db.createObjectStore('accelerometer', { keyPath: 'timestamp' });
            }
            if (!db.objectStoreNames.contains('tilt')) {
              db.createObjectStore('tilt', { keyPath: 'timestamp' });
            }
          },
        });
        // 初回ロード時にログを取得
        const accelData = await db.getAll('accelerometer');
        const tiltData = await db.getAll('tilt');
        setAccelerometerLog(accelData);
        setTiltLog(tiltData);
      } catch (error) {
        console.error('IndexedDBの初期化中にエラーが発生しました:', error);
      }
    };

    initializeDB();
  }, []);

  // データログの定期的な取得
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const db = await openDB<CarbonTokenDB>('CarbonTokenDB', 1);
        const accelData = await db.getAll('accelerometer');
        const tiltData = await db.getAll('tilt');
        setAccelerometerLog(accelData);
        setTiltLog(tiltData);
      } catch (error) {
        console.error('データログ取得中にエラーが発生しました:', error);
      }
    };

    const interval = setInterval(fetchLogs, 5000); // 5秒ごとにログを更新

    return () => clearInterval(interval);
  }, []);

  // デバイスモーションイベントハンドラー
  const handleDeviceMotion = useCallback(async (event: DeviceMotionEvent) => {
    const { acceleration } = event;
    if (acceleration) {
      const data = {
        x: acceleration.x || 0,
        y: acceleration.y || 0,
        z: acceleration.z || 0,
        timestamp: event.timeStamp,
      };
      setAccelerometerData(data);
      try {
        const db = await openDB<CarbonTokenDB>('CarbonTokenDB', 1);
        await db.add('accelerometer', data);
      } catch (error) {
        console.error('加速度データの保存中にエラーが発生しました:', error);
      }
    }
  }, []);

  // デバイスオリエンテーションイベントハンドラー
  const handleDeviceOrientation = useCallback(async (event: DeviceOrientationEvent) => {
    const data = {
      alpha: event.alpha || 0,
      beta: event.beta || 0,
      gamma: event.gamma || 0,
      timestamp: event.timeStamp,
    };
    setTiltData(data);
    try {
      const db = await openDB<CarbonTokenDB>('CarbonTokenDB', 1);
      await db.add('tilt', data);
    } catch (error) {
      console.error('傾きデータの保存中にエラーが発生しました:', error);
    }
  }, []);

  // 許可をリクエストする関数
  const requestPermission = useCallback(async () => {
    console.log('requestPermissionが呼び出されました');
    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
      try {
        const response = await DeviceMotionEvent.requestPermission();
        console.log('DeviceMotionEvent.requestPermissionの応答:', response);
        if (response === 'granted') {
          setPermissionGranted(true);
          setPermissionDenied(false);
          window.addEventListener('devicemotion', handleDeviceMotion);
          window.addEventListener('deviceorientation', handleDeviceOrientation);
          console.log('デバイスモーションとオリエンテーションのイベントリスナーが追加されました');
        } else {
          setPermissionDenied(true);
          setPermissionGranted(false);
          alert('デバイスモーションへのアクセス許可が拒否されました。');
          console.log('デバイスモーションへのアクセスが拒否されました');
        }
      } catch (error) {
        console.error('デバイスモーション許可リクエスト中にエラーが発生しました:', error);
        setPermissionDenied(true);
        setPermissionGranted(false);
        alert('デバイスモーション許可リクエスト中にエラーが発生しました。');
      }
    } else {
      // iOS 13未満や非対応デバイスの場合、自動的にイベントリスナーをセットアップ
      setPermissionGranted(true);
      setPermissionDenied(false);
      window.addEventListener('devicemotion', handleDeviceMotion);
      window.addEventListener('deviceorientation', handleDeviceOrientation);
      console.log('iOS 13未満または非対応デバイスのため、イベントリスナーが追加されました');
    }
  }, [handleDeviceMotion, handleDeviceOrientation]);

  // クリーンアップ: コンポーネントがアンマウントされる際にイベントリスナーを削除
  useEffect(() => {
    return () => {
      window.removeEventListener('devicemotion', handleDeviceMotion);
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
    };
  }, [handleDeviceMotion, handleDeviceOrientation]);

  return (
    <div>
      <h2>加速度データ</h2>
      <p>X: {accelerometerData.x.toFixed(2)}</p>
      <p>Y: {accelerometerData.y.toFixed(2)}</p>
      <p>Z: {accelerometerData.z.toFixed(2)}</p>

      <h2>傾きデータ</h2>
      <p>Alpha: {tiltData.alpha.toFixed(2)}</p>
      <p>Beta: {tiltData.beta.toFixed(2)}</p>
      <p>Gamma: {tiltData.gamma.toFixed(2)}</p>

      {/* 許可がまだ得られておらず、拒否されていない場合にボタンを表示 */}
      {!permissionGranted && !permissionDenied && (
        <button onClick={requestPermission}>
          デバイスモーションを有効にする
        </button>
      )}

      {/* 許可が拒否された場合にメッセージを表示 */}
      {permissionDenied && (
        <p style={{ color: 'red' }}>
          デバイスモーションへのアクセスが拒否されました。ブラウザの設定で有効にしてください。
        </p>
      )}

      <h2>データログ</h2>
      <div style={{ maxHeight: '200px', overflowY: 'scroll', border: '1px solid #ccc', padding: '1rem' }}>
        <h3>加速度ログ</h3>
        <ul>
          {accelerometerLog.map((data) => (
            <li key={data.timestamp}>
              時間: {new Date(data.timestamp).toLocaleTimeString()}, X: {data.x.toFixed(2)}, Y: {data.y.toFixed(2)}, Z: {data.z.toFixed(2)}
            </li>
          ))}
        </ul>

        <h3>傾きログ</h3>
        <ul>
          {tiltLog.map((data) => (
            <li key={data.timestamp}>
              時間: {new Date(data.timestamp).toLocaleTimeString()}, Alpha: {data.alpha.toFixed(2)}, Beta: {data.beta.toFixed(2)}, Gamma: {data.gamma.toFixed(2)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DataCollector;
