// src/components/DataCollector.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { openDB, DBSchema } from 'idb';

interface PostDeliveriesScoresRequestDB extends DBSchema {
  motions: {
    key: number;
    value: {
      x: number;
      y: number;
      z: number;
    };
  };
  orientations: {
    key: number;
    value: {
      alpha: number;
      beta: number;
      gamma: number;
    };
  };
}

const DataCollector: React.FC = () => {
  const [accelerometerData, setAccelerometerData] = useState<{ x: number; y: number; z: number }>({ x: 0, y: 0, z: 0 });
  const [tiltData, setTiltData] = useState<{ alpha: number; beta: number; gamma: number }>({ alpha: 0, beta: 0, gamma: 0 });
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);
  const [permissionDenied, setPermissionDenied] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [sendSuccess, setSendSuccess] = useState<boolean | null>(null);

  // IndexedDB の初期化
  const initializeDB = async () => {
    try {
      const db = await openDB<PostDeliveriesScoresRequestDB>('PostDeliveriesScoresRequestDB', 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains('motions')) {
            db.createObjectStore('motions', { autoIncrement: true });
          }
          if (!db.objectStoreNames.contains('orientations')) {
            db.createObjectStore('orientations', { autoIncrement: true });
          }
        },
      });
      console.log('IndexedDBが初期化されました');
    } catch (error) {
      console.error('IndexedDBの初期化中にエラーが発生しました:', error);
    }
  };

  useEffect(() => {
    initializeDB();
  }, []);

  // デバイスモーションイベントハンドラー
  const handleDeviceMotion = useCallback(async (event: DeviceMotionEvent) => {
    const { acceleration } = event;
    if (acceleration) {
      const data = {
        x: acceleration.x || 0,
        y: acceleration.y || 0,
        z: acceleration.z || 0,
      };
      setAccelerometerData(data);
      try {
        const db = await openDB<PostDeliveriesScoresRequestDB>('PostDeliveriesScoresRequestDB', 1);
        await db.add('motions', data);
        console.log('加速度データをIndexedDBに保存しました:', data);
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
    };
    setTiltData(data);
    try {
      const db = await openDB<PostDeliveriesScoresRequestDB>('PostDeliveriesScoresRequestDB', 1);
      await db.add('orientations', data);
      console.log('傾きデータをIndexedDBに保存しました:', data);
    } catch (error) {
      console.error('傾きデータの保存中にエラーが発生しました:', error);
    }
  }, []);

  // 許可をリクエストする関数
  const requestPermission = useCallback(async () => {
    console.log('requestPermissionが呼び出されました');
    // @ts-ignore
    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
      try {
        // @ts-ignore
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

  // データ送信関数
  const sendDataToAPI = useCallback(async () => {
    setIsSending(true);
    setSendSuccess(null);
    try {
      const db = await openDB<PostDeliveriesScoresRequestDB>('PostDeliveriesScoresRequestDB', 1);

      // motions と orientations の全データを取得
      const motions = await db.getAll('motions');
      const orientations = await db.getAll('orientations');

      if (motions.length === 0 && orientations.length === 0) {
        console.log('送信するデータがありません');
        setIsSending(false);
        return;
      }

      // APIスキーマに合わせてデータを構築
      const payload = {
        motions,
        orientations,
      };

      // バックエンドにデータを送信 (fetchを使用)
      try {
        const response = await fetch('/api/v1/deliveries/123e4567-e89b-12d3-a456-426614174000/scores', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`サーバーエラー: ${response.status} ${response.statusText}`);
        }

        const responseData = await response.json();
        console.log('データをバックエンドに送信しました:', payload);
        console.log('バックエンドからのレスポンス:', responseData);
        setSendSuccess(true);

        // 送信後、IndexedDBのデータをクリア
        const tx = db.transaction(['motions', 'orientations'], 'readwrite');
        await tx.objectStore('motions').clear();
        await tx.objectStore('orientations').clear();
        await tx.done;
        console.log('IndexedDBのデータをクリアしました');
      } catch (error) {
        console.error('バックエンドへのデータ送信中にエラーが発生しました:', error);
        setSendSuccess(false);
      }
    } catch (error) {
      console.error('データ送信処理中にエラーが発生しました:', error);
      setSendSuccess(false);
    } finally {
      setIsSending(false);
    }
  }, []);

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

      {/* データ送信ボタン */}
      {permissionGranted && (
        <div style={{ marginTop: '1rem' }}>
          <button onClick={sendDataToAPI} disabled={isSending}>
            {isSending ? '送信中...' : 'データを送信する'}
          </button>
          {sendSuccess === true && (
            <p style={{ color: 'green' }}>データの送信に成功しました。</p>
          )}
          {sendSuccess === false && (
            <p style={{ color: 'red' }}>データの送信に失敗しました。</p>
          )}
        </div>
      )}
    </div>
  );
};

export default DataCollector;
