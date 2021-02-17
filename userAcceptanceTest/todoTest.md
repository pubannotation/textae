# 対応予定のテスト

## String Attribute 定義の Value の編集

### 背景

1.  5.2.0 から Entity パレットで String Attribute の Value が編集出来るようになりました。

### String Attribute 定義の Value の追加、編集、削除

1.  Editor1 を選択
2.  Term モードにする
3.  `Select Label [Q]`ボタンをクリックする
4.  `free_text_predicate`タブを選択
5.  `Add new value`ボタンをクリックする
6.  `pattern`欄に`abc`を入力する
7.  `label`欄を入力する
8.  `color`欄を入力する
9.  `OK`ボタンを押す
10. パレットに追加した Value が表示されること
11. 削除ボタンが有効であること
12. 新しく free_text_predicate attribute を作る
13. ラベルが Down the Rabbit Hole であること
14. 背景色が水色であること
15. 追加した Value の`Edit this value.`ボタンをクリックする
16. `pattern`欄に`a`を入力する
17. パレットの Value の値が更新されるここと
18. free_text_predicate attribute のラベルと色が更新されるここと
19. 追加した Value の`Remove this value.`ボタンがクリックする
20. 追加した Value が削除されること
21. free_text_predicate attribute のラベルが Down the Rabbit Hole になること
22. free_text_predicate attribute の背景色が水色になること
23. すべてもどす
24. すべてやり直す

## String Attribute インスタンスの Obcjet 変更

### 背景

1. String Attribute インスタンスの Object 変更時はオートコンプリートが使えます
2. 6.3.36 でオートコンプリートで取得したラベルを配置する HTML 要素を消したためエラーが起きていました
3. 6.4.53 で対応していました
4. 6.1.62 で Attribute 定義の更新に Denotation の TypeDefinition.TypeContainer を経由していたのを、Attribute の TypeDefinition.TypeContainer を直接呼び出す変更をしました
5. そのとき、渡す TypeContainer を Denotation から Attribute に変更する修正が漏れていました
6. 必要なメソッドが定義されていないため、エラーが起きていました
7. 6.1.63 で対応しました

### -- 手段 --

1. Editor1 を選択
2. Term モードにする
3. Entity を選択
4. `q`を押してパレットを開く
5. `free_text`タブを選択
6. `add_to`ボタンをクリック
7. `edit_object`ボタンをクリック
8. String Attribute ダイアログの`Object`を`par`に変更
9. 表示された候補を選択
10. `OK`ボタンをクリック
11. エラーが起きないこと

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
