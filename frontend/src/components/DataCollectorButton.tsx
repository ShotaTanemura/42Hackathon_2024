// src/components/DataCollector.tsx
import React, { useEffect, useState, useCallback, useRef } from "react";
import { openDB, DBSchema, IDBPDatabase } from "idb";
import { useRouter } from "next/navigation";
import throttle from "lodash/throttle"; // 変更
import { loggger } from "@/utils/log";

interface PostDeliveriesScoresRequestDB extends DBSchema {
  motions: {
    key: number;
    value: {
      x: number;
      y: number;
      z: number;
      timestamp: number;
    };
  };
  orientations: {
    key: number;
    value: {
      alpha: number;
      beta: number;
      gamma: number;
      timestamp: number;
    };
  };
}

interface MotionData {
  x: number;
  y: number;
  z: number;
}

interface OrientationData {
  alpha: number;
  beta: number;
  gamma: number;
}

const DataCollectorButton: React.FC = () => {
  const router = useRouter();
  const [deliveryStarted, setDeliveryStarted] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [sendSuccess, setSendSuccess] = useState<boolean | null>(null);

  const dbRef = useRef<IDBPDatabase<PostDeliveriesScoresRequestDB> | null>(
    null
  );

  const initializeDB = useCallback(async () => {
    try {
      const db = await openDB<PostDeliveriesScoresRequestDB>(
        "PostDeliveriesScoresRequestDB",
        1,
        {
          upgrade(db) {
            if (!db.objectStoreNames.contains("motions")) {
              db.createObjectStore("motions", { autoIncrement: true });
            }
            if (!db.objectStoreNames.contains("orientations")) {
              db.createObjectStore("orientations", { autoIncrement: true });
            }
          },
        }
      );
      dbRef.current = db;
      console.log("IndexedDBが初期化されました。");
    } catch (error) {
      console.error("IndexedDBの初期化中にエラーが発生しました:", error);
    }
  }, []);

  useEffect(() => {
    initializeDB();
  }, [initializeDB]);

  // スロットリングを適用したデバイスモーションイベントハンドラー
  const handleDeviceMotion = useCallback(
    throttle(
      async (event: DeviceMotionEvent) => {
        const { accelerationIncludingGravity } = event;
        if (accelerationIncludingGravity) {
          const data: MotionData & { timestamp: number } = {
            x: accelerationIncludingGravity.x || 0,
            y: accelerationIncludingGravity.y || 0,
            z: accelerationIncludingGravity.z || 0,
            timestamp: Date.now(),
          };
          try {
            const db = dbRef.current;
            if (!db) {
              throw new Error("IndexedDBが初期化されていません。");
            }
            const tx = db.transaction("motions", "readwrite");
            const store = tx.objectStore("motions");
            await store.add(data);
            await tx.done;
            console.log("motionsデータをIndexedDBに保存しました:", data);
          } catch (error) {
            console.error(
              "motionsデータの保存中にエラーが発生しました:",
              error
            );
          }
        }
      },
      1000,
      { leading: true, trailing: false }
    ), // 1000ミリ秒（1秒）にスロットル
    []
  );

  // スロットリングを適用したデバイスオリエンテーションイベントハンドラー
  const handleDeviceOrientation = useCallback(
    throttle(
      async (event: DeviceOrientationEvent) => {
        const data: OrientationData & { timestamp: number } = {
          alpha: event.alpha || 0,
          beta: event.beta || 0,
          gamma: event.gamma || 0,
          timestamp: Date.now(),
        };
        try {
          const db = dbRef.current;
          if (!db) {
            throw new Error("IndexedDBが初期化されていません。");
          }
          const tx = db.transaction("orientations", "readwrite");
          const store = tx.objectStore("orientations");
          await store.add(data);
          await tx.done;
          console.log("orientationsデータをIndexedDBに保存しました:", data);
        } catch (error) {
          console.error(
            "orientationsデータの保存中にエラーが発生しました:",
            error
          );
        }
      },
      1000,
      { leading: true, trailing: false }
    ), // 1000ミリ秒（1秒）にスロットル
    []
  );

  // デリバリー開始関数
  const startDelivery = useCallback(async () => {
    if (
      typeof DeviceMotionEvent !== "undefined" &&
      // @ts-ignore
      typeof DeviceMotionEvent.requestPermission === "function"
    ) {
      try {
        // @ts-ignore
        const response = await DeviceMotionEvent.requestPermission();
        if (response === "granted") {
          window.addEventListener("devicemotion", handleDeviceMotion);
          window.addEventListener("deviceorientation", handleDeviceOrientation);
          console.log(
            "devicemotion と deviceorientation のイベントリスナーが追加されました。"
          );
          setDeliveryStarted(true);
        } else {
          alert("デバイスモーションへのアクセスが拒否されました。");
        }
      } catch (error) {
        console.error(
          "デバイスモーション許可リクエスト中にエラーが発生しました:",
          error
        );
        alert("デバイスモーション許可リクエスト中にエラーが発生しました。");
      }
    } else {
      // iOS 13未満や非対応デバイスの場合、自動的にイベントリスナーをセットアップ
      window.addEventListener("devicemotion", handleDeviceMotion);
      window.addEventListener("deviceorientation", handleDeviceOrientation);
      console.log(
        "devicemotion と deviceorientation のイベントリスナーが追加されました（自動設定）。"
      );
      setDeliveryStarted(true);
    }
  }, [handleDeviceMotion, handleDeviceOrientation]);

  // データ送信関数
  const sendDataToAPI = useCallback(async () => {
    setIsSending(true);
    setSendSuccess(null);
    try {
      const db = dbRef.current;
      if (!db) {
        throw new Error("IndexedDBが初期化されていません。");
      }

      // motions と orientations の全データを取得
      const motions = await db.getAll("motions");
      const orientations = await db.getAll("orientations");

      // motions と orientations のデータ数を取得
      const motionsCount = motions.length;
      const orientationsCount = orientations.length;

      if (motionsCount === 0 && orientationsCount === 0) {
        alert("送信するデータがありません");
        setIsSending(false);
        return;
      }

      // データ数をログに表示
      // console.log(`送信するmotionsデータ数: ${motionsCount}`);
      // console.log(`送信するorientationsデータ数: ${orientationsCount}`);

      // APIスキーマに合わせてデータを構築
      const payload = {
        motions,
        orientations,
      };
      // loggger(payload);

      // バックエンドにデータを送信 (fetchを使用)
      const response = await fetch(
        "/server/data",
        // "https://localhost/api/v1/deliveries/123e4567-e89b-12d3-a456-426614174000/scores",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) {
        throw new Error(
          `サーバーエラー: ${response.status} ${response.statusText}`
        );
      }
      
      const responseData = await response.json();
      loggger("-----responseData-----");
      loggger(responseData);
      localStorage.setItem("response", JSON.stringify(responseData));
      setSendSuccess(true);

      // 送信後、IndexedDBのデータをクリア
      const tx = db.transaction(["motions", "orientations"], "readwrite");
      await tx.objectStore("motions").clear();
      await tx.objectStore("orientations").clear();
      await tx.done;

      // 結果ページへ遷移
      await router.push("/result");
    } catch (error: any) {
      console.error(
        "バックエンドへのデータ送信中にエラーが発生しました:",
        error
      );
      setSendSuccess(false);
      alert(error.message);
    } finally {
      setIsSending(false);
    }
  }, [router]);

  // ボタンのクリックハンドラー
  const handleButtonClick = () => {
    if (!deliveryStarted) {
      startDelivery();
    } else {
      sendDataToAPI();
    }
  };

  return (
    <button
      className="bg-white text-[#D70F64] font-bold py-2 px-4 rounded-lg text-lg"
      onClick={handleButtonClick}
      disabled={isSending}
    >
      {isSending
        ? "送信中..."
        : deliveryStarted
        ? sendSuccess === null
          ? "データを送信"
          : sendSuccess
          ? "送信成功!"
          : "送信失敗"
        : "デリバリー開始"}
    </button>
  );
};

export default DataCollectorButton;
