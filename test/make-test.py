import json
import random

def generate_test_data(num_motions=10, num_orientations=10, output_file='testdata.json'):
    """
    指定された数のmotionsとoritentationsデータを生成し、JSONファイルに保存します。

    Parameters:
    - num_motions (int): motions配列に含めるデータポイントの数。
    - num_orientations (int): oritentations配列に含めるデータポイントの数。
    - output_file (str): 出力するJSONファイルの名前。
    """

    # motionsデータの生成
    motions = []
    for _ in range(num_motions):
        motion = {
            "x": random.randint(-10, 10),
            "y": random.randint(-10, 10),
            "z": random.randint(-10, 10)
        }
        motions.append(motion)

    # oritentationsデータの生成
    oritentations = []
    for _ in range(num_orientations):
        orientation = {
            "alpha": random.randint(0, 360),
            "beta": random.randint(-180, 180),
            "gamma": random.randint(-90, 90)
        }
        oritentations.append(orientation)

    # 全体のデータ構造
    data = {
        "postDeliveriesScoresRequest": {
            "motions": motions,
            "oritentations": oritentations
        }
    }

    # JSONファイルへの書き込み
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=4)
        print(f"テストデータが正常に生成され、'{output_file}'に保存されました。")
    except Exception as e:
        print(f"データの書き込み中にエラーが発生しました: {e}")

# 関数の実行例
if __name__ == "__main__":
    generate_test_data(num_motions=50, num_orientations=50, output_file='testdata.json')
