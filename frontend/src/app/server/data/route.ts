// app/api/data/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 型定義
interface Motion {
  x: number;
  y: number;
  z: number;
}

interface Orientation {
  alpha: number;
  beta: number;
  gamma: number;
}

interface PostDeliveriesScoresRequest {
  motions: Motion[];
  orientations: Orientation[];
}

export async function POST(request: NextRequest) {
  try {
    const data: PostDeliveriesScoresRequest = await request.json();

    // データのバリデーション（必要に応じて追加）
    if (!data.motions || !Array.isArray(data.motions)) {
      return NextResponse.json({ error: 'Invalid motions data' }, { status: 400 });
    }

    if (!data.orientations || !Array.isArray(data.orientations)) {
      return NextResponse.json({ error: 'Invalid orientations data' }, { status: 400 });
    }

    // データの処理（デモとしてコンソールに出力）
    console.log('Received motions:', data.motions);
    console.log('Received orientations:', data.orientations);

    // ここで必要な処理を実装（例: データベースに保存、スコア計算など）

    // 成功レスポンスを返す
    return NextResponse.json({ message: 'データを正常に受け取りました。' }, { status: 200 });
  } catch (error) {
    console.error('データの処理中にエラーが発生しました:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
