# 対応予定のテスト

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

## BlockEntity にパレットから Attribute を追加

### 背景

1.  6.2.71 で Block モードでパレットが開けるようになりました

### -- 手段 --

1.  Editor1 を選択
2.  Block モードにする
3.  Attribute を持たない BlockEntity を選択する
4.  パレットを開く
5.  denote タブを選択する
6.  `add to`ボタンを押す
7.  Attribute が追加されること

## パレットは重複 Attribute の作成をサポートしない

### 背景

1.  **1 つの Entity に Predicate が等しい Attribute をひとつまでしか持てない** 制約がありました
2.  この制約を **1 つの Entity に Predicate と Object が等しい Attribute をひとつまでしか持てない** に緩めることにしました
3.  パレットからは、1 つの Entity 上の Predicate が重複した Attribute の作成をサポートしません
4.  6.3.32 で、Entity が Boolean または Selection Attribute を持つときに、Entity パレットに Attribute 削除ボタンを表示する代わりに、Attribute 追加ボタンを表示していました
5.  6.4.3 で対応

### -- 手段 --

1.  Editor1 を選択
2.  Term モードにする
3.  Attribute を持たない Entity を選択する
4.  パレットを開く
5.  denote タブを選ぶ
6.  `add to`ボタンを押す
7.  Attribute が追加されること
8.  `add to`ボタンが無効になること
9.  `remove from`ボタンが有効になること
10. `remove from`ボタンを押す
11. Attribute が削除されること
12. `add to`ボタンが有効になること
13. `remove from`ボタンが無効になること
14. error タブを選ぶ
15. `add to`ボタンを押す
16. Attribute が追加されること
17. `add to`ボタンが無効になること
18. `remove from`ボタンが有効になること
19. Entity の選択を解除する
20. `add to`ボタンが非表示になること
21. `remove from`ボタンが非表示になること

## ショートカットキーから重複 Attribute を作成できない

### 背景

1.  **1 つの Entity に Predicate が等しい Attribute をひとつまでしか持てない** 制約がありました
2.  この制約を **1 つの Entity に Predicate と Object が等しい Attribute をひとつまでしか持てない** に緩めることにしました
3.  ショートカットキー操作では、1 つの Entity 上の Predicate が重複した Attribute の作成をサポートしません

### -- 手段 --

1.  Editor1 を選択
2.  Term モードにする
3.  Attribute を持たない Entity を選択する
4.  `1` キーを押す
5.  Attribute が追加されること
6.  `1` キーを押す
7.  パレットが開いて denote タブが選択されていること
8.  Attribute が追加されないこと

## Annotation ファイルの読み込み時に 1 つの Entity に Predicate と Object が等しい Attribute が複数ついているかチェックする

### 背景

1.  5.0.0 で、エディタ上での Attribute の追加・編集機能を追加しました。Annotation ファイルの読み込み時はチェックしていませんでした
2.  5.3.2 から、Annotation ファイルの読み込み時に 1 つの Entity に Predicate が等しい Attribute が複数ついているかチェックします
3.  5.3.5 から、アラートを pred 単位で分けました
4.  6.1.8 から、重複した Attribute を無視し、Validation Dialog に表示します
5.  6.2.93 で`Dupulicated`の typo を修正
6.  6.2.97 で、参照先がない Attribute も、`Duplicated attributes.`テーブルに表示することにしました
7.  6.2.100 で、BlockEntity の Attribute の重複チェックを追加しました
8.  この制約を **1 つの Entity に Predicate と Object が等しい Attribute をひとつまでしか持てない** に緩めることにしました
9.  6.4.1 で、Annotation ファイルの読込時 Validation での Attribute のチェックを緩め、 1 つの Entity に Predicate と Object が等しい Attribute が複数ついているかのチェックに変更しました

### -- 手段 --

1.  アノテーション読込ダイアログを開く
2.  `invlaid.json`を読み込む
3.  Validation Dialog の`Duplicated attributes.`に`A1`と`A2`が表示されること
4.  Validation Dialog を閉じる
5.  DenotationEntity `T3`に Attribute が２つ表示されること
6.  BlockEntity `B9`に Attribute が２つ表示されること

## パレットの Attribute タブの Attribute 情報フォーマット

### 背景

1.  5.0.0 で Attitude を追加しました
2.  6.4.48 で、文言を変更しました
3.  6.4.49 で、文言に選択中のアイテムの数を追加し、ボタンの文言を短くしました
4.  6.4.50 で、アイテムを選択していないときは、ボタンを表示しなくしました
5.  6.4.51 で、value type の説明をアイコンに変更しました
6.  6.4.55 で、Attribute 追加変更削除ボタンの表示・非表示切り替えを、有効・無効切り替えに変更しました
7.  6.4.88 で、6.4.53 で選択アイテム数が表示されなくなっていたのを、直しました
8.  6.4.91 で、6.4.88 で Attribute 定義がないときにパレットを開くとエラーが起きていたのを直しました
9.  6.4.107 で、value type の説明をアイコンのみにしました。また、フラグ Attribute のアイコンをチェックボックスからフラッグに変えました

### Attribute 定義がないとき

1. Editor0 を選択
2. Term モードにする
3. `q` キーを押してパレットを開く
4. エラーが起きないこと

### Attribute 定義があるとき

1. Editor1 を選択
2. Term モードにする
3. Attribute のない Entity を一つ選択する
4. `q` キーを押してパレットを開く
5. `denote` タブを選ぶ
6. `Attribute [list icon] "denote" [add to] [remove from] the 1 item selected`が表示されること
7. `add to`ボタンが有効であること
8. `remove from`ボタンが無効であること
9. `error` タブを選ぶ
10. `Attribute [flag icon] "error" [add to] [remove from]the 1 item selected` が表示されること
11. `add to`ボタンが有効であること
12. `remove from`ボタンが無効であること
13. `score` タブを選ぶ
14. `Attribute [thermometer icon] "score" [add to] [edit object of] [remove from]the 1 item selected` が表示されること
15. `add to`ボタンが有効であること
16. `edit object of`ボタンが無効であること
17. `remove from`ボタンが無効であること
18. Entity の選択を解除する
19. `q` キーを押してパレットを開く
20. `denote` タブを選ぶ
21. `Attribute [list icon] "denote"`が表示されること
22. `error` タブを選ぶ
23. `Attribute [flag] icon] "error"` が表示されること

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

## ショートカットキーから Attribute の追加

### 背景

1.  5.0.0 で Attitude を追加しました
2.  5.2.0 でショートカットキー T を廃止しました
3.  6.2.71 で Block モードでパレットが開けるようになりました
4.  6.2.79 で で Block モードで、ショートカットキー 1~9 で Attribute の追加ができるようになりました

### -- 手段 --

#### BlockEntity にショートカットキーから Attribute を追加

1.  Editor1 を選択
2.  Block モードにする
3.  BlockEntity を選択する
4.  1 キーを押す
5.  Attribute が追加されること

#### DenotationEntity にショートカットキーから Attribute を追加

1.  Editor1 を選択
2.  Term モードにする
3.  DenotationEntity を選択する
4.  1 キーを押す
5.  Attribute が追加されること

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
