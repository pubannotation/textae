# 対応予定のテスト

## アノテーション保存先 URL は、読み込んだアノテーションの URL

### 背景

1.  Save Annotations ダイアログの保存ファイルの初期値は、最後に読み込んだアノテーションのファイル名です
2.  6.1.4 で対応しました
3.  不正なアノテーションを読み込んだときに、アノテーションを適用しません。
4.  不正なアノテーションを読み込んだときに、その URL を保存していました。
5.  対応バージョン未定

### -- 手段 --

1.  editor1 を選択
2.  アノテーション読込ダイアログを開く
3.  `/dev/invalid_color_annotation.json`を読み込む
4.  右上に`Invalid configuration: '<span style='color:red'>Invalid color format</span>' is invalid color format.`と赤色のトースト表示がされること
5.  Save Annotations ダイアログを開く
6.  URL 欄に`http://pubannotation.org/projects/DisGeNET/docs/sourcedb/PubMed/sourceid/10021369/annotations.json`が表示されていること

## コンフィグレーション保存先 URL は、読み込んだコンフィグレーションの URL

### 背景

1.  Save Configurations ダイアログの保存先 URL の初期値は、最後に読み込んだコンフィグレーションの URL です
2.  読み込んだアノテーションファイルにコンフィグレーションが含まれず、textae の HTML 属性でコンフィグレーションの URL が指定されているときは、指定 URL からコンフィグレーションを読み込みます。このときは読み込んだ URL を保存していませんでした。
3.  コンフィグレーション読込ダイアログから、不正なコンフィグレーションを読み込んだときに、コンフィグレーションを適用しません。その URL を保存していました。
4.  6.1.3 で対応しました

### -- 手段 --

1.  editor1 を選択
2.  アノテーション読込ダイアログを開く
3.  `/dev/2_annotations.json`を読み込む
4.  `Select Label [Q]`ボタンをクリックする
5.  Save Configurations ダイアログを開く
6.  URL 欄に`../../dev/1_config.json?aaa`が表示されていること
7.  コンフィグレーション読込ダイアログを開く
8.  URL 欄に`/dev/invalid_attributes_config.json`を入力して`open`ボタンをクリック
9.  Save Configurations ダイアログを開く
10. URL 欄に`../../dev/1_config.json?aaa`が表示されていること

## アノテーション保存

### 保存ファイル名は、読み込んだアノテーションのファイル名

#### 背景

1.  Save Annotations ダイアログの保存ファイルの初期値は、最後に読み込んだアノテーションのファイル名です
2.  6.1.4 で対応しました

#### -- 手段 --

1.  editor0 を選択
2.  アノテーション読込ダイアログを開く
3.  ローカルファイルから`1_annotations.json`を読み込む
4.  Save Annotations ダイアログを開く
5.  Local 欄に`1_annotations.json`が表示されていること

### Clipboard

#### 背景

1.  5.3.4 で、JSON フォーマットを 2 回 stringfy して壊れていまた
2.  6.1.2 で対応

#### -- 手段 --

1.  Save Annotations ダイアログを開く
2.  `Click to see the json source in a new window`をクリックする
3.  新しいタブが開いて annotation.json が表示されること
4.  `{\"target\"`のようにエスケープ用のバックスラッシュが入っていないこと
5.  表示した json に変更内容が反映されていること

### URL

1.  Editor1 を選択
2.  Save Annotations ダイアログを開く
3.  URL に保存する
4.  指定したファイル名`.dev_data.json`のファイルができていること
5.  指定したファイル名`.dev_data.json`のファイルに変更内容が反映されていること

### Local

1.  Save Annotations ダイアログを開く
2.  Local に保存する
3.  指定したファイル名のファイルがダウンロードできること
4.  ダウンロードしたファイルに変更内容が反映されていること

### URL が指定されていなければ save ボタンを押せない

1.  Save Annotations ダイアログを開く
2.  URL 欄を空にする
3.  保存ダイアログ上の Save ボタンが無効になること

## コンフィグレーション保存

### 背景

1.  5.0.0 でコンフィグレーションの保存機能を追加しました

### 保存ファイル名は、読み込んだコンフィグレーションのファイル名

#### 背景

1.  Save Configurations ダイアログの保存ファイルの初期値は、最後に読み込んだコンフィグレーションのファイル名です
2.  6.1.4 で対応しました

#### -- 手段 --

1.  editor0 を選択
2.  `Select Label [Q]`ボタンをクリックする
3.  コンフィグレーション読込ダイアログを開く
4.  ローカルファイルから`1_config.json`を読み込む
5.  `Select Label [Q]`ボタンをクリックする
6.  Save Configurations ダイアログを開く
7.  Local 欄に`1_config.json`が表示されていること

### URL を指定して保存

1.  editor1 を選択
2.  `Select Label [Q]`ボタンをクリックする
3.  Save Configurations ダイアログを開く
4.  URL に保存する
5.  指定したファイル名`.dev_data.json`のファイルができていること
6.  指定したファイル名`.dev_data.json`のファイルに変更内容が反映されていること

### Local ファイルに保存

1.  editor1 を選択
2.  `Select Label [Q]`ボタンをクリックする
3.  Save Configurations ダイアログを開く
4.  Local に保存する
5.  指定したファイル名のファイルがダウンロードできること
6.  ダウンロードしたファイルに変更内容が反映されていること

### URL が指定されていなければ save ボタンを押せない

1.  editor1 を選択
2.  `Select Label [Q]`ボタンをクリックする
3.  Save Configurations ダイアログを開く
4.  URL 欄を空にする
5.  保存ダイアログ上の Save ボタンが無効になること

### コンフィグレーション保存時にメッセージを alertify.js で表示

#### 背景

1.  5.0.0 開発中にサーバーに保存するときの、トーストメッセージが間違っていました

#### -- 手段 --

1.  editor1 を選択
2.  `Select Label [Q]`ボタンをクリックする
3.  Save Configurations ダイアログを開く
4.  `Save`ボタンをクリックする
5.  右上に`configuration saved`と緑色のトースト表示がされること

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
5.  `右キー`を押す
6.  選択する Entity が変わらないこと

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
