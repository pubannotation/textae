# 対応予定のテスト

## Selection Attribute 定義の default でない Value を default に変更して UNDO する

### 背景

1.  5.2.0 から Entity パレットで Selection Attribute の Value が編集出来るようになりました。

### -- 手段 --

1.  Editor1 を選択
2.  Term モードにする
3.  `Select Label [Q]`ボタンをクリックする
4.  `denote`タブを選択
5.  `Cell`の Edit Value ボタンをクリック
6.  `default`をチェックして`OK`をクリック
7.  Undo する
8.  `equivalentTo`が`default`になること

## Selection Attribute 定義の Value が annotation 上で使われているときは、削除不可

### 背景

1.  5.2.0 から Entity パレットで Selection Attribute の Value が編集出来るようになりました。
2.  Selection Attribute 定義の value が annotation 上で使われているときは、削除不可になります。
3.  削除ボタンは見た目上無効になっているだけで、押せば動きました。
4.  6.0.6 で対応しました。

### -- 手段 --

1.  Editor1 を選択
2.  Term モードにする
3.  `Select Label [Q]`ボタンをクリックする
4.  `denote`タブを選択
5.  `Add new value`ボタンをクリックする
6.  `id`欄を入力する
7.  `default`欄にチェックを入れる
8.  `label`欄を入力する
9.  `color`欄を入力する
10. `OK`ボタンを押す
11. パレットに追加した Value が表示されること
12. 削除ボタンが有効であること
13. Entity を選択肢、denote attribute を追加する
14. Value が入力した値であること
15. ラベルが入力した値であること
16. 背景色が入力した値であること
17. 追加した Value の`Remove this value.`ボタンが無効になること
18. 実際に`Remove this value.`ボタンを押しても無反応であること
19. denote attribute をもつ Entity を削除する
20. 追加した Value の`Remove this value.`ボタンが有効になること
21. 追加した Value の`Remove this value.`ボタンがクリックする
22. 追加した Value が削除されること
23. すべてもどす
24. すべてやり直す

## Selection Attribute 定義の Value の編集

### Selection Attribute 定義の Value の id 変更

#### 背景

1.  5.2.0 から Entity パレットで Selection Attribute の Value が編集出来るようになりました。
2.  Selection Attribute 定義の value の id を変更したときに、annotation 上の Attribute の obj の値を更新していなかったため、Attribute 定義と annotation 上の Attribute の情報が乖離するバグがありました。
3.  6.0.6 で対応しました。
4.  6.2.66 で ChangeAttributeCommand のプロパティ名を変更時の修正もれでエラーがおきました。
5.  6.2.72 で対応しました

#### -- 手段 --

1.  Editor1 を選択
2.  パレットを開く
3.  `denote`タブを選択
4.  `Cell`の Edit Value ボタンをクリック
5.  `id`を変更して`OK`をクリック
6.  エンティティ`E1:a:b`の Attribute の値が変更されること
7.  すべてもどす
8.  すべてやり直す

### Selection Attribute 定義の Value が唯一のときは、削除不可

#### 背景

1.  Selection Attribute の Value をすべて消そうとするとエラーが起きます
2.  6.1.57 で対応しました。

#### -- 手段 --

1.  Editor1 を選択
2.  Term モードにする
3.  `Select Label [Q]`ボタンをクリックする
4.  `selection`タブを選択
5.  `default`の`Remove this value.`ボタンが無効なこと
6.  `Add new value`ボタンをクリックする
7.  `id`欄を入力する
8.  `OK`ボタンを押す
9.  `default`の`Remove this value.`ボタンが有効になること
10. 追加した Value の`Remove this value.`ボタンがクリックする
11. `default`の`Remove this value.`ボタンが無効になること

### Selection Attribute 定義の Value の label、color 変更

#### 背景

1.  5.2.0 から Entity パレットで Selection Attribute の Value が編集出来るようになりました。

#### -- 手段 --

1.  Editor1 を選択
2.  Term モードにする
3.  `Select Label [Q]`ボタンをクリックする
4.  `denote`タブを選択
5.  `Cell`の`Edit this value`ボタンをクリックする
6.  `label`欄を変更する
7.  `color`欄を変更する
8.  `OK`ボタンを押す
9.  パレットの Value の値が更新されるここと
10. エンティティ`E1:a:b`の Attribute のラベルと色が更新されるここと
11. すべてもどす
12. すべてやり直す
