// app/api/data/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 型定義
interface Motion {
  x: number;
  y: number;
  z: number;
  timestamp: number;
}

interface Orientation {
  alpha: number;
  beta: number;
  gamma: number;
  timestamp: number;
}

interface PostDeliveriesScoresRequest {
  motions: Motion[];
  orientations: Orientation[];
}

function resampleTo1Hz<T extends { timestamp: number }>(data: T[]): T[] {
  if (!data || data.length === 0) {
    return [];
  }

  // タイムスタンプでソート
  const sortedData = data.sort((a, b) => a.timestamp - b.timestamp);

  const resampledData: T[] = [];
  let currentSecond = Math.floor(sortedData[0].timestamp / 1000);
  let bucket: T[] = [];

  for (const item of sortedData) {
    const itemSecond = Math.floor(item.timestamp / 1000);

    if (itemSecond !== currentSecond) {
      if (bucket.length > 0) {
        // 平均値を取る例（数値フィールドのみ対応）
        const averagedItem = {} as T;
        const keys = Object.keys(bucket[0]) as (keyof T)[];
        for (const key of keys) {
          if (typeof bucket[0][key] === 'number') {
            const sum = bucket.reduce((acc, curr) => acc + (curr[key] as unknown as number), 0);
            (averagedItem[key] as unknown as number) = sum / bucket.length;
          } else {
            averagedItem[key] = bucket[0][key];
          }
        }
        resampledData.push(averagedItem);
      }
      currentSecond = itemSecond;
      bucket = [item];
    } else {
      bucket.push(item);
    }
  }

  // 最後のバケットを追加
  if (bucket.length > 0) {
    const averagedItem = {} as T;
    const keys = Object.keys(bucket[0]) as (keyof T)[];
    for (const key of keys) {
      if (typeof bucket[0][key] === 'number') {
        const sum = bucket.reduce((acc, curr) => acc + (curr[key] as unknown as number), 0);
        (averagedItem[key] as unknown as number) = sum / bucket.length;
      } else {
        averagedItem[key] = bucket[0][key];
      }
    }
    resampledData.push(averagedItem);
  }

  return resampledData;
}

export async function POST(request: NextRequest) {
  try {
    const data: PostDeliveriesScoresRequest = await request.json();

    // データのバリデーション
    if (!data.motions || !Array.isArray(data.motions)) {
      return NextResponse.json(
        { error: "Invalid motions data" },
        { status: 400 }
      );
    }

    if (!data.orientations || !Array.isArray(data.orientations)) {
      return NextResponse.json(
        { error: "Invalid orientations data" },
        { status: 400 }
      );
    }

    // データを1Hzに整形
    const resampledMotions = resampleTo1Hz(data.motions);
    const resampledOrientations = resampleTo1Hz(data.orientations);

    // 整形後のデータをログに出力
    console.log("Resampled motions (1Hz):", resampledMotions.length);
    console.log("Resampled orientations (1Hz):", resampledOrientations.length);

    // 正しいフォーマットに変換
    const formattedMotions = resampledMotions.map((motion) => ({
      motion: {
        x: motion.x,
        y: motion.y,
        z: motion.z,
      },
    }));

    const formattedOrientations = resampledOrientations.map((orientation) => ({
      orientations: {
        alpha: orientation.alpha,
        beta: orientation.beta,
        gamma: orientation.gamma,
      },
    }));

    // Payloadの生成
    const payload = {
      motions: formattedMotions,
      orientations: formattedOrientations,
    };

    const response = await fetch("https://192.168.0.150/api/v1/deliveries/123e4567-e89b-12d3-a456-426614174000/scores", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      console.error("外部APIからのエラーレスポンス:", response.statusText);
      return NextResponse.json({ error: "Failed to send data to external API" }, { status: response.status });
    }
    
    const responseData = await response.json();
    return NextResponse.json(responseData, { status: 200 });    
  } catch (error) {
    console.error("データの処理中にエラーが発生しました:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
