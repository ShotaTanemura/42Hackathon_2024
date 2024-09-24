// src/components/DataCollector.tsx
import React, { useEffect, useState, useCallback } from "react";
import { openDB, DBSchema } from "idb";
import { useRouter } from "next/navigation";

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

const DataCollectorButton: React.FC = () => {
  const router = useRouter();
  const [deliveryStarted, setDeliveryStarted] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [sendSuccess, setSendSuccess] = useState<boolean | null>(null);

  // IndexedDB の初期化
  const initializeDB = useCallback(async () => {
    try {
      await openDB<PostDeliveriesScoresRequestDB>(
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
    } catch (error) {
      console.error("IndexedDBの初期化中にエラーが発生しました:", error);
    }
  }, []);

  useEffect(() => {
    initializeDB();
  }, [initializeDB]);

  // デバイスモーションイベントハンドラー
  const handleDeviceMotion = useCallback(async (event: DeviceMotionEvent) => {
    const { acceleration } = event;
    if (acceleration) {
      const data = {
        x: acceleration.x || 0,
        y: acceleration.y || 0,
        z: acceleration.z || 0,
      };
      try {
        const db = await openDB<PostDeliveriesScoresRequestDB>(
          "PostDeliveriesScoresRequestDB",
          1
        );
        await db.add("motions", data);
      } catch (error) {
        console.error("加速度データの保存中にエラーが発生しました:", error);
      }
    }
  }, []);

  // デバイスオリエンテーションイベントハンドラー
  const handleDeviceOrientation = useCallback(
    async (event: DeviceOrientationEvent) => {
      const data = {
        alpha: event.alpha || 0,
        beta: event.beta || 0,
        gamma: event.gamma || 0,
      };
      try {
        const db = await openDB<PostDeliveriesScoresRequestDB>(
          "PostDeliveriesScoresRequestDB",
          1
        );
        await db.add("orientations", data);
      } catch (error) {
        console.error("傾きデータの保存中にエラーが発生しました:", error);
      }
    },
    []
  );

  // デリバリー開始（許可リクエストを擬似化）
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
      setDeliveryStarted(true);
    }
  }, [handleDeviceMotion, handleDeviceOrientation]);

  // データ送信関数
  const sendDataToAPI = useCallback(async () => {
    setIsSending(true);
    setSendSuccess(null);
    try {
      const db = await openDB<PostDeliveriesScoresRequestDB>(
        "PostDeliveriesScoresRequestDB",
        1
      );

      // motions と orientations の全データを取得
      const motions = await db.getAll("motions");
      const orientations = await db.getAll("orientations");

      if (motions.length === 0 && orientations.length === 0) {
        console.log("送信するデータがありません");
        setIsSending(false);
        return;
      }

      // APIスキーマに合わせてデータを構築
      const payload = {
        motions,
        orientations,
      };

      // バックエンドにデータを送信 (fetchを使用)
      const response = await fetch("https://localhost/api/v1/deliveries/123e4567-e89b-12d3-a456-426614174000/scores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(
          `サーバーエラー: ${response.status} ${response.statusText}`
        );
      }

      const responseData = await response.json();
      console.log(responseData);
      setSendSuccess(true);

      // 送信後、IndexedDBのデータをクリア
      const tx = db.transaction(["motions", "orientations"], "readwrite");
      await tx.objectStore("motions").clear();
      await tx.objectStore("orientations").clear();
      await tx.done;

      // 結果ページへ遷移
      await router.push("/result");
    } catch (error) {
      console.error(
        "バックエンドへのデータ送信中にエラーが発生しました:",
        error
      );
      setSendSuccess(false);
    } finally {
      setIsSending(false);
    }
  }, [router]);

  // クリーンアップ: コンポーネントがアンマウントされる際にイベントリスナーを削除
  useEffect(() => {
    return () => {
      window.removeEventListener("devicemotion", handleDeviceMotion);
      window.removeEventListener("deviceorientation", handleDeviceOrientation);
    };
  }, [handleDeviceMotion, handleDeviceOrientation]);

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
      {deliveryStarted ? "Delivery Done!" : "Delivery Start"}
    </button>
  );
};

export default DataCollectorButton;
