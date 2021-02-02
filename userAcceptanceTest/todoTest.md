# 対応予定のテスト

## パレットからAttribute の追加

### 背景

1.  5.0.0 で Attitude を追加しました
2.  5.2.0 でショートカットキー T を廃止しました
3.  5.2.3 で編集ダイアログの編集機能は廃止され、パレットを開くボタンに代わりました
4.  6.2.71 で Block モードでパレットが開けるようになりました
5.  6.2.79 で で Block モードで、ショートカットキー 1~9 で Attribute の追加ができるようになりました

### -- 手段 --

#### BlockEntity にパレットから Attribute を追加

1.  Editor1 を選択
2.  Block モードにする
3.  BlockEntity を選択する
4.  パレットを開く
5.  denote タブを選択する
6.  `Add to selected entity`ボタンを押す
7.  Attribute が追加されること

#### BlockEntity にパレットから Attribute を追加

1.  Editor1 を選択
2.  Block モードにする
3.  BlockEntity を選択する
4.  パレットを開く
5.  denote タブを選択する
6.  `Add to selected entity`ボタンを押す
7.  Attribute が追加されること

#### BlockEntity にショートカットキーから Attribute を追加

1.  Editor1 を選択
2.  Block モードにする
3.  BlockEntity を選択する
4.  1 キーを押す
5.  Attribute が追加されること

#### DenotationEntity にパレットから Attribute を追加

1.  Editor1 を選択
2.  Term モードにする
3.  DenotationEntity を選択する
4.  パレットを開く
5.  denote タブを選択する
6.  `Add to selected entity`ボタンを押す
7.  Attribute が追加されること

#### DenotationEntity にパレットから Attribute を追加

1.  Editor1 を選択
2.  Term モードにする
3.  DenotationEntity を選択する
4.  パレットを開く
5.  denote タブを選択する
6.  `Add to selected entity`ボタンを押す
7.  Attribute が追加されること

#### DenotationEntity にショートカットキーから Attribute を追加

1.  Editor1 を選択
2.  Term モードにする
3.  DenotationEntity を選択する
4.  1 キーを押す
5.  Attribute が追加されること

## Selection Attribute の編集

### 背景

1.  5.0.0 で、Attribute を追加するためにのショートカットキー T を追加しました
2.  5.0.2 で、1~5 のキーで選択中の Entity へ、Attribute を追加、shift と同時押しで削除するようにしました
3.  5.0.5 で、Attribute のショートカットキーを 1~9 までに増やしました
4.  5.2.0 で、Attribute のショートカットキー T を廃止しました
5.  5.2.3 で編集ダイアログの編集機能は廃止され、パレットを開くボタンに代わりました
6.  6.2.71 で Block モードでパレットが開けるようになりました
7.  6.2.79 で で Block モードで、ショートカットキー 1~9 で Attribute の追加ができるようになりました

### DenotationEntity の Attribute をショートカットキー操作で変更

1.  Editor1 を選択
2.  Term モードにする
3.  DenotationEntity を選択する
4.  1 キーを押す、Attribute を追加されること
5.  1 キーをもう一度押すと、Value 選択用のパレットが表示されること
6.  パレットの Value を押すと、選択中の DenotationEntity の該当 predicate の Attribute の Value が変更できること

### DenotationEntity の Attribute を Entity 編集ダイアログから変更

1.  Editor1 を選択
2.  Term モードにする
3.  DenotationEntity を選択する
4.  1 キーを押す
5.  Attribute が追加されること
6.  W キーを押す
7.  `Edit`ボタンを押す
8.  パレットが開くこと
9.  denote タブが選ばれていること

### BlockEntity の Attribute をショートカットキー操作で変更

1.  Editor1 を選択
2.  Block モードにする
3.  BlockEntity を選択する
4.  1 キーを押す、Attribute を追加されること
5.  1 キーをもう一度押すと、Value 選択用のパレットが表示されること
6.  パレットの Value を押すと、選択中の BlockEntity の該当 predicate の Attribute の Value が変更できること

### BlockEntity の Attribute を Entity 編集ダイアログから変更

1.  Editor1 を選択
2.  Block モードにする
3.  BlockEntity を選択する
4.  1 キーを押す
5.  Attribute が追加されること
6.  W キーを押す
7.  `Edit`ボタンを押す
8.  パレットが開くこと
9.  denote タブが選ばれていること

## Attribute のある Entity と Attribute のない Entity を同時に選択しているとき、その Attribute を編集するショートカットキーを押したら警告を表示する

### 背景

1. 6.4.59 で、Attribute 編集ボタンを有効にする条件を、選択アイテムが「一つでも該当 Attribute を持つ」から「すべてが該当 Attribute をひとつだけ持つ」に変えました
2. 6.4.121 でショートカットキーから Attribute 編集するときの条件を同等にしました

### -- 手段 --

1.  Editor1 を選択
2.  Term モードにする
3.  `T1:a:b`と`E1:a:b`を選択する
4.  `5`キーを押す
5.  `Some selected items has zero or multi this attribute.`が表示されること
6.  `E18`を追加選択する
7.  `5`キーを押す
8.  `Some selected items has zero or multi this attribute.`が表示されること
9.  Attribute のない Entity を一つ選択する
10. `5`キーを押す
11. `Down the Rabbit Hole` Attribute が追加されること

## 該当 Attribute をひとつ持つアイテムだけを選択しているときに、パレットの Attribute 編集ボタンを有効にする

### 背景

1. 6.4.59 で、Attribute 編集ボタンを有効にする条件を、選択アイテムが「一つでも該当 Attribute を持つ」から「すべてが該当 Attribute をひとつだけ持つ」に変えました
2. 6.4.60 で無効理由を title タグで記述します

### -- 手段 --

1. Editor1 を選択
2. Term モードにする
3. Attribute のない Entity を一つ選択する
4. `q` キーを押してパレットを開く
5. `free_text` タブを選ぶ
6. `edit_ofject_of`ボタンが無効であること
7. title が`Some selected items has zero or multi this attribute.`であること
8. `add to`ボタンを押す
9. `edit_ofject_of`ボタンが有効になること
10. `E18`を追加選択する
11. `edit_ofject_of`ボタンが無効になること
12. `E18`だけを選択解除する
13. `edit_ofject_of`ボタンが有効になること
14. Attribute のない Entity を一つ追加選択する
15. `edit_ofject_of`ボタンが無効になること

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

## 該当 Attribute を持たないアイテムを選択しているときに、パレットの Attribute 追加ボタンを有効にする

### 背景

1. 6.4.56 で Attribute 追加ボタンを有効にする条件を、選択アイテムが「一つでも該当 Attribute を持つ」から「一つでも該当 Attribute を持たない」に変えました
1. 6.4.57 で無効理由を title タグで記述します

### -- 手段 --

1. Editor1 を選択
2. Term モードにする
3. Attribute のない Entity を一つ選択する
4. `q` キーを押してパレットを開く
5. `denote` タブを選ぶ
6. `add to`ボタンを押す
7. `add to`ボタンが無効になること
8. title が`All the selected items already have this attribute.`であること
9. Attribute のない Entity をもう一つ追加で選択する
10. `add to`ボタンが有効になること
