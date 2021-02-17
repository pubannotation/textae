# 対応予定のテスト

## String Attribute を編集ダイアログから追加・編集

### 背景

1.  5.2.3 で編集ダイアログの編集機能は廃止され、パレットを開くボタンに代わりました
2.  6.5.0 で 編集ダイアログの編集ボタンから、パレットを経由せずに、直接 String Attribute 編集ダイアログを開くようにしました

### DenotationEntity

1.  Editor1 を選択
2.  Term モードにする
3.  Attribute を持たない DenotationEntity を選択する
4.  `W` キーを押して Entity 編集ダイアログを開く
5.  `free_text_predicate` ボタンを押す
6.  Value が`Down the Rabbit Hole`の`free_text_predicate` Attribute が追加されること
7.  `Edit`ボタンを押す
8.  String Attribute 編集ダイアログ が開くこと
9.  Object を`123`に変更して`OK`ボタンを押す
10. Entity 編集ダイアログ上の Value 欄の値が`123`に変わること
11. Entity 編集ダイアログ上の Label 欄の値が`High`に変わること
12. もう一度`free_text_predicate` ボタンを押す
13. Value が`Down the Rabbit Hole`の`free_text_predicate` Attribute が追加されること
14. `OK`ボタンをおす
15. DenotationEntity の Attribute のラベルが`High`と`Down the Rabbit Hole`になること

## 起動時のアノテーションとコンフィグレーションの読込に失敗したら、初期状態になること

### 背景

1. 初期読込に失敗すると OriginalData が設定されません
2. アノテーション保存ダイアログを開こうとすると、OriginalData を参照しようとしてエラーが起きます
3. 初期読込に失敗するパターンを整理中

### -- 手段 --

1. <http://localhost:8000/dist/initial_load_error.html> を開く
2. 赤いアラートが 4 つでること
3. Editor0 中に`Currently, the document is empty. Use the "import" button or press the key "i" to open a document with annotation.`が表示されること
4. Editor0 を選択
5. アノテーション保存ダイアログが開けること
6. Editor1 中に`Currently, the document is empty. Use the "import" button or press the key "i" to open a document with annotation.`が表示されること
7. Editor1 を選択
8. アノテーション保存ダイアログが開けること
9. Editor2 中に`Currently, the document is empty. Use the "import" button or press the key "i" to open a document with annotation.`が表示されること
10. Editor2 を選択
11. アノテーション保存ダイアログが開けること
12. Editor3 中に`Currently, the document is empty. Use the "import" button or press the key "i" to open a document with annotation.`が表示されること
13. Editor3 を選択
14. アノテーション保存ダイアログが開けること

## 左右キーで選択 Entity を変更

### 背景

1.  左右キーで移動する Entity の順序を DOM の順序から取得します
2.  Grid を作るときは右の Span の Grid の前に挿入します
3.  6.1.26 で右の Span の Grid の取得に失敗して、作成した Grid を、常に最後尾に追加していました
4.  左右キーで移動する Entity の順序が、見た目上の Grid の順序ではなく、追加した順になっていました
5.  6.1.29 で対応しました。

### -- 手段 --

1.  既存の Span より左に Span を追加する
2.  追加した Span の Entity を選択する
3.  `右キー`を押す
4.  右隣の Entity が選択されること
5.  `左キー`を押す
6.  左隣の Entity が選択されること

### 左右キーで端っこより先に選択を変更できない

#### Term モード

1.  先頭の Entity を選択する
2.  `左キー`を押す
3.  選択する Entity が変わらないこと
4.  最後の Entity を選択する
5.  `右キー`を押す
6.  選択する Entity が変わらないこと

#### Simple モード

1.  先頭の Entity label を選択する
2.  `左キー`を押す
3.  選択する Entity label が変わらないこと
4.  最後の Entity label を選択する
5.  `右キー`を押す
6.  選択する Entity が変わらないこと

#### Relation モード

1.  先頭の Entity を選択する
2.  `左キー`を押す
3.  選択する Entity が変わらないこと
4.  最後の Entity を選択する
5.  選択する Entity が変わらないこと
6.  `右キー`を押す

## 左右キーに連動してスクロールすること

### 背景

1.  5.0.0 で Attribute を追加した際に、Type の DOM 構造を変更しました
2.  DOM の取得に previousElementSibling, nextElementSibling を使っているところを Element.closest または Element.querySelector におきかえました。
3.  機能が壊れていないか確認します。
4.  6.2.49 で BlockSpan をつくったときにドキュメントの最上部までスクロールしない対応を入れた際に、DenotationEntity を選択した際にスクロールしなくなっていました。
5.  6.4.11 で対応

### Term モードの Entity

1.  Term モードにする
2.  Entity を選択する
3.  `左キー`を何回も押して、表示領域外の Entity を選択する
4.  選択した Entity が表示される位置に表示されること
5.  `右キー`を何回も押して、表示領域外の Entity を選択する
6.  選択した Entity が表示される位置に表示されること

### Span

1.  Span を選択する
2.  `左キー`を何回も押して、表示領域外の Span を選択する
3.  選択した Span が表示される位置に表示されること
4.  `右キー`を何回も押して、表示領域外の Span を選択する
5.  選択した Span が表示される位置に表示されること

## 左右キーで選択 Span を変更

### -- 手段 --

1.  Span を選択する
2.  `左キー`を押す
3.  左隣の Span が選択されること
4.  `右キー`を押す
5.  右隣の Span が選択されること

### 左右キーで端っこより先に選択を変更できない

#### Term モード

1.  先頭の Span を選択する
2.  `左キー`を押す
3.  選択する Span が変わらないこと
4.  最後の Span を選択する
5.  `右キー`を押す
6.  選択する Span が変わらないこと

#### Simple モード

1.  先頭の Span を選択する
2.  `左キー`を押す
3.  選択する Span が変わらないこと
4.  最後の Span を選択する
5.  `右キー`を押す
6.  選択する Span が変わらないこと
