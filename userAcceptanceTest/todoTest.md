# 対応予定のテスト

## Entity 編集ダイアログで Entity と Attribute の情報を編集

### 背景

1.  5.0.0 から Attribute が追加されました。
2.  Type は`Predicate`が`type`になりました。
3.  Type の`id`は`Value`に呼び方が変りました。
4.  6.3.31 で HTML 生成用のテンプレートを Handlebars.js からテンプレートリテラルに変えたときに、ラベルを持たない Entity のラベルに null と表示されるようになりました。
5.  6.4.16 で対応
6.  6.4.1 で、Annotation ファイルの読込時 Validation での Attribute のチェックを緩め、 1 つの Entity に Predicate と Object が等しい Attribute が複数ついているかのチェックに変更しました
7.  6.4.70 で、重複 Attribute を Entity 編集ダイアログに表示できるようにしました
8.  Entity 編集ダイアログに表示する Entity を Attribute も Predicate と Value という同じ見出しも持っている
9.  6.4.82 で、要素毎に見出しを表示するのをやめて、テーブルで表示し、テーブルヘッダーに見出しをまとめました
10. 6.4.83 で、Attribute の Predicate と Value をテキストにし、編集・削除ボタンをアイコンにしました
11. 6.4.84 で Attribute の定義順に並べることにしました
12. 6.4.86 で、同一の pred は一回だけ表示するようにしました
13. 6.4.90 で、Attribute の pred と一緒にショートカットキーを表示するようにしました
14. 6.4.104 で Attribute の label を表示するようにしました
15. pred のショートカットキーと見せかけて、Attribute インスタンスの index を表示していました。正しくは Attribute 定義のインデックスである必要があります
16. 6.4.105 で対応しました
17. 6.4.106 で Attribute 追加ボタンを追加しました
18. 削除ボタンを押した際は、ダイアログの内容全体を更新せずに、対象の Attribute 行を削除していたため、削除した Attribute が追加ボタンに再表示されませんでした
19. 6.4.109 で対応しました
20. 6.4.110 で、Attribute 追加ボタンは 2 行まで表示するようにしました。
21. 6.4.111 で、テーブルの高さを制限しました
22. 6.4.112 で、ショートカットキーのカラムを分けました
23. 6.4.113 で、追加不可能な Attribute 追加ボタンの表示を、非表示から無効に変更しました
24. 6.4.156 で、Attribute アイコンを表示するようにしました

### DenotationEntity

1.  Editor1 を選択
2.  Term モードにする
3.  DenotationEntity `E1:a:b` を選択する
4.  `Change Label[W]`ボタンを押す
5.  編集ダイアログが開くこと
6.  ダイアログのタイトルが`Please edit type and attributes`であること
7.  1 行目の`Predicate`カラムに`type`、`Value`カラムに`null`が表示されること
8.  2 行目の最初のカラムに`1`、`Predicate`カラムに`[list icon] denote`、`Value`カラムに`equivalentTo`が表示されること
9.  2 行目の`Predicate`カラムと`Value`カラムがテキストであること
10. 2 行目の編集ボタンと削除ボタンにアイコンが表示されていること
11. 3 行目の`Predicate`カラムに空文字、`Value`カラムに`http://www.yahoo.co.jp/eeeeeeeeeeeeeeeeeoaoeuaoeuaoue`、`Label`カラムに`Regulation`が表示されること
12. 4 行目の最初のカラムに`4`、`Predicate`カラムに`[thermometer icon] score`、`Value`カラムに`0.1`、`Label`カラムに`Low`が表示されること
13. 5 行目の最初のカラムに`5`、`Predicate`カラムに`[speech balloon icon] flee_text_predicate`、`Value`カラムに`1`、`Label`カラムに`High`が表示されること
14. 6 行目の最初のカラムに`7`、`Predicate`カラムに`[flag icon]S peculation`、`Value`カラムに`ture`、`Label`カラムに`?`が表示されること
15. テーブルの下に Attribute 追加ボタンがあること
16. Attribute 追加ボタンは 2 行表示されそれ以降を見るためにスクロールできること
17. Attribute 追加ボタンのラベルが Attribute の アイコンと predicate であること
18. `error`ボタンをクリックすると、Value`true`でテーブルに追加されること
19. `warning`ボタンをクリックすると、Value`true`でテーブルに追加されること
20. テーブルに縦スクロールバーが表示されること
21. Attribute 追加ボタンに`Speculation`が無効で表示されていること
22. `7:Speculation`の削除ボタン押す
23. Attribute 追加ボタンに`Speculation`が有効になること

### BlockEntity

1.  Editor1 を選択
2.  Block モードにする
3.  BlockEntity `B1` を選択する
4.  `Change Label[W]`ボタンを押す
5.  編集ダイアログが開くこと
6.  ダイアログのタイトルが`Please edit type and attributes`であること
7.  1 行目の`Predicate`カラムに`type`、`Value`カラムに`block1`、`Label`カラムに`Label of block1` が表示されること
8.  2 行目の`Predicate`カラムに`1:denote`、`Value`カラムに`equivalentTo`が表示されること
9.  3 行目の`Predicate`カラムに空文字、`Value`カラムに`http://www.yahoo.co.jp/eeeeeeeeeeeeeeeeeoaoeuaoeuaoue`が表示されること

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
