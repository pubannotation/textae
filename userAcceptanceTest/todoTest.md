# 対応予定のテスト

## 該当 Attribute のない Entity を選択しているときに、ショートカットキーから Attribute インスタンスを削除しようとしたら警告を表示する

### 背景

1. 6.4.58 で無効理由を title タグで記述します
2. ショートカットキーから削除できないときも、同様の情報をアラート表示します。

### -- 手段 --

1. Editor1 を選択
2. Term モードにする
3. Attribute のない Entity を一つ選択する
4. `shift`キーを押しながら、`1`キーを押す
5. `Some selected items has zero or multi this attribute.`がアラート表示されること

## 該当 Attribute を持つアイテムを選択しているときに、パレットの Attribute 削除ボタンを有効にする

### 背景

1. 6.4.58 で無効理由を title タグで記述します

### -- 手段 --

1. Editor1 を選択
2. Term モードにする
3. Attribute のない Entity を一つ選択する
4. `q` キーを押してパレットを開く
5. `denote` タブを選ぶ
6. `remove form`ボタンが無効であること
7. title が`None of the selected items has this attribute.`であること
8. `add to`ボタンを押す
9. `remove form`ボタンが有効になること
