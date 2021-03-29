# 受け入れテスト

共通確認項目

1.  `npm run dist`を実行します
2.  `npm run dev:server`を実行します
3.  <http://localhost:8000/dist/demo/development.html> を開きます
4.  ブラウザの開発ツールを起動します。
5.  以下のテストを実行して、エラーが出ないこと

## Attribute インスタスがあるアノテーション読み込んでから、Attribute 定義がないアノテーションを読み込む

### 背景

1. アノテーションを読み込むときにコンフィグレーションも読み直しています
2. コンフィグレーションを読みなおしたときにすべての Entity をレンダリングしなおしています
3. Attribute を持つ Entity をレンダリングするときに Attribute の表示名を取得しようとします
4. 6.4.90 で Attribute の表示名を取得するときに、Attribute 定義がなかったときにエラーが起きるようにしました
5. コンフィグレーションがリセット済みのため Attribute 定義が存在しないためエラーが起きます
6. 6.4.141 で対応しました

### -- 手段 --

1. Editor1 を選択
2. `i`キーを押してアノテーション読込ダイアログを開く
3. ローカルファイルから`private.json`を読み込む
4. エラーが起きないこと

## アノテーション保存

### 保存ファイル名は、読み込んだアノテーションのファイル名

#### 背景

1.  アノテーション保存ダイアログの保存ファイルの初期値は、最後に読み込んだアノテーションのファイル名です
2.  6.1.4 で対応しました

#### -- 手段 --

1.  Editor0 を選択
2.  アノテーション読込ダイアログを開く
3.  ローカルファイルから`1_annotations.json`を読み込む
4.  アノテーション保存ダイアログを開く
5.  Local 欄に`1_annotations.json`が表示されていること

### Clipboard

#### 背景

1.  5.3.4 で、JSON フォーマットを 2 回 stringfy して壊れていまた
2.  6.1.2 で対応

#### -- 手段 --

1.  アノテーション保存ダイアログを開く
2.  `Click to see the json source in a new window`をクリックする
3.  新しいタブが開いて annotation.json が表示されること
4.  `{\"target\"`のようにエスケープ用のバックスラッシュが入っていないこと
5.  表示した json に変更内容が反映されていること

### URL

1.  Editor1 を選択
2.  アノテーション保存ダイアログを開く
3.  URL に保存する
4.  指定したファイル名`.dev_data.json`のファイルができていること
5.  指定したファイル名`.dev_data.json`のファイルに変更内容が反映されていること

### Local

1.  アノテーション保存ダイアログを開く
2.  Local に保存する
3.  指定したファイル名のファイルがダウンロードできること
4.  ダウンロードしたファイルに変更内容が反映されていること

### URL が指定されていなければ save ボタンを押せない

1.  アノテーション保存ダイアログを開く
2.  URL 欄を空にする
3.  保存ダイアログ上の Save ボタンが無効になること

## コンフィグレーション保存

### 背景

1.  5.0.0 でコンフィグレーションの保存機能を追加しました

### 保存ファイル名は、読み込んだコンフィグレーションのファイル名

#### 背景

1.  コンフィグレーション保存ダイアログの保存ファイルの初期値は、最後に読み込んだコンフィグレーションのファイル名です
2.  6.1.4 で対応しました

#### -- 手段 --

1.  Editor0 を選択
2.  `Select Label [Q]`ボタンをクリックする
3.  コンフィグレーション読込ダイアログを開く
4.  ローカルファイルから`1_config.json`を読み込む
5.  `Select Label [Q]`ボタンをクリックする
6.  コンフィグレーション保存ダイアログを開く
7.  Local 欄に`1_config.json`が表示されていること

### URL を指定して保存

1.  Editor1 を選択
2.  `Select Label [Q]`ボタンをクリックする
3.  コンフィグレーション保存ダイアログを開く
4.  URL に保存する
5.  指定したファイル名`.dev_data.json`のファイルができていること
6.  指定したファイル名`.dev_data.json`のファイルに変更内容が反映されていること

### Local ファイルに保存

1.  Editor1 を選択
2.  `Select Label [Q]`ボタンをクリックする
3.  コンフィグレーション保存ダイアログを開く
4.  Local に保存する
5.  指定したファイル名のファイルがダウンロードできること
6.  ダウンロードしたファイルに変更内容が反映されていること

### URL が指定されていなければ save ボタンを押せない

1.  Editor1 を選択
2.  `Select Label [Q]`ボタンをクリックする
3.  コンフィグレーション保存ダイアログを開く
4.  URL 欄を空にする
5.  保存ダイアログ上の Save ボタンが無効になること

### コンフィグレーション保存時にメッセージを alertify.js で表示

#### 背景

1.  5.0.0 開発中にサーバーに保存するときの、トーストメッセージが間違っていました

#### -- 手段 --

1.  Editor1 を選択
2.  `Select Label [Q]`ボタンをクリックする
3.  コンフィグレーション保存ダイアログを開く
4.  `Save`ボタンをクリックする
5.  右上に`configuration saved`と緑色のトースト表示がされること

## URL からコンフィグレーションファイルを読み込んだ時に、変更前のコンフィグレーション情報を読み込んだコンフィグレーションに更新する

### 背景

1. 5.0.0 でコンフィグレーションの読込・保存機能を追加しました
2. コンフィグレーション保存ダイアログでは、コンフィグレーション変更前後の diff を表示します
3. diff を取得するために、変更前のコンフィグレーション情報を保存しています
4. 5.3.5 からアノテーションファイルに含まれるコンフィグレーションを、変更前のコンフィグレーション情報をに反映しています
5. 6.1.3 で、URL からコンフィグレーションファイルを読み込んだ時に、変更前のコンフィグレーション情報を読み込んだコンフィグレーションに更新していませんでした
6. diff に表示するコンフィグレーション情報の読み込み前のコンフィグレーションに、アノテーションファイルに含まれるコンフィグレーションのみ反映されていました
7. 6.4.152 で対応しました

### -- 手段 --

1. Editor0 を選択
2. `q`キーを押してパレットを開く
3. `Import`ボタンをクリック
4. `/dev/1_config.json`を読み込む
5. `Uplaod`ボタンをクリック
6. `Configuration differences`欄の`attribute types`に、新しい Attirbute 定義が追加さえていないこと
7. Editor1 を選択
8. `i`キーを押してアノテーション読込ダイアログを開く
9. ローカルファイルから`private.json`を読み込む
10. `q`キーを押してパレットを開く
11. `Uplaod`ボタンをクリック
12. `Configuration differences`欄の`attribute types`の 1 番目の`pred`の変更前の値が`denote`でないこと

## コンフィグレーション保存先 URL は、読み込んだコンフィグレーションの URL

### 背景

1. コンフィグレーション保存ダイアログの保存先 URL の初期値は、最後に読み込んだコンフィグレーションの URL です
2. 読み込んだアノテーションファイルにコンフィグレーションが含まれず、textae の HTML 属性でコンフィグレーションの URL が指定されているときは、指定 URL からコンフィグレーションを読み込みます。このときは読み込んだ URL を保存していませんでした。
3. コンフィグレーション読込ダイアログから、不正なコンフィグレーションを読み込んだときに、コンフィグレーションを適用しません。その URL を保存していました。
4. 6.1.3 で対応しました

### -- 手段 --

1.  Editor1 を選択
2.  アノテーション読込ダイアログを開く
3.  `/dev/2_annotations.json`を読み込む
4.  `Select Label [Q]`ボタンをクリックする
5.  コンフィグレーション保存ダイアログを開く
6.  URL 欄に`../../dev/1_config.json?aaa`が表示されていること
7.  コンフィグレーション読込ダイアログを開く
8.  URL 欄に`/dev/invalid_attributes_config.json`を入力して`open`ボタンをクリック
9.  コンフィグレーション保存ダイアログを開く
10. URL 欄に`../../dev/1_config.json?aaa`が表示されていること

## アノテーション保存先 URL は、読み込んだアノテーションの URL

### 背景

1. アノテーション保存ダイアログの保存ファイルの初期値は、最後に読み込んだアノテーションのファイル名です
2. 6.1.4 で対応しました
3. 不正なアノテーションを読み込んだときに、アノテーションを適用しません。
4. 不正なアノテーションを読み込んだときに、その URL を保存していました。
5. 6.4.151 で対応しました

### -- 手段 --

1.  Editor1 を選択
2.  アノテーション読込ダイアログを開く
3.  `/dev/invalid_color_annotation.json`を読み込む
4.  右上に`Invalid configuration: '<span style='color:red'>Invalid color format</span>' is invalid color format.`と赤色のトースト表示がされること
5.  アノテーション保存ダイアログを開く
6.  URL 欄に`http://pubannotation.org/projects/DisGeNET/docs/sourcedb/PubMed/sourceid/10021369/annotations.json`が表示されていること

## コンフィグレーション読み込み

### 背景

1.  5.0.0 でコンフィグレーションの読込機能を追加しました
2.  6.4.149 でアノテーションとコンフィグレーションを同時に読み込んだ際に、扱うアノテーションのデータ形式をオブジェクトに変更しました。このときガード条件の追加をしなかったため、コンフィグレーションを単独で読み込むときに null 参照エラーが起きていました
3.  6.4.150 で対応しました

### -- 手段 --

1.  Editor0 を選択
2.  `Select Label [Q]`ボタンをクリックする
3.  コンフィグレーション読込ダイアログを開く
4.  URL 欄に`/dev/1_config.json`を入力し、`Open`ボタンを押して、サーバーから読み込む
5.  パレットに`Cell`が表示されること

### URL が指定されていなければ Open ボタンを押せない

1.  Editor1 を選択
2.  `Select Label [Q]`ボタンをクリックする
3.  コンフィグレーション読込ダイアログを開く
4.  URL が空の時は`Open`ボタンは無効
5.  Local のファイルが選択されていない時は`Open`ボタンは無効

### JSON でないファイルをサーバーから読み込んだらエラーを alertify.js で表示

#### 背景

1.  5.3.0 でエラーが起きていました
2.  5.3.4 で対応

#### -- 手段 --

1.  Editor1 を選択
2.  `Select Label [Q]`ボタンをクリックする
3.  コンフィグレーション読込ダイアログを開く
4.  URL 欄に`development.html`を入力し、`Open`ボタンを押して、サーバーから読み込む
5.  右上に`http://localhost:8000/dist/demo/development.html is not a configuration file or its format is invalid.`と赤色のトースト表示がされること

### ドラッグアンドドロップでファイルを選択できる

#### 背景

1.  6.7.4で機能を追加

#### -- 手段 --

1.  Editor0 を選択
2.  `Select Label [Q]`ボタンをクリックする
3.  コンフィグレーション読込ダイアログを開く
4.  `1_config.json`をドロップゾーン、またはダイアログ外の背景にドラッグアンドドロップする
5.  `Open`ボタンを押して、ファイルを読み込む 
6.  パレットに`Cell`が表示されること

### JSON でないファイルをファイルから読み込んだらエラーを alertify.js で表示

#### 背景

1.  Editor1 を選択
2.  `Select Label [Q]`ボタンをクリックする
3.  コンフィグレーション読込ダイアログを開く
4.  エラーが起きていました
5.  5.0.0 で対応
6.  5.3.0 でアラートを表示せずに、config を初期化するようになりました
7.  5.3.4 で対応

#### -- 手段 --

1.  適当な json でも text でもないファイルを読み込む
2.  右上に`ファイル名(local file) is not a configuration file or its format is invalid.`と赤色のトースト表示がされること

### テキストエリアに直接JSONを記入し、コンフィグレーションを読み込むことができる

#### 背景
1.  6.8.0で機能を追加

#### -- 手段 --

1.  Editor0 を選択
2.  `Select Label [Q]`ボタンをクリックする
3.  コンフィグレーション読込ダイアログを開く
4.  `1_config.json`の内容をコピーし、`JSON`欄のテキストエリアにペーストする
5.  `Open`ボタンを押して、JSONを読み込む
6.  パレットに`Cell`が表示されること

### テキストエリアに記入したJSONを、エディタを使って編集できる

#### 背景
1.  6.8.0で機能を追加

#### -- 手段 --

1.  Editor0 を選択
2.  `Select Label [Q]`ボタンをクリックする
3.  コンフィグレーション読込ダイアログを開く
4.  `1_config.json`の内容をコピーし、`JSON`欄のテキストエリアにペーストする
5.  `Edit`ボタンを押して、JSONエディタを展開する
6.  エディタ上で`"id": "Cell"`を`"id": "cell"`に書き換える
7.  `Open`ボタンを押してJSONを読み込む
8.  パレットに`cell`が表示されること

### JSONでない文字列を読み込んだらエラーを alertify.js で表示

#### 背景
1.  6.8.0で機能を追加

#### -- 手段 --
1.  Editor0 を選択
2.  `Select Label [Q]`ボタンをクリックする
3.  コンフィグレーション読込ダイアログを開く
4.  適当にJSONではない文字列をテキストエリアに記入し、`Open`ボタンを押して読み込む
5.  右上に`instant is not a configuration file or its format is invalid.`と赤色のトースト表示がされること

## アノテーションファイルを読み込んだとき、ステータスバーの情報とエディター内部で保持する変更前のアノテーション情報を更新する

### 背景

1. 読み込んだアノテーションは、保存する際にエディターで変更しないプロパティを保持するために、変更前のアノテーション情報として保存しています
2. 読み込んだアノテーションファイルとコンフィグレーションファイルの内容を併せて整合性チェックを行います
3. チェックに引っかかった場合に、ステータスバーの情報を更新していました
4. チェックに引っかかった場合に、変更前のアノテーション情報を更新していました
5. チェックに引っかかった場合に、パレットを更新していました
6. 6.4.29 で上記 3,4 の情報を更新しない対応をしました
7. エディターの config 属性で、コンフィグレーションファイルの URL を指定していると、コンフィグレーションを含まないアノテーションを読み込んだときに、コンフィグレーションを URL から取得します
8. 6.4.29 で、コンフィグレーションファイルを URL から取得するアノテーションのときも、上記 3,4 の情報を更新しなくしていました
9. 6.4.149 で対応しました

### 不正なフォーマットの アノテーションファイルを読み込んだ  ときにステータスバーの情報を更新しない

1.  Editor0 を選択
2.  `invalid_color_annotation.json` を読み込む
3.  ステータスバーに表示される URL が`http://pubannotation.org/projects/DisGeNET/docs/sourcedb/PubMed/sourceid/10021369/annotations.json `から変わらないこと

### config 属性を指定したエディターで config が含まれないアノテーションを読みこむ

1. Editor1 を選択
2. `i`キーを押してアノテーション読込ダイアログを開く
3. ローカルファイルから`private.json`を読み込む
4. ステータスバーに`private.json(local file)`が表示されること
5. `u`キーを押してアノテーション保存ダイアログを開く
6. `Click to see the json source in a new window.`リンクをクリック
7. `text`の項目が`Specific T-cell `で始まること

## ローカルファイルからアノテーション読込

### ファイルが指定されていなければ Open ボタンを押せない

1.  アノテーション読込ダイアログを開く
2.  Local のファイルが選択されていない時は`Open`ボタンは無効

### ドラッグアンドドロップでファイルを選択できる

#### 背景

1.  6.7.3で機能を追加

#### -- 手段 --

1.  アノテーション読込ダイアログを開く
2.  `1_annotations.json`をドロップゾーン、またはダイアログ外の背景にドラッグアンドドロップする
3.  ダイアログのLocalの項目に、ドロップしたファイルの名前が表示される
4.  ドロップしたファイルからアノテーションが読み込めること

### ローカルファイルからはテキストファイルが読み込める

#### 背景

1.  5.0.0 で機能を追加

#### -- 手段 --

1.  `target.txt`をファイルから読み込む
2.  アノテーションが読み込めること

### JSON でもテキストでもないファイルをファイルから読み込んだらエラーを alertify.js で表示

#### 背景

1.  エラーが起きていました
2.  5.0.0 で対応
3.  5.3.4 でエラーが起きていました。
4.  6.0.6 で対応
5.  6.4.127 で間違ったメッセージを表示するようになりました
6.  6.4.148 で対応しました

#### -- 手段 --

1.  適当な json でも text でもないファイルを読み込む
2.  右上に`ファイル名(local file) is not a annotation file or its format is invalid.`と赤色のトースト表示がされること

## テキストエリアに記入したJSONからアノテーション読込

### テキストエリアに直接JSONを記入し、アノテーションを読み込むことができる

#### 背景
1.  6.8.0で機能を追加

#### -- 手段 --

1.  アノテーション読込ダイアログを開く
2.  `1_annotations.json`の内容をコピーし、`JSON`欄のテキストエリアにペーストする
3.  `Open`ボタンを押して、JSONを読み込む
4.  アノテーションが読み込めること

### テキストエリアに記入したJSONを、エディタを使って編集できる

#### 背景
1.  6.8.0で機能を追加

#### -- 手段 --

1.  アノテーション読込ダイアログを開く
2.  `1_annotations.json`の内容をコピーし、`JSON`欄のテキストエリアにペーストする
3.  `Edit`ボタンを押して、JSONエディタを展開する
4.  JSONエディタ上で`"text"`の内容を適当に書き換える
5.  `Open`ボタンを押してJSONを読み込む
6.  書き換えた内容が反映されたアノテーションが読み込めること

### JSONでない文字列を読み込んだらエラーを alertify.js で表示

#### 背景
1.  6.8.0で機能を追加

#### -- 手段 --

1.  アノテーション読込ダイアログを開く
2.  適当にJSONではない文字列をテキストエリアに記入し、`Open`ボタンを押して読み込む
3.  右上に`instant is not a annotation file or its format is invalid.`と赤色のトースト表示がされること

## Term モードで Ctrl/Cmd を押して複数選択

1.  Term モードにする
2.  Span と Span を同時に複数選択する
3.  Entity と Entity を同時に複数選択する
4.  Span と Entity を同時に複数選択する

## 新しく作った Relation をラベルを使って複数選択

1.  新規に Relation を作る
2.  他の Relation を選択
3.  Ctrl を押しながら新しく作った Relation のラベルをクリック
4.  両方の Relation が選択されること

## Entity と Relation を同時に選択した時の Label 編集は Relation の Label を表示

### 背景

1.  SelectionModel は id だけを保持しています
2.  id は外部（anntation.js）から指定されることがあります
3.  id だけでは何を選択しているかわかりません
4.  SelectionModel は Entity と Relation に分かれています
5.  編集モードに応じて参照する SelectionModel を切り替えます
6.  6.2.25 から SelectionModel でアノテーションモデルインスタスへの参照を保持するようになりました

### -- 手段 --

1.  Relation モードにする
2.  Entity を選択する
3.  Ctrl を押しながら Relation を選択する
4.  Label を編集する
5.  `Value`欄に Relation の pred の文字列が表示されること

## 行の高さを変更して annotation を読み直すと行が再計算されること

### 背景

1.  ファイルを読み直したときに行の高さを再計算していませんでした
2.  4.4.3 で再計算することにしました

### -- 手段 --

1.  Setting ダイアログで行の高さを変更する
2.  行の高さが変わること
3.  Grid の位置が変わること
4.  アノテーション読込ダイアログを表示
5.  URL から別のアノテーションを読み込む
6.  行の高さが再計算されること

## Editor の自動選択

### 背景

1.  1 画面に複数のエディタを組み込めるように、エディタの選択は外部スクリプトで行っています
2.  5.2.4 までは setTimeout を使って、選択時間を遅らせて自動選択していました
3.  textae の focus イベントリスナーは load イベントでバインドしています
4.  html の読み込みに時間がかかった場合、textae 側が listen する前に、外部スクリプトが focus し自動選択に失敗していました
5.  5.2.5 で、外部スクリプトを load イベントで実行することで確実にエディタが自動選択されるようになりました

### -- 手段 --

1.  Editor0 が自動選択されること

## URL からアノテーション読込

### URL が指定されていなければ Open ボタンを押せない

1.  アノテーション読込ダイアログを開く
2.  URL 欄が空の時は`Open`ボタンは無効
3.  Local のファイルが選択されていない時は`Open`ボタンは無効

### 存在しないアノテーションを読み込む

#### 背景

1.  読み込み失敗時のメッセージが素っ気なかった
2.  4.1.12 から優しくなりました

#### -- 手段 --

1.  存在しないファイルを読み込む
2.  赤いトーストが表示されること
3.  `Could not load the file from the location you specified.:`が表示されること

## URL から不正なアノテーションを読み込む

#### 背景

1.  読み込み失敗時のメッセージが素っ気なかった
2.  4.1.12 から優しくなりました
3.  6.4.127 で不正なアノテーションを読み込んだ際に、不正なコンフィグレーションを読み込んだときのメッセージも表示されるようになりました
4.  6.4.142 で対応しました

### annotation.json 以外のファイルを読み込んだらエラーメッセージを表示する

#### 背景

1.  コンソールにエラーを表示して、ぐるぐるが出たままでした。
2.  継続して使うことができませんでした。
3.  4.4.3 で導入
4.  5.0.0 でエラーメッセージを`This is not a json file of annotations.`から詳細化しました。
5.  5.3.4 でエラーが起きていました。
6.  6.0.6 で対応

#### -- 手段 --

1.  アノテーション読込ダイアログを表示
2.  URL 欄に`development.html`を入力
3.  `Open`ボタンをクリック
4.  赤いトーストが表示されること
5.  `http://localhost:8000/dist/demo/development.html is not a annotation file or its format is invalid.`が表示されること

### URL からはテキストファイルは読み込めない

#### 背景

1.  5.0.0 でローカルファイルからのテストファイル読み込み機能を追加しました。

#### -- 手段 --

1.  アノテーション読込ダイアログを表示
2.  URL 欄に`http://localhost:8000/dev/target.txt`を入力し、`Open`ボタンを押して、サーバーから読み込む
3.  右上に`http://localhost:8000/dev/target.txt is not a annotation file or its format is invalid.`と赤色のトースト表示がされること

## 編集してからアノテーションを読み直す

### 背景

1. アノテーションを読み直すときにコマンドヒストリーを消します
2. 6.4.130 で History にの保持するコマンドを最小単位を、ただ一つの CompositeCommand を持つようにしました
3. このときコマンドヒストリーを消す際に使っている isExactly 関数を消しました
4. 編集してコマンドヒストリーがある状態で、アノテーションを読み込むと、isExactly 関数がないためエラーがおきます
5. 6.4.140 で対応しました

### -- 手段 --

1. Eidotr0 を選択
2. Entity を作成する
3. `i`キーを押してアノテーション読込ダイアログを開く
4. `URL`の`Open`ボタンを押す
5. エラーが起きないこと
6. 作成した Entity が消えること

## Selection Attribute 定義の Value の label、color 変更

### 背景

1.  5.2.0 から Entity パレットで Selection Attribute の Value が編集出来るようになりました。

### -- 手段 --

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

## Selection Attribute 定義の Value が唯一のときは、削除不可

### 背景

1.  Selection Attribute の Value をすべて消そうとするとエラーが起きます
2.  6.1.57 で対応しました。

### -- 手段 --

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

## Selection Attribute 定義の Value の id 変更

### 背景

1.  5.2.0 から Entity パレットで Selection Attribute の Value が編集出来るようになりました。
2.  Selection Attribute 定義の value の id を変更したときに、annotation 上の Attribute の obj の値を更新していなかったため、Attribute 定義と annotation 上の Attribute の情報が乖離するバグがありました。
3.  6.0.6 で対応しました。
4.  6.2.66 で ChangeAttributeCommand のプロパティ名を変更時の修正もれでエラーがおきました。
5.  6.2.72 で対応しました

### -- 手段 --

1.  Editor1 を選択
2.  パレットを開く
3.  `denote`タブを選択
4.  `Cell`の Edit Value ボタンをクリック
5.  `id`を変更して`OK`をクリック
6.  エンティティ`E1:a:b`の Attribute の値が変更されること
7.  すべてもどす
8.  すべてやり直す

## Selection Attribute 定義の default でない Value を default に変更して UNDO する

### 背景

1.  5.2.0 から Entity パレットで Selection Attribute の Value が編集出来るようになりました。
2.  default の Value から default プロパティを削除したとき、先頭の Value を default にします
3.  default でない Value をデフォルトにするとき、既存の default Value から default プロパティを削除します
4.  default でない Value をデフォルトにして UNDO したときは、default 出なくした既存の default Value を default に戻したいです
5.  この処理が抜けていたため、既存の defalt Value でなく、先頭の Value が default になっていました
6.  6.4.138 で対応しました

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

## 兄弟 Span を端を共有する親 Span にする

### 背景

1. 6.1.54 で、SpanEditor をリファクタリングしているときに、分岐が一つ失われ、動かなくなりました
1. 6.4.135 で対応しました
1. 6.4.136 で伸ばす Span を選択しなくても親 Span にできるようにしました

### -- 手段 --

#### Span 上で mouse up

1.  Term モードにする
2.  Span を作る
3.  兄弟になる Span を作る
4.  片方の Span を選択する
5.  選択した Span をもう片方の Span の反対側の端と同じ範囲まで広げる（span 上で mouse up すること）
6.  親子 Span になること

#### 行間上で mouse up

1.  Term モードにする
2.  Span を作る
3.  兄弟になる Span を作る
4.  片方の Span を選択する
5.  選択した Span をもう片方の Span の反対側の端と同じ範囲まで広げる（テキストとテキストの行間の空白領域で mouse up すること）
6.  親子 Span になること

## 兄弟 Span を親 Span にする

### 背景

1.  5.2.1, 5.2.2 で並んだ兄弟 Span の片方を伸ばすして、端を共有する親子 Span にする操作を便利にしました
2.  以前は、一度両側がはみ出た大きな親 Span にしてから、はみ出た部分を縮める操作が必要でした
3.  5.2.1 で、親にしたい Span を選択して、伸ばして子にしたい Span の上で mouse up して、端を共有する親 Span にできるようになりました
4.  5.2.2 で、親にしたい Span を選択して、伸ばして子にしたい Span の上にブラウザのセレクションが有る状態で、テキスト間の空白領域で mouse up して、端を共有する親 Span にできるようになりました

### -- 手段 --

1.  Term モードにする
2.  Span を作る
3.  兄弟になる Span を作る
4.  片方の Span をもう片方の Span を覆う範囲に広げる
5.  親子 Span になること

## パレットの Attribute タブの定義削除ボタン

1. `delete attribute`というラベルを表示したボタンでした
2. 6.4.37 で、ゴミ箱アイコンを表示するように変更しました
3. 6.4.38 から、Attribute 定義を使用しているインスタンスがあるときに削除ボタンを非表示にせずに、無効にします。
4. 6.4.46 で、ボタンの title 文言を変更しました

### -- 手段 --

1. Editor1 を選択
2. Term モードにする
3. `q` キーを押してパレットを開く
4. `denote` タブを選ぶ
5. `Delete this predicate.`ボタンの見た目がゴミ箱アイコンであること
6. `Delete this predicate.`ボタンの見た目が無効であること
7. `Delete this predicate.`ボタンの`title`が`It cannot be deleted, as this attribute is used for 4 items.`
8. `Delete this predicate.`ボタンをクリックする
9. Attribute 定義が削除されないこと
10. `warning` タブを選ぶ
11. `Delete this predicate.`ボタンが有効であること

## パレットで SelectionAttribute タブを表示したあと、保存する configuration に indelible プロパティが追加されないこと

### 背景

1. パレットの Predicate 削除ボタンを有効にするかどうかの情報を Attribute 定義情報の indelible プロパティに書き込んでいました
2. 6.4.127 で、パレットを表示するときに使用する Attribute 定義情報をコピーでなくしました
3. 保存する cofiguration にも indelible プロパティが反映されるようになりました
4. 6.4.134 で、Attribute 定義情報の indelible プロパティを使うのをやめました

### -- 手段 --

1. Editor1 を選択
2. Term モードにする
3. `q`キーを押してパレットを開く
4. `denoto`タブを開く
5. `Uplaod`ボタンをクリック
6. `Configuration differences`欄に`indelible:true`が表示されないこと

## 選択中に削除すると右の要素を選択する

### 背景

1.  6.1.1 で一つの denotation を一つのエンティティに表示することしました。

### Span

1.  Span を選択する
2.  Span を削除する
3.  右の Span が選択されること

### Entity

1.  Entity を選択する
2.  Entity を削除する
3.  右の Entity が選択されること

### Span を縮めて消した時に、次の Span を選択

#### 背景

1.  4.4.1 で対応
2.  ボタンか`d`キーで Span を削除した時は、右の Span を選択していたが、Span を縮めて削除した時は選択していなかった

#### Boundary Detection 有効時

##### Span の耳をひっぱて縮める

1.  Term モードにする
2.  `Boundary Detection`ボタンを押下状態にする
3.  Span を選択せずに右から縮めて Span を消す
4.  右の Span が選択されること
5.  Span を選択せずに左から縮めて Span を消す
6.  右の Span が選択されること
7.  Span を選択して右から縮めて Span を消す
8.  右の Span が選択されること
9.  Span を選択して左から縮めて Span を消す
10. 右の Span が選択されること

#### Boundary Detection 無効時

##### Span の耳をひっぱて縮める

1.  Term モードにする
2.  `Boundary Detection`ボタンを押上状態にする
3.  Span を選択せずに右から縮めて Span を消す
4.  右の Span が選択されること
5.  Span を選択せずに左から縮めて Span を消す
6.  右の Span が選択されること
7.  Span を選択して右から縮めて Span を消す
8.  右の Span が選択されること
9.  Span を選択して左から縮めて Span を消す
10. 右の Span が選択されること

### Relation は選択解除

1.  Relation を選択する
2.  Relation を削除する
3.  選択解除されること

## SelectionAttribute 定義にデフォルトの value を追加して、UNDO したときにデフォルト値が二つに増えない

### 背景

1.  5.2.0 から Entity パレットで Selection Attribute の Value が編集出来るようになりました
2.  デフォルトの Value を削除するときに、先頭の Value をデフォルトにします
3.  追加したデフォルトの Value を UNDO するとき、追加前にデフォルトだった Value をデフォルトにします
4.  デフォルトの value を追加して UNDO すると、デフォルトの Value を削除するときの処理と、追加したデフォルトの Value を UNDO するときの処理が両方動いて、デフォルト値が二つになります
5.  6.4.131 で対応しました

### -- 手段 --

1.  Editor1 を選択
2.  Term モードにする
3.  `q`キーを押してパレットを開く
4.  `denote`タブを選択
5.  `Add new value`ボタンをクリックする
6.  `id`を入力
7.  `default`にチェックを入れる
8.  `OK`ボタンを押す
9.  パレットに 4 つ目の value が追加されること
10. 追加された value だけに、ラジオボタンがついていること
11. UNDO する
12. `equivalentTo`だけに、ラジオボタンがついていること

## Lock Edit Config 有効時のパレットの表示項目

### 背景

1.  6.4.52 で `Lock Edit Config`有効時に、Attribute タブの、定義削除ボタン、定義編集ボタンを無効にしました。

### -- 手段 --

1.  Editor1 を選択
2.  Term モードにする
3.  設定ダイアログをひらく`Lock Edit Config`にチェックを入れる
4.  パレットを開く
5.  全選択ボタンが表示されないこと
6.  編集ボタンが表示されないこと
7.  削除ボタンが表示されないこと
8.  Attirbute 追加タブが表示されないこと
9.  `denote` タブを選ぶ
10. `Delete this predicate.`ボタンが無効であること
11. `Edit this predicate.`ボタンが無効であること

## Body クリックでパレットが閉じる

### 背景

1.  6.1.30 で Body クリックで text-box クリックイベントを分けたときに、text-box クリックイベントをわけました。
2.  Body クリックイベントは、コントロールバーの右の領域で発火し、その他の行間では text-box クリックイベントが発火します。
3.  text-box クリックイベントにパレットを閉じる処理を移動しなかったため、パレットが閉じなくなりまし t。
4.  6.1.60 で Body クリックイベントと text-box クリックイベントの両方でパレットを閉じるようにしました。

### -- 手段 --

### Term モード

1.  Term モードにする
2.  `Select Label [Q]`ボタンをクリックする
3.  パレットが開くこと
4.  行間をクリックする
5.  パレットが閉じること

### Relation モード

1.  Relation モードにする
2.  `Select Label [Q]`ボタンをクリックする
3.  パレットが開くこと
4.  行間をクリックする
5.  パレットが閉じること

## Block モードで、Body クリックでパレットが閉じる

### 背景

1.  6.2.75 で Block モードに対応しました
2.  BlockSpan のクリックイベントにパレットを閉じる処理がぬけていました
3.  6.4.61 で対応

### -- 手段 --

1.  Block モードにする
2.  `Select Label [Q]`ボタンをクリックする
3.  パレットが開くこと
4.  行間をクリックする
5.  パレットが閉じること
6.  BlockSpan のすぐ上をクリックする
7.  パレットが閉じること

## BlockSpan のヒットエリア

### 背景

1. Block モードでは、BlockSpan のヒットエリアに背景色が着いていました
2. 6.4.63 で、Block モード以外のモードでも、背景色を薄くつける対応をしました

### -- 手段 --

1.  Editor1 を選択
2.  Term モードにする
3.  BlockSpan のヒットエリアに背景色があること
4.  Block モードにする
5.  BlockSpan のヒットエリアに背景色が濃くなること

## BlockSpan のヒットエリアのタイトルに BlockSpan の ID を表示

### 背景

1. 6.4.62 で対応

### -- 手段 --

1.  Editor1 を選択
2.  BlockSpan のヒットエリアのタイトルに Span の ID が入っていること

## Entity をホバーしたときの見た目

### 背景

1.  6.2.75 で Block モードに対応しました
2.  DenotationEntity はどのモードでもホバーするとシャドウがついていました
3.  BlockEntity のヒットエリアはホバー時にシャドウはついていませんでした
4.  6.4.64 で、この動作を統一し、選択できるモードのとき Entity をホバーするとシャドウをつける対応をしました。
5.  6.4.65 で、シャドウのほかに、カーソルを指にしました。
6.  6.4.66 で、Relation モードのときに、常にカーソルが指になっていたのを、DenotationEntity と Relation だけに変更しました。

### Term モード

1. Editor1 を選択
2. Term モードにする
3. DenotationEntity をホバーする
4. マウスカーソルが指になること
5. シャドウがつくこと
6. BlockEntity をホバーする
7. シャドウがつかないこと

### Block モード

1. Editor1 を選択
2. Block モードにする
3. DenotationEntity をホバーする
4. シャドウがつかないこと
5. BlockEntity をホバーする
6. マウスカーソルが指になること
7. シャドウがつくこと

### Relation モード

1. Editor1 を選択
2. Relation モードにする
3. DenotationEntity をホバーする
4. マウスカーソルが指になること
5. シャドウがつくこと
6. BlockEntity をホバーする
7. マウスカーソルが指になること
8. シャドウがつくこと

### View モード

1. Editor1 を選択
2. View モードにする
3. DenotationEntity をホバーする
4. シャドウがつかないこと
5. BlockEntity をホバーする
6. シャドウがつかないこと

## パレットは画面からはみ出ない

### 背景

1. 6.4.78 でパレットをエディターの右端からはみ出ないようにしました
2. 横スクロールバーが表示されているときに、パレットが下からはみ出ます
3. windew.innerHeight を使うとスクロールバーを考慮しない高さがとれます
4. document.documentElement.clientHeight を使えばスクロールバーを考慮した高さがとれます
5. 6.4.122 で対応しました

### -- 手段 --

1.  Term モードにする
2.  ブラウザの横スクロールバーが表示されるまで、ブラウザの幅を縮める
3.  エディターのブラウザの下端ギリギリ、右端ギリギリをクリックする
4.  `Q`キーを押す
5.  パレットがブラウザからはみ出ないこと

## パレットのタイトルバー

### 背景

1. パレットは Esc キーまたは、パレット外の要素をクリックすることで閉じることができます
2. 初めて使うユーザーには、パレットの閉じ方がわかりにくいです
3. jQueury UI ダイアログと同等のタイトルバーを表示して、そこに閉じるボタンを配置します
4. 6.4.108 で、対応しました

### -- 手段 --

1. Term モードにする
2. `q` キーを押してパレットを開く
3. タイトルバーがあること
4. タイトルが`Entity configuration`であること
5. 閉じるボタンをクリックして、パレットを閉じられること
6. Block モードにする
7. `q` キーを押してパレットを開く
8. タイトルバーがあること
9. タイトルが`Entity configuration`であること
10. 閉じるボタンをクリックして、パレットを閉じられること
11. Relation モードにする
12. `q` キーを押してパレットを開く
13. タイトルバーがあること
14. タイトルが`Relation configuration`であること
15. 閉じるボタンをクリックして、パレットを閉じられること

## パレットは画面サイズに合わせて縮小する

### 背景

1. 6.4.76 でパレットの幅の基準をブラウザのウインドウ幅からエディターの幅に変えました
2. パレットの高さを一度ブラウザの高さに合わせて縮小すると、ブラウザを大きくしてもクリアされず、パレットは小さいままでした
3. 6.4.119 で対応しました
4. 6.4.108 でパレットのタイトルバーを追加した際に、パレットの中身が多いときにスクロールする領域を、パレット全体からパレット一部に変更した
5. ブラウザの高さが短いときに、パレットの高さは縮まるが、パレットの中身は縮小していなかったため、パレットの中身がパレットからはみ出た
6. 6.4.123 で対応しました

### 上下

1.  Editor1 を選択
2.  Term モードにする
3.  ブラウザの上下のサイズ 350px 以下にする
4.  `Q`キーを押す
5.  パレットが画面からはみ出ないこと
6.  パレットの中身がパレットからはみ出ないこと
7.  パレットの上下に 1px ずつ隙間ができること
8.  ブラウザの上下のサイズ 350px 以上にする
9.  パレットの高さが広がること

### 左右

1.  Editor1 を選択
2.  Term モードにする
3.  ブラウザののサイズをパレットより小さくする
4.  `Q`キーを押す
5.  パレットがエディターからはみ出ないこと
6.  パレットの左右に 1px ずつ隙間ができること

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

## 該当 Attribute のない Entity を選択しているときに、ショートカットキーから Attribute インスタンスを削除しようとしたら警告を表示する

### 背景

1. 6.4.58 で無効理由を title タグで記述します
2. ショートカットキーから削除できないときも、同様の情報をアラート表示します。
3. 6.4.124 で対応しました

### -- 手段 --

1. Editor1 を選択
2. Term モードにする
3. Attribute のない Entity を一つ選択する
4. `shift`キーを押しながら、`1`キーを押す
5. `None of the selected items has this attribute.`がアラート表示されること

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

## Attribute のある Entity と Attribute のない Entity を同時に選択しているとき、その Attribute を編集するショートカットキーを押したら警告を表示する

### 背景

1. 6.4.59 で、Attribute 編集ボタンを有効にする条件を、選択アイテムが「一つでも該当 Attribute を持つ」から「すべてが該当 Attribute をひとつだけ持つ」に変えました
2. 6.4.121 でショートカットキーから Attribute 編集するときの条件を同等にしました

### -- 手段 --

1.  Editor1 を選択
2.  Term モードにする
3.  `T1:a:b`と`E1:a:b`を選択する
4.  `5`キーを押す
5.  `Some selected items has zero or multi this attribute.`がアラート表示されること
6.  `E18`を追加選択する
7.  `5`キーを押す
8.  `Some selected items has zero or multi this attribute.`がアラート表示されること
9.  Attribute のない Entity を一つ選択する
10. `5`キーを押す
11. `Down the Rabbit Hole` Attribute が追加されること

## 該当 Attribute を持たないアイテムを選択しているときに、パレットの Attribute 追加ボタンを有効にする

### 背景

1.  **1 つの Entity に Predicate が等しい Attribute をひとつまでしか持てない** 制約がありました
2.  この制約を **1 つの Entity に Predicate と Object が等しい Attribute をひとつまでしか持てない** に緩めることにしました
3.  パレットからは、1 つの Entity 上の Predicate が重複した Attribute の作成をサポートしません
4.  6.4.56 で Attribute 追加ボタンを有効にする条件を、選択アイテムが「一つでも該当 Attribute を持つ」から「一つでも該当 Attribute を持たない」に変えました
5.  6.4.57 で無効理由を title タグで記述します

### -- 手段 --

1. Editor1 を選択
2. Term モードにする
3. Attribute のない Entity を一つ選択する
4. `q` キーを押してパレットを開く
5. `denote` タブを選ぶ
6. `add to`ボタンを押す
7. `add to`ボタンが無効になること
8. title が`All the selected items already have this attribute.`であること
9. `remove from`ボタンを押す
10. Attribute が削除されること
11. `add to`ボタンを押す
12. `add to`ボタンが無効になること
13. Attribute のない Entity をもう一つ追加で選択する
14. `add to`ボタンが有効になること

## パレットの Attribute タブの Attribute 情報フォーマット

### 背景

1.  5.0.0 で Attitude を追加しました
2.  6.3.32 で、Entity が Boolean または Selection Attribute を持つときに、Entity パレットに Attribute 削除ボタンを表示する代わりに、Attribute 追加ボタンを表示していました
3.  6.4.3 で対応
4.  6.4.48 で、文言を変更しました
5.  6.4.49 で、文言に選択中のアイテムの数を追加し、ボタンの文言を短くしました
6.  6.4.50 で、アイテムを選択していないときは、ボタンを表示しなくしました
7.  6.4.51 で、value type の説明をアイコンに変更しました
8.  6.4.55 で、Attribute 追加変更削除ボタンの表示・非表示切り替えを、有効・無効切り替えに変更しました
9.  6.4.88 で、6.4.53 で選択アイテム数が表示されなくなっていたのを、直しました
10. 6.4.107 で、value type の説明をアイコンのみにしました。また、フラグ Attribute のアイコンをチェックボックスからフラッグに変えました

### -- 手段 --

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

## Selection Attribute をショートカットキーからパレットを開いて編集

### 背景

1.  5.0.0 で、Attribute を追加するためにのショートカットキー T を追加しました
2.  5.0.2 で、1~5 のキーで選択中の Entity へ、Attribute を追加、shift と同時押しで削除するようにしました
3.  5.0.5 で、Attribute のショートカットキーを 1~9 までに増やしました
4.  5.2.0 で、Attribute のショートカットキー T を廃止しました
5.  6.2.71 で Block モードでパレットが開けるようになりました
6.  6.2.79 で で Block モードで、ショートカットキー 1~9 で Attribute の追加ができるようになりました
7.  **1 つの Entity に Predicate が等しい Attribute をひとつまでしか持てない** 制約がありました
8.  この制約を **1 つの Entity に Predicate と Object が等しい Attribute をひとつまでしか持てない** に緩めることにしました
9.  ショートカットキー操作では、1 つの Entity 上の Predicate が重複した Attribute の作成をサポートしません

### DenotationEntity

1.  Editor1 を選択
2.  Term モードにする
3.  Attribute を持たない DenotationEntity を選択する
4.  `1` キーを押す、Attribute を追加されること
5.  `1` キーをもう一度押すと、Value 選択用のパレットが表示されること
6.  パレットの Value を押すと、選択中の DenotationEntity の該当 predicate の Attribute の Value が変更できること

### BlockEntity

1.  Editor1 を選択
2.  Block モードにする
3.  Attribute を持たない BlockEntity を選択する
4.  `1` キーを押す、Attribute を追加されること
5.  `1` キーをもう一度押すと、Value 選択用のパレットが表示されること
6.  パレットの Value を押すと、選択中の BlockEntity の該当 predicate の Attribute の Value が変更できること

## Attribute 定義がないときにパレットが開ける

### 背景

1.  5.0.0 で Attitude を追加しました
2.  6.4.91 で、6.4.88 で Attribute 定義がないときにパレットを開くとエラーが起きていたのを直しました

### -- 手段 --

1. Editor0 を選択
2. Term モードにする
3. `q` キーを押してパレットを開く
4. エラーが起きないこと

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

## 編集モードを変更したらクリップボードを空にする

### 背景

1.  6.2.0 からブロック機能を追加
2.  Term モードでコピーまたはカットした DenotationEntity を BlockSpan に貼り付けられるようになりました。
3.  6.4.68 で、編集モードを変更したときに、クリップボードを空にする対応をしました。

### -- 手段 --

1. Term モードにする
2. Entity を選択する
3. `x`キーを押してカットする
4. Block モードにする
5. カットされた Entity が半透明でなくなること

## Entity 選択時の Entity の見た目の変化

### 背景

1.  6.2.28 で Entity のエンドポイントの表示をやめました。
2.  6.4.63 で、Block モード以外のモードでも、背景色を薄くつける対応をしました
3.  このとき BlockEntity を選択肢ときにボーダーが赤色にならなくなりました
4.  6.4.72 で、対応しました

### BlockEntity

1.  Editor1 を選択
2.  Block モードにする
3.  Entity を選択する
4.  Entity のラベルのボーダーが赤色になること

### DenotationEntity

1.  Term モードにする
2.  Entity を選択する
3.  Entity のラベルのボーダーが赤色になること

## モードに応じてパレットに表示する Type を変更

### Term モード

1.  Term モードにする
2.  パレットを開く
3.  DenotationEntity の Type が表示されること

### Term-Simple モード

1.  Term-Simple モードにする
2.  パレットを開く
3.  DenotationEntity の Type が表示されること

### Block モード

1.  Block モードにする
2.  パレットを開く
3.  BlockEntity の Type が表示されること

### Block-Simple モード

1.  Block-Simple モードにする
2.  パレットを開く
3.  BlockEntity の Type が表示されること

### Relation モード

1.  Relation モードにする
2.  パレットを開く
3.  Relation の Type が表示されること

### View モード

1.  View モードにする
2.  パレットが開けないこと

## パレットの表示項目

### 背景

1.  5.1.0 から Entity のパレットに Attribute タブを表示します
2.  5.3.6 から Attribute タブにショートカットキーの番号を表示します
3.  6.2.71 で Block モードでパレットが開けるようになりました
4.  6.3.35 で Relation インスタンスがあるときに全選択ボタンを無効にしていました
5.  6.4.73 で対応しました
6.  6.3.32 で Entity の Type が URL を持たないときにリンクを表示していました
7.  6.4.74 で対応しました

### Term モード

1.  Editor1 を選択
2.  Term モードにする
3.  パレットを開く
4.  全行に Type の id が表示されること
5.  id が`http://wwww.yahoo.co.jp`の Type の label に`Regulation`が表示されること
6.  id が URL の Type の右端にアイコンが表示される
7.  Type の使用インスタンス数が表示されること
8.  全選択ボタンが表示されること
9.  編集ボタンが表示されること
10. 削除ボタンが表示されること
11. Entity インスタンス がある Type の全選択ボタンが有効であること
12. Entity インスタンス がある Type の全選択ボタンが有効であること
13. Entity インスタンス がない Type の削除ボタンが有効であること
14. Attribute タブが表示されること
15. 1〜9 番目までの Attribute タブにショートカットキーが表示されること

### Block モード

1.  Editor1 を選択
2.  Block モードにする
3.  パレットを開く
4.  全行に Type の id が表示されること
5.  id が URL の Type の右端にアイコンが表示される
6.  Type の使用インスタンス数が表示されること
7.  全選択ボタンが表示されること
8.  編集ボタンが表示されること
9.  削除ボタンが表示されること
10. Entity インスタンス がある Type の全選択ボタンが有効であること
11. Entity インスタンス がある Type の全選択ボタンが有効であること
12. Entity インスタンス がない Type の削除ボタンが有効であること
13. Attribute タブが表示されること
14. 1〜9 番目までの Attribute タブにショートカットキーが表示されること

### Relation モード

1.  Editor1 を選択
2.  Relation モードにする
3.  パレットを開く
4.  全行に Type の id が表示されること
5.  id が URL の Type の右端にアイコンが表示される
6.  Type の使用インスタンス数が表示されること
7.  全選択ボタンが表示されること
8.  編集ボタンが表示されること
9.  削除ボタンが表示されること
10. Relation インスタンス がある Type の全選択ボタンが有効であること
11. Relation インスタンス がある Type の全選択ボタンが有効であること
12. Relation インスタンス がない Type の削除ボタンが有効であること

## パレットのスクロールバー

### 背景

1.  パレットに、スクロールが必要ない場合も、横スクロールバーが表示されていました
2.  6.4.75 で横スクロールバーの常時表示をやめました

### -- 手段 --

1.  パレットを開く
2.  パレットの下部に横スクロールバーが表示されないこと

## パレットはドラッグできる

1.  Term モードにする
2.  Entity を選択する
3.  `Q`キーを押す
4.  パレットがドラッグアンドドロップで移動できること

## パレットはマウスカーソルの近くに開く

1.  Term モードにする
2.  `Select Label [Q]`ボタンをクリックする
3.  パレットがボタンの近くに開くこと
4.  `Q`キーを押す
5.  パレットがマウスカーソルの近くに開くこと

## TypeGap

### TypeGap のデフォルト値

1.  Setting ダイアログを開く
2.  Simple モードが 0（変更不可）
3.  Term モードが 2
4.  Block モードが 2
5.  Relation モードが 2

### TypeGap を変更したら LineHeight を自動計算する

1.  TypeGap を変更したら LineHeight を自動計算する
2.  Setting Dialog の LineHeight の値が更新されること
3.  Grid が正しい位置に表示されること

### 一回 Simple モードにしてから元のモードに戻したときに TypeGap の値が保存されている

#### 背景

1.  TypeGap の値を保存しなくなっていた。
2.  4.1.8 で修正

#### -- 手段 --

1.  Relation モードにする
2.  TypeGap を 3 にする
3.  Simple モードにする
4.  TypeGap が 0 になること
5.  Relation モードにする
6.  TypeGap が 3 になること

## Setting Dialog

### タイトル

#### 背景

1.  タイトルを変更しました。

#### -- 手段 --

1.  Setting Dialog を開く
2.  Setting Dialog のタイトルが`Setting`であること

### 設定項目

#### 背景

1.  4.1.16 で、instance/Simple モードの切り替えチェックボックスを消しました
2.  5.3.2 で、バージョン番号の表示を追加しました

#### -- 手段 --

1.  Setting Dialog を開く
2.  Type Gap があること
3.  Line Height があること
4.  Version があること

### Line Height を px で指定

#### 背景

1.  4.1.12 で Line Height の単位を px に変えました
2.  4.1.11 までは`指定値 * 16px`を行の高さに設定していました
3.  4.2.1 で、LineHeight を変更しても Grid が移動しなくなっていました

#### -- 手段 --

1.  Setting Dialog を開く
2.  Line Height を増やす
3.  行の高さが px 単位で変更できること
4.  最大 500px まで選べること
5.  設定した値に応じて行の高さが変わること
6.  行の高さに合わせて Grid が移動すること

## スタイルで行の高さを指定できること

### 背景

1.  4.1.14 で行の高さをスタイルで上書きできるようになりました
2.  6.0.0 で padding-top と height が設定されなくなりました
3.  6.1.45 で対応

### -- 手段 --

1.  Editor2 を選択する
2.  `.textae-editor__body__text-box`の line-height が`14px`であること
3.  `.textae-editor__body__text-box`の padding-top が`7px`であること
4.  `.textae-editor__body__text-box`の height が`48px`であること
5.  Setting ダイアログを開く
6.  Line Height の値が 14 であること

## アノテーションが無いときに行の高さが 41px になること

### 背景

1.  5.0.0 でアノテーションが無いときに行の高さがなくなっていました
2.  5.2.4 で対応しました

### -- 手段 --

1.  Editor7 を選択する
2.  `.textae-editor__body__text-box`の line-height が`41px`であること
3.  `.textae-editor__body__text-box`の padding-top が`20.5px`であること
4.  Setting ダイアログを開く
5.  Line Height の値が 41 であること

## Attribute 定義追加ダイアログで flag attribute の label と color を設定する

### 背景

1. Attribute 定義追加ダイアログを開いたときは Attribute type に`flag`が選択されています
2. flag attribute は label と color を持ちますが、label と color の入力欄が表示されません
3. 6.4.95 で Attribute type を一度別の値に変更して、`flag`に戻すと表示されるようになりました
4. 6.4.99 で Attribute 定義追加ダイアログを開いたときに、label と color の入力欄欄を表示します
5. label と color は入力欄を表示するだけで、作成した flag attribute の定義には反映していませんでした
6. 6.4.103 で対応しました

### -- 手段 --

1. Term モードにする
2. `q`キーを押してパレットを開く
3. Attribute 定義追加タブをクリック
4. Attribute 定義追加ダイアログが開くこと
5. Attribute 定義追加ダイアログに label 欄と color 欄があること
6. `pred`, `label`, `color`を入力して`OK`ボタンをおす
7. 作成した flag attribute の定義に`pred`, `label`, `color`が反映されていること

## 行の高さ自動調整

### 背景

1.  6.0.0 から行の高さ自動調整機能を追加しました。
2.  6.0.3 から、エンティティをすべて消したときに、行の高さ指定を初期値にもどします。

### -- 手段 --

1.  Editor2 を選択
2.  `Auto Adjust LineHeight`ボタンを押下する
3.  Entity を追加する
4.  高さが調整されること
5.  Entity を削除する
6.  line-height が 14px になること

## line-height 変更

### 背景

1.  4.1.8 で text−box の下の隙間を小さくした
2.  4.1.16 の開発中にモジュール読み込み構文の修正漏れでエラーを起こしていました。

### -- 手段 --

1.  Seting ダイアログを開く
2.  line-height を変更する
3.  高さが再計算されること
4.  下側の隙間が狭いこと

## 行の高さ調整ボタン

### 背景

1.  4.1.12 で行の高さ調整ボタンを追加しました
2.  4.1.16 の開発中にモジュール読み込み構文の修正漏れでエラーを起こしていました
3.  6.4.80 で、行の高さの計算に、BlockEntity の高さを含めることにしました

### -- 手段 --

1.  もっとも高い Grid を削除する
2.  `Adjust LineHeight`ボタンをクリックする
3.  高さが調整されること
4.  もっとも高い Grid より高い Grid を作る
5.  `Adjust LineHeight`ボタンをクリックする
6.  高さが調整されること
7.  Editor1 を選択
8.  Term モードにする
9.  すべての DenotationEntity を削除する
10. Block モードにする
11. BlockEntity に Attribute を追加する
12. 高さが調整されること

## DenotationEntity 編集ダイアログの編集キャンセル

### 閉じるボタン

1.  Term モードにする
2.  DenotationEntity を選択する
3.  `W`キーを押す
4.  編集ダイアログが開くこと
5.  文字を変更する
6.  `X`ボタンを押す
7.  DenotationEntity の id が変わらないこと

### Esc キー

1.  Term モードにする
2.  DenotationEntity を選択する
3.  `W`キーを押す
4.  編集ダイアログが開くこと
5.  文字を変更する
6.  `Esc`キーを押す
7.  DenotationEntity の id が変わらないこと

## BlockEntity 編集ダイアログの編集キャンセル

### 閉じるボタン

1.  Block モードにする
2.  BlockEntity を選択する
3.  `W`キーを押す
4.  編集ダイアログが開くこと
5.  文字を変更する
6.  `X`ボタンを押す
7.  BlockEntity の id が変わらないこと

### Esc キー

1.  Block モードにする
2.  BlockEntity を選択する
3.  `W`キーを押す
4.  編集ダイアログが開くこと
5.  文字を変更する
6.  `Esc`キーを押す
7.  BlockEntity の id が変わらないこと

## BlockEntity 編集ダイアログを開く

### Change Label[W]ボタン

1.  Block モードにする
2.  BlockEntity を選択する
3.  `Change Label[W]`ボタンを押す
4.  編集ダイアログが開くこと

### W キー

1.  Block モードにする
2.  BlockEntity を選択する
3.  `W`キーを押す
4.  編集ダイアログが開くこと

### コンテキストメニュー

1.  Block モードにする
2.  BlockEntity を選択する
3.  右クリックする
4.  コンテキストメニューが開くこと
5.  コンテキストメニューの
6.  `Change Label[W]`ボタンを押す
7.  編集ダイアログが開くこと

## DenotationEntity 編集ダイアログを開く

### Change Label[W]ボタン

1.  Term モードにする
2.  DenotationEntity を選択する
3.  `Change Label[W]`ボタンを押す
4.  編集ダイアログが開くこと

### W キー

1.  Term モードにする
2.  DenotationEntity を選択する
3.  `W`キーを押す
4.  編集ダイアログが開くこと

### コンテキストメニュー

1.  Term モードにする
2.  DenotationEntity を選択する
3.  右クリックする
4.  コンテキストメニューが開くこと
5.  コンテキストメニューの
6.  `Change Label[W]`ボタンを押す
7.  編集ダイアログが開くこと

## ラベル編集時にオートコンプリートを表示して、ダイアログをクリックすると、次からオートコンプリートがダイアログの下に表示される

#### 背景

1.  ラベル編集時にオートコンプリートの候補を表示して、ダイアログをクリックしたとき、ダイアログの z-index がインクリメントされ、オートコンプリートの候補の z-index より大きくなります。以降、オートコンプリートの候補を表示した際にダイアログの裏に表示されます。4.4.2 で対応
2.  5.0.0 の開発中に、ダイアログ内の input 要素をクリックしたときに再現することを発見。5.0.5 で対応しました

#### -- 手段 --

1.  Editor1 を選択
2.  Term モードにする
3.  Entity を選択する
4.  `Change Label[W]`ボタンを押す
5.  既存の id を消す
6.  `par`を入力
7.  候補に`parent@http://dbpedia.org/ontology/parent`が表示されること
8.  編集ダイアログの input 要素をクリックする
9.  `par`を入力しなおす
10. 候補に`parent@http://dbpedia.org/ontology/parent`が表示されること

## オートコンプリートの候補を表示したときに Entity 編集ダイアログに横スクロールバーが表示されないこと

### 背景

1.  5.0.6 で Entity ダイアログのオートコンプリートの候補の幅を、なるべく値が省略されないように、広くしました。
2.  Firefox では、Entity ダイアログに横スクロールバーが表示されていました。5.2.7 で候補の幅を 5px 短くして、対応しました。

### --- 手段 ---

1.  Editor1 を選択
2.  Term モードにする
3.  Attribute のない Entity を選択する
4.  `Change Label[W]`ボタンを押す
5.  既存の id を消す
6.  `par`を入力
7.  候補に`parent@http://dbpedia.org/ontology/parent`が表示されること
8.  ダイアログに横スクロールバー表示されないこと

## オートコンプリートの候補がダイアログの下に隠れないこと

### 背景

1.  4.3.0 でオートコンプリート導入。候補を config と source server(オートコンプリートの問い合わせ先サーバー。HTML 上の autocompletion_ws 属性で設定します)から検索します
2.  4.5.5 で jQuery UI を textae.js に同梱した時、オートコンプリートの候補が選択できなくなりました。jQuery UI の core 部分と jQuery UI のオートコンプリート機能のバージョン不一致で、オートコンプリートの候補を選択したときにエラーが起きた。4.5.6 で対応
3.  5.0.0 で type の編集機能を追加した際に、オートコンプリートで検索結果のラベルを`Value:`の右に、id を Value 欄に表示するように変更しました
4.  5.0.0 で Relation のラベルも Entity と同様の短縮表示しました
5.  5.0.5 でオートコンプリートの候補がダイアログの裏に隠れるバグを修正した際に、同時に、候補の末尾の文字が見切れない用に右寄せにしました
6.  5.0.5 で Attribute のない Entity を編集するときに、オートコンプリートの候補の 2 つ目以降が見切れていました。5.2.6 でダイアログの高さに最小値を設定しました
7.  6.2.0 からブロック機能を追加
8.  6.4.21 で Type 定義編集ダイアログに適用しました

### Type 定義編集ダイアログ

1.  Editor1 を選択
2.  Term モードにする
3.  `q`を押してパレットを表示する
4.  `Edit this type`ボタンをクリックする
5.  既存の id を消す
6.  `pro`を入力
7.  候補に`production@http://dbpedia.org/ontology/production`が右寄せで表示されること
8.  既存の label を消す
9.  `pro`を入力
10. 候補に`productionCompany@http://dbpedia.org/ontology/productionCompany`が右寄せで表示されること

### DenotationEntity 編集ダイアログ

1.  Editor1 を選択
2.  Term モードにする
3.  Attribute のない DenotationEntity を選択する
4.  `Change Label[W]`ボタンを押す
5.  既存の id を消す
6.  `pro`を入力
7.  候補に`production@http://dbpedia.org/ontology/production`が右寄せで表示されること
8.  候補に`productionCompany@http://dbpedia.org/ontology/productionCompany`が右寄せで表示されること
9.  2 つ目以降の候補が隠れないこと
10. `production@http://dbpedia.org/ontology/production`を選択する
11. Value の右に`production`が表示されること
12. Value の値が`http://dbpedia.org/ontology/production`になること
13. `OK`ボタンを押す
14. DenotationEntity のラベルが`production`になること

### BlocknEntity 編集ダイアログ

1.  Editor1 を選択
2.  Term モードにする
3.  BlocknEntity を選択する
4.  `Change Label[W]`ボタンを押す
5.  既存の id を消す
6.  `par`を入力
7.  候補に`parent@http://dbpedia.org/ontology/parent`が右寄せで表示されること
8.  `parent@http://dbpedia.org/ontology/parent`を選択する
9.  Value の右に`parent`が表示されること
10. Value の値が`http://dbpedia.org/ontology/parent`になること
11. `OK`ボタンを押す
12. BlocknEntity のラベルが`parent`になること

### Relation 編集ダイアログ

1.  Editor1 を選択
2.  Relation モードにする
3.  Relation を選択する
4.  `Change Label[W]`ボタンを押す
5.  既存の id を消す
6.  `par`を入力
7.  候補に`parent@http://dbpedia.org/ontology/parent`が右寄せで表示されること
8.  `parent@http://dbpedia.org/ontology/parent`を選択する
9.  Value の右に`parent`が表示されること
10. Value の値が`http://dbpedia.org/ontology/parent`になること
11. `OK`ボタンを押す
12. Relation のラベルが`parent`になること

## ラベルの定義に HTML タグが含まれているとき、HTML エスケープした文字列をオートコンプリートの候補として表示すること

### 背景

1. オートコンプリートの候補には Type 定義の`id`と`label`を表示しています。
2. HTML エスケープしていないため、`label`に HTML タグを含む Type を定義すると、オートコンプリートの候補に任意の HTML タグを挿入することが可能です。
3. 6.4.24 で対応しました。

### -- 手段 --

1. Editor1 を選択
2. Term モードにする
3. Entity を選択する
4. `w`キーを押して Entity 編集ダイアログを開く
5. `Value:`欄に`HTML`を入力する
6. 候補に赤字の`Red color HTML label`ではなく、`<span style='color: red;'>Red color HTML label</span>...`が表示されること

## Entity に HTML タグを含むラベルを設定したときにラベルの定義に HTML エスケープされた文字列が設定されないこと

### 背景

1. ラベルは編集ダイアログの HTML 要素に innerText を使って設定され、その値を取得するときに innerHTML を使っていたため、HTML タグを含むラベルを設定した際に、HTML エスケープされていました。
2. 6.4.18 で対応しまた。

### -- 手段 --

1. Editor1 を選択
2. Term モードにする
3. Entity を選択する
4. `w`キーを押して Entity 編集ダイアログを開く
5. `Value:`欄に`HTML`を入力する
6. 候補から`HTML tag label`を選択し、確定する
7. `q`キーを押してパレットを開く
8. `Save Configurations`ダイアログを開く
9. `entity types`に`HTML tag label`の変更がないこと

## パレットから Flag Attribute の label と color を編集する

### 背景

1. Flag Attribute の定義には label と color をもつことできます
2. Attribute インスタンスの表示には label と color を使っています
3. パレットの Attribute タグで、Flag Attribute を表示したときに、label と color を表示していませんでした
4. 6.4.95 で対応しました
5. 6.4.96 で、label と color の編集に対応しました

### -- 手段 --

1. Editor1 を選択
2. Term モードにする
3. Entity を選択する
4. `7`キーを押して、`Speculation`Attribute を追加する
5. `q`キーを押してパレットを開く
6. `Speculation`タブを開く
7. `label: "?" color: "#FF8000"`が表示されていること
8. `Edit this predicate.`ボタンをクリック
9. `label`と`color`の値を変更する
10. `OK`ボタンを押す
11. パレット上の`label`と`color`の値が、変更後の値に変わること
12. `Speculation`Attribute の表示名と色が変わっていること

## 重複 Attribute の定義を変更したときにエラーが起きない

### 背景

1. 重複 Attribute の Attribute 定義を変更すると、同一の Entity を二回レダリングします。
2. このときの一回目のレンダリングでは片方の Attribute の更新が終わっていないため、定義が存在しない Attribute の表示名を取得しようとします
3. 6.4.91 で、定義が存在しない Attribute の表示名を取得をガード条件から、アサーションに変えたため、エラーが起きるようになりました
4. 6.4.97 で、ガード条件に戻しました

### -- 手段 --

1. Editor1 を選択
2. Term モードにする
3. `q`を押してパレットを開く
4. `denote`タブを選択
5. `Edit this predicate.`ボタンを押す
6. Predicate を`denote`から変更して OK ボタンをおす
7. エラーが起きないこと

## ラベルの定義に HTML タグが含まれているとき、HTML エスケープした文字列を Entity 編集ダイアログに表示すること

### 背景

1. オートコンプリートの候補には Type 定義の`id`と`label`を表示しています。
2. HTML エスケープしていないため、`label`に HTML タグを含む Type を定義すると、編集ダイアログに任意の HTML タグを挿入することが可能です。
3. 6.4.31 で対応しました。
4. Entity 編集ダイアログに表示する Entity を Attribute も pred と value という同じ見出しも持っている
5. 6.4.82 で、要素毎に見出しを表示するのをやめて、テーブルで表示し、テーブルヘッダーに見出しをまとめました。

### -- 手段 --

1. Editor1 を選択
2. Term モードにする
3. DenotationEntity `E31` を選択する
4. `w`キーを押して Entity 編集ダイアログを開く
5. `Label:`カラムに、赤字の`Red color HTML label`ではなく、`<span style='color: red;'>Red color HTML label</span>`が表示されること

## 編集ダイアログから Attribute インスタンスを削除する

### 背景

1.  5.0.0 で Attribute を導入した際に、Attribute の削除ができませんでした。
2.  編集後の Attribute と同じ Attribute を編集前の Attribute から探してきて、すべて見つかったときには変更なしとしてモデルの更新をスキップしていました。
3.  Attribute を減らしたときに変更があることを検知できませんでした。
4.  5.0.2 で修正
5.  6.2.0 からブロック機能を追加

### 編集ダイアログから BlockEntity の Attribute インスタンスを削除する

1.  Term モードにする
2.  BlockEntity を選択する
3.  1 キーを押す
4.  Attribute が追加されること
5.  W キーを押す
6.  `Remove`ボタンを押す
7.  `OK`ボタンを押す
8.  選択中の BlockEntity の該当 predicate の Attribute が削除されること

### 編集ダイアログから DenotationEntity の Attribute インスタンスを削除する

1.  Term モードにする
2.  DenotationEntity を選択する
3.  1 キーを押す
4.  Attribute が追加されること
5.  W キーを押す
6.  `Remove`ボタンを押す
7.  `OK`ボタンを押す
8.  選択中の DenotationEntity の該当 predicate の Attribute が削除されること

## Attribute を定義順に並べる

### 背景

1.  Attribute の表示順には定義がありませんでした
2.  アノテーションを読み込む際に ID の文字列順にソートし、追加したものが最後になっていました
3.  6.4.84 で Attribute の定義順に並べることにしました
4.  6.4.85 で Attribute の定義の順番を変えたときに Entity 上の Attribute の順序も変更するようにしました

### -- 手段 --

1. Editor1 を選択
2. `E2`の`Cell`が一番上に表示されていること
3. Term モードにする
4. `E2`を選択
5. `w`キーを押して Entity 編集ダイアログを開く
6. `denote`が 2 行目に表示されていること
7. 閉じる
8. `q`キーを押してパレットを選択
9. `denote`タブを選択する
10. `denote`タブをドラッグアンドドロップして一番最後に移動する
11. `E2`の`Cell`が一番下に表示されていること
12. undo する
13. `E2`の`Cell`が一番上に表示されていること

## Attribute 定義の順序変更

### 背景

1.  5.3.6 で、パレットの Attribute タブをドラッグアンドドロップして、Attribute 定義の順序を変更する機能を追加しました。
2.  Attribute 定義の最大数を超えているときに、プラスタブを表示しません。
3.  このとき同時に最後尾へのドロップができなくなっていました。
4.  6.4.88 で対応しました。

### -- 手順 --

1.  Editor1 を選択
2.  Term モードにする
3.  `Q`キーを押してパレットを開く
4.  `denote`タブを選択する
5.  `denote`タブをドラッグして、`warning`タブの前の矢印の上に移動する、タブの左側に空間ができること
6.  ドロップする
7.  `denote`タブが、`warning`タブの前に移動すること
8.  Z キーを押す
9.  `denote`タブが先頭に戻ること
10. a~p までの Attribute 定義を追加する
11. o を p の後ろにドロップする
12. `o`タブが`p`タブの後ろに移動すること

## 複数 Entity 選択時は、Entity 編集ダイアログに 、最後に選んだ Entity の Type と Attribute を表示すること

### 背景

1.  どの要素の Type を表示すればいいのかわからないので
2.  5.0.0 で Attribute 編集を追加した際に、全部消してしまうと再入力が大変すぎるので、なるべく残すようにしました。

### DenotationEntity

1.  Term モードにする
2.  複数 DenotationEntity を選択する
3.  Type を編集する
4.  Value 欄に最後に選んだ Entity の Type の Value が表示されること
5.  すべての Attribute の Predicate が表示されること
6.  Attribute の Predicate が重複した際は、最後に選んだ Entity の Value が表示されること

### BlockEntity

1.  Block モードにする
2.  複数 BlockEntity を選択する
3.  Type を編集する
4.  Value 欄に最初の Type の Value が表示されること

## BlockEntity 編集ダイアログの編集確定

### 背景

1. 6.4.90 で、Entity 編集ダイアログに表示する Attribute の pred と一緒にショートカットキーを表示するようにしました
2. 6.4.90 で、ショートカットキーを表示した際、編集後の保存用の pred と表示用の pred を分けていなかったため、編集ダイアログを開いて閉じるだけで、エラーが起きていました
3. 6.4.92 で、対応しました

### OK ボタン

1.  Editor1 を選択
2.  Block モードにする
3.  Attribute のある、BlockEntity を選択する
4.  `W`キーを押す
5.  編集ダイアログが開くこと
6.  文字を変更する
7.  `OK`ボタンを押す
8.  BlockEntity の id が変わること

### Enter キー

1.  Editor1 を選択
2.  Block モードにする
3.  Attribute のある、BlockEntity を選択する
4.  `W`キーを押す
5.  編集ダイアログが開くこと
6.  文字を変更する
7.  `Enter`キーを押す
8.  BlockEntity の id が変わること

## DenotationEntity 編集ダイアログの編集確定

### 背景

1. 6.4.90 で、Entity 編集ダイアログに表示する Attribute の pred と一緒にショートカットキーを表示するようにしました
2. 6.4.90 で、ショートカットキーを表示した際、編集後の保存用の pred と表示用の pred を分けていなかったため、編集ダイアログを開いて閉じるだけで、エラーが起きていました
3. 6.4.92 で、対応しました

### OK ボタン

1.  Editor1 を選択
2.  Term モードにする
3.  Attribute のある、DenotationEntity を選択する
4.  `W`キーを押す
5.  編集ダイアログが開くこと
6.  文字を変更する
7.  `OK`ボタンを押す
8.  DenotationEntity の id が変わること

### Enter キー

1.  Editor1 を選択
2.  Term モードにする
3.  Attribute のある、DenotationEntity を選択する
4.  `W`キーを押す
5.  編集ダイアログが開くこと
6.  文字を変更する
7.  `Enter`キーを押す
8.  DenotationEntity の id が変わること

## カット&ペースト

### 背景

1.  6.0.0 でカット&ペースト機能を導入しました
2.  6.0.3 でカットをキャンセルできるようにしました
3.  6.0.0 から複数の Span を選択してペーストするとエラーが起きていました
4.  6.1.12 で、対応しました
5.  6.1.15 で、ペーストしたときに Span だけが残っていました
6.  6.2.104 で、対応をしました
7.  6.1.15 で、カットした Span を自分自身にペーストできるようになっていました
8.  6.2.105 で、対応をしました

### 自分自身にペーストできない

1.  Term モードにする
2.  Span を選択して`x`キーを押す
3.  Entity とラベルが半透明になること
4.  その Span を選択したまま、貼り付ける
5.  何も起きないこと

### カット&ペースト

1.  Term モードにする
2.  Span を選択して`x`キーを押す
3.  Entity とラベルが半透明になること
4.  他の Span を選択して貼り付ける
5.  選択した Span の全ての Entity と Attribute が、対象 Span に張り付く
6.  Relation も張り付く
7.  元々あった Entity とラベルはなくなる

### 複数 Span を選択してペーストできない

1.  Span を選択して`x`キーを押す
2.  Entity とラベルが半透明になること
3.  複数の Span を選択して`v`キーを押して貼り付ける
4.  何も起きないこと

### カット状態のキャンセル

1.  Span を選択して`x`キーを押す
2.  Entity とラベルが半透明になること
3.  同じ Span を選択したまま`x`キーを押す
4.  Entity とラベルが半透明でなくなること

## DenotationEntity 選択時のコントロールバーの見た目の変化

### 背景

1.  5.0.0 になるときに、label の編集機能を追加しました。
2.  `Show label list editor [Q]`ボタンをクリックするとパレットで、label を編集します。
3.  変更対象を選んでいるかどうかによらず、`Show label list editor [Q]`は常に有効です。
4.  5.3.0 で`Add Attributes [T]`を廃止しました
5.  6.0.0 で Modification を廃止しました。
6.  6.0.0 でカット&ペースト機能を導入しました。
7.  6.1.1 で Entity 選択時にコントロールバーのアイコンの状態が更新されていませんでした。
8.  6.1.15 で修正しました。

### -- 手段 --

1.  Term モードにする
2.  Entity を選択する
3.  コントロールバーの`Change label [W]`アイコンが有効になること
4.  コントロールバーの`Delete [D]`アイコンが有効になること
5.  コントロールバーの`Copy [C]`アイコンが有効になること
6.  コントロールバーの`Cut [X]`アイコンが有効になること

## BlockSpan 選択時のコントロールバーの見た目の変化

### 背景

1.  6.2.0 からブロック機能を追加
2.  6.2.51 で、`Add new entity[E]`, `Copy [C]`, `Cut [X]`が有効にならないようにしました
3.  6.2.52 で、`Replicate span annotation [R]`が有効にならないようにしました

### −− 手段 --

1.  Block モードにする
2.  BlockSpan を選択する
3.  コントロールバーの`Change label [W]`アイコンが有効になること
4.  コントロールバーの`Delete [D]`アイコンが有効になること

## Relation 編集ダイアログ

### W キー

1.  Relation モードにする
2.  Relation を選択する
3.  `W`キーを押す
4.  編集ダイアログが開くこと
5.  選択した Relation の Type の id が表示されること

### 複数 Relation 選択時はは元の文字列は表示されない

#### 背景

1.  どの要素の Type を表示すればいいのかわからないので

#### -- 手段 --

1.  Relation モードにする
2.  複数 Relation を選択する
3.  Type を編集する
4.  空文字が表示されること

## Relation 編集ダイアログでラベルを持たない Relation を開く

### 背景

1.  6.3.29 で HTML 生成用のテンプレートを Handlebars.js からテンプレートリテラルに変えたときに、ラベルを持たない Entity のラベルに null と表示されるようになりました。
2.  6.4.44 で対応

### -- 手段 --

1.  Editor0 を選択
2.  Relation モードにする
3.  ラベルを持たない Relation を選択
4.  `Change Label[W]`ボタンを押す
5.  編集ダイアログが開くこと
6.  `Value:`の右に何も表示されないこと

## 親子 Span 編集

### 子 Span を選択して縮める

1.  子の Span を選択
2.  親の範囲外で mousedown して、子 Span の中で mouseup して、子 span を縮める
3.  戻す

### Type を２つ持つ Span に親を作る

#### 背景

1.  Grid の高さを子の Span の Type にかぶらないように上にずらしています

#### -- 手段 --

1.  Type を二つ持つ Span に親を作る
2.  親の Type が二つの Type の上に表示されること

### 入れ子 Span を編集

1.  子の Span を親の範囲内でのばす
2.  親の Span を子にかぶらないように縮める
3.  戻す

### 同じサイズに

1.  親を子と同じサイズに縮める
2.  消える

### 親子 Span を入れ替える

1.  親 Span と子 Span の片側をあわせる
2.  親 Span の合っていない側を子 Span の内側に寄せる
3.  親と子の Type の位置が入れ替わること

## 親 Span を選択してのばす

### 背景

1.  6.0.0 で、意図せずに、アンカーノードの親が選択されているときだけ、Span を伸ばすように変更していた
2.  6.1.35 で、アンカーノードの先祖ノードが選択されていれば、Span を伸ばすように修正して、対応した

### -- 手段 --

1.  親の Span を選択
2.  子の上で mousedown して、親 Span の外で mouseup して、親 Span をのばす
3.  戻す

## Type 定義の編集

### デフォルトラジオボタンが見きれない

#### 背景

1.  6.3.33 で、見切れていたデフォルトラジオボタンをダイアログに収めました

#### -- 手段 --

1.  Editor0 を選択
2.  Term モードにする
3.  `Select Label [Q]`ボタンをクリックする
4.  `Edit this type`ボタンをクリックする
5.  デフォルトラジオボタンが見切れていないこと

### パレットに表示している、インスタンスの情報から取得した型のラベルを変更

#### 背景

1.  パレットには config 上に Type 定義がなくても、インスタンスの Type を表示します
2.  ユーザーの操作としては、既存の Type 定義の編集にみえますが、TypeDefinition 上は新しい Type 定義の追加操作です
3.  これを勘違いして常に既存 Type 定義の編集として実装し、エラーが起きていました
4.  6.1.51 で、変更後の ID を変更前の ID 上書きしないために、ID のマージをなくす修正をしました。
5.  ラベル変更時に、新しく追加する型情報に ID がないと、Map の key が undefined になりエラーが起きました。
6.  6.2.5 で、ID はマージするが上書きしない対応をしました。

#### -- 手段 --

1.  Editor0 を選択
2.  Relation モードにする
3.  `Select Label [Q]`ボタンをクリックする
4.  `Edit this type`ボタンをクリックする
5.  `Label`欄を変更する
6.  `OK`ボタンを押す
7.  エラーがおきないこと

### パレットに表示している、インスタンスの情報から取得した型の ID を変更

#### 背景

1.  5.0.0 でパレットにインスタンスの情報から取得した型を表示している
2.  この種の型の ID を変更したときに、追加される型の ID が変更前の値であるバグがありました
3.  同時にインスタンスの ID は変更しているため、パレット上には型が増えたように見えていました
4.  6.1.51 で対応

#### -- 手段 --

1.  Editor0 を選択
2.  Relation モードにする
3.  `Select Label [Q]`ボタンをクリックする
4.  `Edit this type`ボタンをクリックする
5.  `Id`欄を変更する
6.  `OK`ボタンを押す
7.  既存の型定義の id が更新されれるだけで、新しい型定義が増えないこと

## デフォルトの Type 定義の ID を変更したときにデフォルト情報も更新する

### 背景

1.  デフォルトの Type 定義の ID を変更したとき、Type 定義の情報を更新します
2.  デフォルトの ID 情報を更新していません。変更前の ID のままでした
3.  デフォルトの Type 定義の ID を変更したとき、デフォルト情報が消えました
4.  デフォルトの Type 定義の ID を変更したあとに、Entity をつくると変更前の ID で Entity が作成されます
5.  6.4.41 で対応しました

### --- 手段 ---

1.  Editor0 を選択
2.  Term モードにする
3.  `Select Label [Q]`ボタンをクリックする
4.  `Protein`の`Edit this type`ボタンをクリックする
5.  `Id`を変更して、`OK`ボタンをクリックする
6.  パレット上の`Proetin`のデフォルトマークが消えないこと

## autocompletion_ws 属性

### autocompletion_ws 属性で URL を指定すると、オートコンプリートの候補を指定 URL から取得する

1.  <http://localhost:8000/dist/demo/bionlp-st-ge/demo-multi.html> を開く
2.  一つ目の Editor を選択する
3.  Entity を選択する
4.  `Change Label[W]`ボタンを押す
5.  既存の Value を消す
6.  `Lig`を入力
7.  候補に`Light stuff@http://www.yahoo.co.jp`が表示されること

### autocompletion_ws 属性が指定されていなくても、config からオートコンプリートの候補を取得

1.  <http://localhost:8000/dist/demo/bionlp-st-ge/demo-multi.html> を開く
2.  二つ目の Editor を選択する
3.  Entity を選択する
4.  `Change Label[W]`ボタンを押す
5.  既存の Value を消す
6.  `pro`を入力
7.  候補に`production company@http://dbpedia.org/ontology/productionCompany`が表示されること

## オートコンプリートの候補を表示したときに Relation 編集ダイアログに横スクロールバーが表示されないこと

### 背景

1.  6.4.20 で対応しました。

### --- 手段 ---

1.  Editor1 を選択
2.  Relation モードにする
3.  Relation を選択する
4.  `Change Label[W]`ボタンを押す
5.  既存の id を消す
6.  `par`を入力
7.  候補に`parent@http://dbpedia.org/ontology/parent`が表示されること
8.  ダイアログに横スクロールバー表示されないこと

## パレットから Selection Attribute の Value を連続的に変更できる

### 背景

1. jQueryUI Draggable Widget を使ってパレットをドラッグアンドドロップで移動できるようにしています
2. パレットでラベルをクリックして Entity と Relation のタイプを変えるとき、セレクション Attribute の Value を変えることができます
3. このときに、マウスダウンからマウスアップまでの間に、マウスを少しでも動かすとドラッグアンドドロップになり、ラベルがクリックできません
4. 特に、マウスカーソルを移動しながら、ラベルをクリックしようとするときに上記現象が起きやすく、マウスカーソルの移動をいったん止めないと、確実なラベルクリックができません
5. 6.4.33 で、マウスダウンしながら 10 ピクセル以上移動しなければ、パレットを移動できなくしました

### -- 手段 --

1.  Editor1 を選択
2.  Term モードにする
3.  DenotationEntity を選択する
4.  パレットを開く
5.  denote タブを選択する
6.  マウスカーソルを移動しながらテーブル上の selection attribute label を次々と変更する
7.  選択した DenotationEntity の Attribute がクリックに応じて変更されること
8.  selection attribute label をマウスダウンしたまま、カーソルを移動する
9.  パレットを移動できること

## パレットからは重複した Selection Attribute をもつ Entity の Obcjet を変更できない

### 背景

1.  6.4.1 で、Annotation ファイルの読込時 Validation での Attribute のチェックを緩め、 1 つの Entity に Predicate と Object が等しい Attribute が複数ついているかのチェックに変更しました
2.  重複した Selection Attribute を持つ Entity の Selection Attribute の Object をパレットから変更できるようになりました
3.  Denotation 編集モードと Block 編集モードでパレットが分かれています
4.  二つのパレットは Selection Attribute のラベル選択時に、同じイベントを発火します
5.  Obcjet 変更処理を上記イベントにバインドしていたため、一回の Selection Attribute のラベル選択で、二回 Obcjet 変更を実行していました
6.  パレットから、重複した Selection Attribute を持つ Entity の Selection Attribute の Object を変更すると、ちょうど二つの Attribute の Obcjet が変更されていました
7.  6.4.34 で Selection Attribute の Obcjet 変更処理を、パレットのイベントに直接バインドして、一回だけ実行するようにしました
8.  6.4.35 で重複した Selection Attribute を持つ Entity の パレットからの Selection Attribute の Obcjet 変更を禁止しました

### -- 手段 --

1.  Editor1 を選択
2.  Term モードにする
3.  DenotationEntity `E1:a:b` を選択する
4.  `q` キーを押してパレットを開く
5.  denote タブを選ぶ
6.  パレットの Value ラベルをクリックする
7.  `An item among the selected has this attribute multiple times.`がトースト表示されること
8.  `E1:a:b` の`denote` Attribute の Object が変更されないこと

## ショートカットで Attribute インスタンスを削除する

### 背景

1.  6.4.1 で、Annotation ファイルの読込時 Validation での Attribute のチェックを緩め、 1 つの Entity に Predicate と Object が等しい Attribute が複数ついているかのチェックに変更しました
2.  重複した Attribute を持つ Entity から Attribute を を削除すると、指定した Predicate の Attribute は一つずつ削除され、その順番は制御できません
3.  6.4.36 から、選択中の Entity から、指定 Predicate の Attribute をすべて削除します

### ショートカットで BlockEntity の Attribute インスタンスを削除する

1.  Editor1 を選択
2.  Block モードにする
3.  BlockEntity `B1` を選択する
4.  Shift を押しながら 1 キーを押すと、選択中の Entity の該当 predicate のすべての Attribute が削除されること
5.  T キーを押しても何も起きないこと

### ショートカットで DenotationEntity の Attribute インスタンスを削除する

1.  Editor1 を選択
2.  Term モードにする
3.  DenotationEntity `E1:a:b` を選択する
4.  Shift を押しながら 1 キーを押すと、選択中の Entity の該当 predicate のすべての Attribute が削除されること
5.  T キーを押しても何も起きないこと

## パレットから Attribute インスタンスを削除する

### 背景

1.  5.0.0 で、Attribute を追加するためにのショートカットキー T を追加しました
2.  5.0.2 で、1~5 のキーで選択中の Entity へ、Attribute を追加、shift と同時押しで削除するようにしました
3.  5.0.5 で、Attribute のショートカットキーを 1~9 までに増やしました
4.  5.2.0 で、Attribute のショートカットキー T を廃止しました
5.  5.2.3 で編集ダイアログの編集機能は廃止され、パレットを開くボタンに代わりました
6.  6.2.71 で Block モードでパレットが開けるようになりました
7.  6.2.79 で で Block モードで、ショートカットキー 1~9 で Attribute の追加ができるようになりました
8.  6.4.1 で、Annotation ファイルの読込時 Validation での Attribute のチェックを緩め、 1 つの Entity に Predicate と Object が等しい Attribute が複数ついているかのチェックに変更しました
9.  重複した Attribute を持つ Entity から Attribute を を削除すると、指定した Predicate の Attribute は一つずつ削除され、その順番は制御できません
10. 6.4.36 から、選択中の Entity から、指定 Predicate の Attribute をすべて削除します

### パレットから BlockEntity の Attribute インスタンスを削除する

1.  Editor1 を選択
2.  Block モードにする
3.  BlockEntity `B1` を選択する
4.  `q` キーを押してパレットを開く
5.  denote タブを選ぶ
6.  パレットの`Remove from selected entity`ボタンを押すと、`B1` の該当 predicate のすべての Attribute が削除されること

### パレットから DenotationEntity の Attribute インスタンスを削除する

1.  Editor1 を選択
2.  Term モードにする
3.  DenotationEntity `E1:a:b` を選択する
4.  `q` キーを押してパレットを開く
5.  denote タブを選ぶ
6.  パレットの`Remove from selected entity`ボタンを押すと、`E1:a:b` の該当 predicate のすべての Attribute が削除されること

## Type 定義編集ダイアログに横スクロールバーが表示されないこと

### label 欄のオートコンプリートの候補を表示したとき

#### 背景

1.  6.4.23 で対応しました。

#### --- 手段 ---

1.  Editor1 を選択
2.  Term モードにする
3.  `q`を押してパレットを表示する
4.  `Edit this type`ボタンをクリックする
5.  既存の label を消す
6.  `pro`を入力
7.  候補に`production@http://dbpedia.org/ontology/production`が右寄せで表示されること
8.  ダイアログに横スクロールバー表示されないこと

### Id 欄のオートコンプリートの候補を表示したとき

#### 背景

1.  6.4.22 で対応しました。

#### --- 手段 ---

1.  Editor1 を選択
2.  Term モードにする
3.  `q`を押してパレットを表示する
4.  `Edit this type`ボタンをクリックする
5.  既存の id を消す
6.  `pro`を入力
7.  候補に`production@http://dbpedia.org/ontology/production`が右寄せで表示されること
8.  ダイアログに横スクロールバー表示されないこと

## ラベルの定義に HTML タグが含まれているとき、HTML エスケープした文字列を Entity のラベルとして表示すること

### 背景

1. Entity のラベルには Type 定義の`label`を表示しています。
2. HTML エスケープしていないため、`label`に HTML タグを含む Type を定義すると、Entity のラベルに任意の HTML タグを挿入することが可能です。
3. 6.4.25 で対応しました。

### -- 手段 --

1. Editor1 を選択
2. DenotationEntity `E31` のラベルが赤字の`Red color HTML label`ではなく、`<span style='color: red;'>Red color HTML label</span>`であること
3. BlockEntity `B1` のラベルが赤字の`Red color HTML label`ではなく、`<span style='color: red;'>Red color HTML label</span>`であること

## ラベルの定義に HTML タグが含まれているとき、パレットに HTML エスケープした文字列を Entity のラベルとして表示すること

### 背景

1. Entity のラベルには Type 定義の`label`を表示しています。
2. HTML エスケープしていないため、`label`に HTML タグを含む Type を定義すると、パレット上のラベルに任意の HTML タグを挿入することが可能です。
3. 6.4.26 で対応しました。

### -- 手段 --

1. Editor1 を選択
2. Term モードにする
3. `q`を押してパレットを開く
4. `HTML tag label` のラベルが赤字の`Red color HTML label`ではなく、`<span style='color: red;'>Red color HTML label</span>`であること
5. Block モードにする
6. `q`を押してパレットを開く
7. `HTML tag label` のラベルが赤字の`Red color HTML label`ではなく、`<span style='color: red;'>Red color HTML label</span>`であること

## 必須プロパティのない Attributes 定義を読み込んだらエラーを alertify.js で表示

### 背景

1.  5.0.0 で、Entity と Type の定義を書いたコンフィグレーションを動的に（html の config 属性以外の方法で）読み込みできるようになりました。
2.  5.0.2 で、config の JSON scheme を使ったバリデーションを追加しました。
3.  5.3.3 から、config 中の Attribute 定義に必須プロパティが無いときに、アラートに pred とプロパティ名を表示します。
4.  5.3.5 から、config 中の SelectionAttribute 定義に values プロパティが無いときに、自動生成するようになりました。

### -- 手段 --

1.  `Select Label [Q]`ボタンをクリックする
2.  コンフィグレーション読込ダイアログを開く
3.  `invalid_attributes_config.json`を読み込む
4.  右上に`Invalid configuration: The attribute type whose predicate is 'category' misses a mandatory property, 'default'.`と赤色のトースト表示がされること

## 不正なフォーマットの color を含む型定義を読み込んだらエラーを alertify.js で表示

### 背景

1. Entity, Block, Relation, Attribute の Type 定義に`color`があります。
2. 内部的には JSONScheme を使って`color`のフォーマットをチェックしていますが、不正なフォーマットであっても読み込んでいます。
3. `color`の表示は、HTML エスケープしていないため、`color`に HTML タグを含む Type を定義すると、Entity, Block, Relation, Attribute, パレットに任意の HTML タグを挿入することが可能です。
4. 6.4.27 で不正なフォーマットの color を含む型定義を読み込んだらエラーにする対応をしました。

### -- 手段 --

1.  アノテーション読込ダイアログを表示
2.  URL 欄に`invalid_color_annotation.json`を入力
3.  `Open`ボタンをクリック
4.  右上に`Invalid configuration: '<span style='color:red'>Invalid color format</span>' is invalid color format.`と赤色のトースト表示がされること

## パスに日本語を含む URL から annotations ファイルを読み込んだときにステータスバーにデコードした URL を表示する

### 背景

1.  5.0.0 の開発中にステータスバーにパスが表示されない URL を発見しました。
2.  パスに日本語を含む URL を URL エンコードしたままステータスバーに表示すると、URL が長くなりすぎます
3.  Firefox では一定長で切られ、Chrome と Safari では改行されて、見えなくなります
4.  長過ぎる URL を省略して表示するで統一してもいいのですが、人間が見たいのはデコードした URL なので、ステータスバーに表示する
    URL をデコードします

### -- 手段 --

1.  `ゆりかごのうた.json` を読み込む
2.  ステータスバーに表示される URL がデコードされていて、日本語になっていること

## ステータスバーの表示

### URL が長いときは...を表示する

#### 背景

1.  URL が長い場合に、 `Source:` の後ろで改行され、URL がフッターの範囲外に出てしまい表示されていませんでした
2.  5.0.0 からステータスバーに表示する URL が長いときは省略して表示し、改行されないようにしました
3.  ブラウザの幅が 726px 以下の時に、`Source:` の後ろで改行され、URL がフッターの範囲外に出てしまい表示されていませんでした
4.  6.4.30 で対応しまた

#### -- 手段 --

1.  Editor0 を選択
2.  ブラウザの幅を 726px 以下縮める
3.  URL の末尾が切れて`...`が表示されること

### annotations ファイルを URL で読み込んだとき

1.  絶対 URL パスで読み込んだとき、ファイルの絶対パスが表示されること（editor0）
2.  絶対 URL パスで読み込んだとき、リンクが開けること（editor0）
3.  相対 URL パスで読み込んだとき、ファイルの絶対パスが表示されること（editor1）
4.  相対 URL パスで読み込んだとき、リンクが開けること（editor1）

### annotations ファイルをローカルファイルから読み込んだとき

1.  annotations ファイルのファイル名と`(local file)`が表示されること

### annotations を inline で指定したとき

1.  inline で annotations ファイルを読み込んだ場合は`inline`が表示されること（editor5）

## パレットの行追加ボタンをテーブルに表示する

### 背景

1. パレットの行追加するボタンが、コンフィグレーション読込、保存ボタンと並んでいる
2. Attribute タブを追加した結果、テーブルと行追加ボタンが離れて、間にタブ追加ボタンが入り、なんのためのボタンかわかりにくなりました
3. 6.4.32 で、行追加ボタンをテーブルヘッダーに移動しました。

### -- 手段 --

1. Editor1 を選択
2. Term モードにする
3. `q`を押してパレットを開く
4. テーブルヘッダーの一番右のカラムにプラスボタンが表示されていること
5. `denote`タブに切り替え
6. テーブルヘッダーの一番右のカラムにプラスボタンが表示されていること
7. `score`タブに切り替え
8. テーブルヘッダーの一番右のカラムにプラスボタンが表示されていること
9. `free_text`タブに切り替え
10. テーブルヘッダーの一番右のカラムにプラスボタンが表示されていること
11. Relation モードにする
12. `q`を押してパレットを開く
13. テーブルヘッダーの一番右のカラムにプラスボタンが表示されていること

## ステータスバーの表示非表示

### 背景

1.  4.1.6 でステータスバーのデフォルト非表示になりました
2.  status_bar オプションで切り替えます
3.  値は on と off の２つです

### -- 手段 --

1.  属性の status_bar に on を指定するとステータスバーが表示されること（editor1）
2.  属性の status_bar を指定しないとステータスバーが表示されないこと（editor2）

## BlockSpan をつくったときにドキュメントの最上部までスクロールしない

### 背景

1.  6.2.0 からブロック機能を追加
2.  BlockSpan を作ったとき、同時に BlockEntity を作成し両者を選択します
3.  エンティティを選択する際に、ラベルにフォーカスをあてて、選択しているエンティティをブラウザの表示領域にスクロールインします
4.  BlockEntity を作成する際、位置の基準となる Div の位置がブラウザ上で確定するするのが遅いため、一瞬ドキュメントの最上部に配置されます
5.  このときフォーカスするとブラウザがドキュメントの最上部までスクロールします
6.  6.2.49 で、BlockEntity を選択する際に、位置が確定していなければ、確定後にフォーカスする処理をいれ、対応しました

### -- 手段 --

1.  Editor4 を選択
2.  Block モードにする
3.  BlockSpan を追加する
4.  ブラウザがドキュメントの最上部までスクロールしないこと

## 上下キーで Span と Entity の選択を切り替える

### 背景

1.  6.1.1 で一つの denotation を一つのエンティティに表示することしました。
2.  Type と Entity の選択状態が区別されなくなりました。
3.  6.1.1 で上下キーがによる Span と Entity の選択切り替えを Relation モードで動かなくしようとして、一緒にシンプルもーおでも動かなくしていました
4.  6.4.12 で対応しました

### Term モード

1.  Term モードにする
2.  Span を選択する
3.  `上キー`を押す
4.  Span の一番先頭の Entity が選択されること
5.  Entity を選択する
6.  `下キー`を押す
7.  Entity の Span が選択されること

### Simple モード

1.  Simple モードにする
2.  Span を選択する
3.  `上キー`を押す
4.  Span の一番先頭の Entity が選択されること
5.  Entity を選択する
6.  `下キー`を押す
7.  Entity の Span が選択されること

## 選択してアノテーションを読み込んでエラーが起きない

### 背景

1.  6.1.39 で発生
2.  SelectionModel 中で選択解除された、モデルから Span モデルインスタンスを取得し、表示上の選択状態を選択解除にする
3.  アノテーションファイルを読み直したときは、モデル上の Span モデルインスタンスが取得できずに、エラーになっていました
4.  6.2.25 で対応。Span モデルインスタンスが取得できないときは、表示上の選択状態を選択解除しなくしました
5.  さらに SelectionModel で Span モデルインスタンスの参照を保持し、選択解除のときに、モデルからインスタンスを取得するのをやめました
6.  6.2.25 の対応では不十分でした。Entity を選択したまま、アノテーションファイルを読み直したときにエラーが起きていました。
7.  6.4.9 で、アノテーション読み直す時は、SelectionModel からインスタンスを消すだけにし、表示上の選択状態を変更しなくしました。

### -- 手段 --

1.  Span を選択する
2.  別のアノテーションファイルを読み込む
3.  エラーが起きないこと
4.  Entity を選択する
5.  別のアノテーションファイルを読み込む
6.  エラーが起きないこと

## 2 つ以上連続した空白を選択してもエラーにならないこと

### 背景

1.  2 つ以上連続した空白を選択したときに、空白を一つだけ消して、残りの空白で Span を作成していました
2.  Span のレンダリング時にエラーが起きていました
3.  6.1.44 で対応

### -- 手段 --

1.  Editor9 を選択
2.  Term モードにする
3.  `stomach ache`の間の連続した空白を選択する
4.  選択が解除されて、何もおきないこと

## 読み込んだアノテーションに不正データが含まれていたら Validation Dialog を表示すること

### 背景

1.  annotation.json に不正なデータが入っていた場合にエラーがおきていました
2.  4.1.8 で annotation.json のデータチェック機能を追加しました
3.  元のデータを修正しているので、`Upload`ボタンを有効にします
4.  4.1.12 でクロスする Span の検出機能を追加しました
5.  4.1.15 で Validation Dialog タイトルのミススペルを修正しました
6.  5.0.0 で`Upload`ボタンの制御を有効無効から、星マークの有無に変更しました
7.  6.4.6 で Validation Dialog の高さ設定をなくしました。内容に応じて Validation Dialog 高さがのび、スクロールバーを表示しなくしました。

### -- 手段 --

1.  invalid.json を読み込む
2.  不正なデータを検出して Validation Dialog を表示すること
3.  Validation Dialog のタイトルが`The following erroneous annotations ignored`であること
4.  Validation Dialog 内にスクロールバーが表示されないこと

## 改行コード`\r\n`を含むテキストに対してレンダリングの位置がズレないこと

### 背景

1.  6.0.0 でテキスト中の改行のレンダリングをパラグラフから、css の`white-space: pre-wrap;`に変更しました
2.  この結果、改行のレンダリングをブラウザに任せました
3.  `\r\n`はテキスト上では 2 文字ですが、ブラウザ上では 1 つの改行としてレンダリングされます
4.  Span をレンダリングするときに、`\r\n`を 2 文字としてカウントしていたため、レンダリング位置が 1 文字分ずつ後ろにズレました
5.  6.3.21 で、TextAE 内部で扱うテキストの`\r\n`を`\n`に置き換えることで、1 文字として扱うことにしました
6.  6.4.0 で、TextAE で表示するテキストの`\r\n`を` \n`に置き換えることで、空白文字と改行文字の 2 文字でブラウザ上にレンダリングされるようにしました

### -- 手段 --

#### 改行コード`\r\n`を含むテキストに対して作成した Span の位置がズレないこと

1. Editor1 を選択
2. Term モードにする
3. 3 行目の先頭の単語`Although`を DenotationSpan にする
4. 保存ダイアログを開く
5. `Click to see the json source in a new window.`リンクをクリック
6. 表示された JSON の`T19`の begin が`147`、end が`155`であること

#### 改行コード`\r\n`を含むテキストに対してレンダリングの位置がズレないこと

1. http://pubannotation.org/projects/twitter-test/docs/sourcedb/@BLAH6-Tweets/sourceid/19546372/annotations.json を開く
2. 2 行目以降に DenotationSpan を作成する
3. DenotationSpan が選択した文字列に作成されること

## Entity を作成すると自動選択

### 背景

1.  新規 Entity の ID を anntotian.json の dennotation の id から連番で降っています
2.  T ではじまる ID を生成した ID として扱っていました
3.  annotation.json に id が T ではじまって数字以外を含む dennotation（たとえば T1.a.b）を入れると新規 ID が常に TNaN になります
4.  Entity を何個作っても TNaN が振られます
5.  作成後 ID で DOM を選択する際に、最初の一個が選択されます
6.  4.1.14 で対応しました
7.  生成した ID を T 数字のみに制限しました

### -- 手段 --

1.  Term モードにする
2.  Span を作る
3.  Entity を追加する
4.  二つの作った Entity が選択されること
5.  Span を作る
6.  後に作った Span の Entity だけが選択されること(前に作った Span の Entity が選択されないこと)

## 外部 JavaScript で URL パラメータから属性に設定した値が反映されること

### 背景

1.  4.5.0 で URL パラメータを読むのをやめました
2.  外部の JavaScript で textae-editor に設定した属性は読みます
3.  外部の JavaScript で textae-editor に URL パラメータの値を設定するサンプルの動作確認をします

### -- 手段 --

1.  <http://localhost:8000/dist/editor.html?mode=edit&source=%2Fdev%2F1_annotations.json> を開く
2.  1_annotations が表示されること
3.  Editor1 を選択
4.  Edit モードであること

## config の PushButton 設定

### 背景

1.  6.1.5 から config で自動保存、境界検出、行の高さ自動調整の ON/OFF を設定できるようになりした

### 自動保存

1.  Editor0 の自動保存が無効であること
2.  Editor1 の自動保存が有効であること
3.  Editor2 の自動保存が無効であること

### 境界検出

1.  Editor0 の境界検出が有効であること
2.  Editor1 の境界検出が有効であること
3.  Editor2 の境界検出が無効であること

### 行の高さ自動調整

1.  Editor0 の行の高さ自動調整が無効であること
2.  Editor1 の行の高さ自動調整が有効であること
3.  Editor2 の行の高さ自動調整が無効であること

## 境界検出

### 背景

1.  テキストをドラッグすると delimiter character まで自動的に調整してくれる機能があります
2.  4.1.7 で、この機能を`Boundary Detection`ボタンで On/Off できるようになりました
3.  ショートカットキーは`b`です
4.  6.0.0 でショートカットキー`b`が動作しなくなりました。6.0.3 で対応しました。

### ショートカットキー`b`

1.  ショートカット`b`を押す
2.  `Boundary Detection`ボタンを押上状態になること
3.  単語の一部を選択する
4.  単語の選択部分が Span になること
5.  ショートカット`b`を押す
6.  `Boundary Detection`ボタンを押下状態にする
7.  単語の一部を選択する
8.  単語全体が Span になること

### `Boundary Detection`ボタン

1.  `Boundary Detection`ボタンを押下状態にする
2.  単語の一部を選択する
3.  単語全体が Span になること
4.  `Boundary Detection`ボタンを押上状態にする
5.  単語の一部を選択する
6.  単語の選択部分が Span になること

### Span をのばす縮める

#### Boundary Detection 有効時の動作

1.  Span をのばす
2.  右に
3.  左に
4.  Span を縮める
5.  戻す
6.  単語単位で変更されること

#### Boundary Detection 無効時の動作

1.  Span をのばす
2.  右に
3.  左に
4.  Span を縮める
5.  戻す
6.  文字単位で変更されること

## config で Entity の Type に label 属性を定義

### 背景

1.  4.3.0 から config に Entity の Type に label を定義できるようになりました

### -- 手段 --

1.  Edtor1 を選択
2.  Term モードにする
3.  Entity を選択する
4.  `w`キーを押して、Type を`http://www.yahoo.co.jp`に変更します
5.  Type の表示が`Regulation`になること
6.  V アイコンを押して View モードに切り替える
7.  Type のラベルがリンクになること
8.  リンクをクリックすると`http://www.yahoo.co.jp`が開くこと

## config の autocompletion_ws 属性

### 背景

1.  5.2.0 で config でオートコンプリートの URL を指定できるようになりました
2.  6.2.0 からブロック機能を追加

### -- 手段 --

#### config の autocompletion_ws 属性で URL を指定すると、オートコンプリートの候補を指定 URL から取得する

##### Type のラベル変更

1.  Editor2 を選択
2.  Span を作成する
3.  `Change Label[W]`ボタンを押す
4.  既存の id を消す
5.  `SPA`を入力
6.  候補に`http://www.amazon.com/Learning-SPARQL-Bob-DuCharme/dp/1449371434/ref=sr_1_1?ie=UTF8&qid=1452147643&sr=8-1&keywords=sparql`が右寄せで表示されること

##### DenotationEntity の Type 定義の追加

1.  Editor2 を選択
2.  Term モードにする
3.  `Select Label [Q]`ボタンをクリックする
4.  `Add new type`ボタンをクリックする
5.  `Id`欄に`SPA`を入力する
6.  候補に`http://www.amazon.com/Learning-SPARQL-Bob-DuCharme/dp/1449371434/ref=sr_1_1?ie=UTF8&qid=1452147643&sr=8-1&keywords=sparql`が右寄せで表示されること

##### DenotationEntity の Type 定義の変更

1.  Editor2 を選択
2.  Term モードにする
3.  `Select Label [Q]`ボタンをクリックする
4.  `Edit this type`ボタンをクリックする
5.  `Id`欄に`Lig`を入力する
6.  候補に`http://www.yahoo.co.jp`が右寄せで表示されること

##### BlockEntity の Type 定義の追加

1.  Editor2 を選択
2.  Block モードにする
3.  `Select Label [Q]`ボタンをクリックする
4.  `Add new type`ボタンをクリックする
5.  `Id`欄に`SPA`を入力する
6.  候補に`http://www.amazon.com/Learning-SPARQL-Bob-DuCharme/dp/1449371434/ref=sr_1_1?ie=UTF8&qid=1452147643&sr=8-1&keywords=sparql`が右寄せで表示されること

##### BlockEntity の Type 定義の変更

1.  Editor2 を選択
2.  Block モードにする
3.  `Select Label [Q]`ボタンをクリックする
4.  `Edit this type`ボタンをクリックする
5.  `Id`欄に`Lig`を入力する
6.  候補に`http://www.yahoo.co.jp`が右寄せで表示されること

##### Relation の Type 定義の追加

1.  Editor2 を選択
2.  Relation モードにする
3.  `Select Label [Q]`ボタンをクリックする
4.  `Add new type`ボタンをクリックする
5.  `Id`欄に`SPA`を入力する
6.  候補に`http://www.amazon.com/Learning-SPARQL-Bob-DuCharme/dp/1449371434/ref=sr_1_1?ie=UTF8&qid=1452147643&sr=8-1&keywords=sparql`が右寄せで表示されること

##### Relation の Type 定義の変更

1.  Editor2 を選択
2.  Relation モードにする
3.  `Select Label [Q]`ボタンをクリックする
4.  `Edit this type`ボタンをクリックする
5.  `Id`欄に`Lig`を入力する
6.  候補に`http://www.yahoo.co.jp`が右寄せで表示されること

#### html の autocompletion_ws 属性は config の autocompletion_ws 属性にまさる

1.  Editor1
2.  Entity を選択する
3.  `Change Label[W]`ボタンを押す
4.  既存の id を消す
5.  `par`を入力
6.  候補に`parent@http://dbpedia.org/ontology/parent`が右寄せで表示されること

## DenotationSpan が親で StyleSpan が子のとき、さらにその親 DenotationSpan があるとき、StyleSpan 上で mousedown して、DenotationSpan 上で mouseup する

### 背景

1.  6.1.56 で対応
1.  6.3.28 で、DenotationSpan を選択していない場合、StyleSpan と DenotationSpan が端を共有していて、かつ端を mousedown したときのみ DenotationSpan を縮めることにしました

### 1 つ上の親 DenotationSpan で mouseup すると

1.  Editor1 を選択
2.  StyleSpan を子に持つ DenotationSpan を作る
3.  さらに親 DenotationSpan を作る
4.  選択を解除する
5.  StyleSpan 上で mousedown して、1 つ上の親 DenotationSpan 上で mouseup する
6.  1 つ上の親 DenotationSpan が縮まない

### 1 つ上の親 DenotationSpan と端を共有しているときに、 mouseup すると

1.  Editor1 を選択
2.  StyleSpan を子に持ち、その端を共有する DenotationSpan を作る
3.  さらに親 DenotationSpan を作る
4.  選択を解除する
5.  StyleSpan と 1 つ上の親 DenotationSpan で共有した端で mousedown して、1 つ上の親 DenotationSpan 上で mouseup する
6.  1 つ上の親 DenotationSpan が縮む

### 2 つ上の親 DenotationSpan で mouseup すると

1.  Editor1 を選択
2.  StyleSpan を子に持つ DenotationSpan を作る
3.  さらに親 DenotationSpan を作る
4.  選択を解除する
5.  StyleSpan 上で mousedown して、2 つ上の親 DenotationSpan 上で mouseup する
6.  1 つ上の親 DenotationSpan が伸びる

### 1 つ上の親 Span を選択して、1 つ上の親 Span で mouseup すると

1.  Editor1 を選択
2.  StyleSpan を子に持つ Span を作る
3.  さらに親 Span を作る
4.  1 つ上の親を選択
5.  StyleSpan 上で mousedown して、1 つ上の親 Span 上で mouseup する
6.  1 つ上の親 Span が縮む

### 2 つ上の親 Span を選択して、1 つ上の親 Span で mouseup すると

1.  Editor1 を選択
2.  StyleSpan を子に持つ Span を作る
3.  さらに親 Span を作る
4.  2 つ上の親を選択
5.  StyleSpan 上で mousedown して、1 つ上の親 Span 上で mouseup する
6.  2 つ上の親 Span が縮む

### 1 つ上の親 Span を選択して、2 つ上の親 Span で mouseup すると

1.  Editor1 を選択
2.  StyleSpan を子に持つ Span を作る
3.  さらに親 Span を作る
4.  1 つ上の親を選択
5.  StyleSpan 上で mousedown して、2 つ上の親 Span 上で mouseup する
6.  1 つ上の親 Span が伸びる

### 2 つ上の親 Span を選択して、2 つ上の親 Span で mouseup すると

1.  Editor1 を選択
2.  StyleSpan を子に持つ Span を作る
3.  さらに親 Span を作る
4.  2 つ上の親を選択
5.  StyleSpan 上で mousedown して、2 つ上の親 Span 上で mouseup する
6.  2 つ上の親 Span が縮む

## StyleSpan が親で DenotationSpan が子のとき、さらにその親 DenotationSpan があるとき、StyleSpan 上で mousedown して、DenotationSpan 上で mouseup する

### 背景

1.  6.1.56 で対応

### 子 DenotationSpan で mouseup すると

1.  Editor1 を選択
2.  StyleSpan を親に持つ DenotationSpan を作る
3.  さらに親 DenotationSpan を作る
4.  選択を解除する
5.  StyleSpan 上で mousedown して、子 DenotationSpan 上で mouseup する
6.  子 DenotationSpan が縮む

### 親 DenotationSpan で mouseup すると

1.  Editor1 を選択
2.  StyleSpan を親に持つ DenotationSpan を作る
3.  さらに親 DenotationSpan を作る
4.  選択を解除する
5.  StyleSpan 上で mousedown して、親 DenotationSpan 上で mouseup する
6.  親 DenotationSpan が縮む

## Google Chrome でアノテーション読込ダイアログの`ファイルを選択`ボタンが見きれないこと

### 背景

1.  行の高さが足りず、`ファイルを選択`ボタンの下ボーダーが表示されていませんでした
2.  6.3.26 で対応

### -- 手段 --

1.  Google Chrome で Editor を開く
2.  アノテーション読込ダイアログを表示
3.  `ファイルを選択`ボタンの下ボーダーまで表示されていること

## StyleSpan 上で mousedown して、StypleSpan 上で mouseup して DenotationSpan をつくる

### 背景

1.  6.1.58 で StyleSpan 上で mousedown して、StypleSpan 上で mouseup したときに DenotationSpan を作れるようにしました。
2.  6.1.59 で DenotationSpan を作れない場合に、テキストの選択を解除するようにしました。

### テキスト上の StyleSpan と StyleSpan

1.  Editor1 を選択
2.  Term モードにする
3.  既存の Span を消してテキスト上に 2 つの StyleSpan を並べる
4.  StyleSpan 上で mousedown して、StypleSpan 上で mouseup する
5.  DenotationSpan が作成されること

### 一つの DenotationSpan 上の StyleSpan と StyleSpan

1.  Editor1 を選択
2.  Term モードにする
3.  既存の DenotationSpan をいい感じに編集して、一つの DenotationSpan の上に 2 つの StyleSpan を並べる
4.  StyleSpan 上で mousedown して、StypleSpan 上で mouseup する
5.  DenotationSpan が作成されること

### 片方が DenotationSpan 上の StyleSpan と StyleSpan

1.  Editor1 を選択
2.  Term モードにする
3.  既存の DenotationSpan をいい感じに編集して、一つを DenotationSpan の上の StyleSpan、一つをテキスト上の StyleSpan にする
4.  StyleSpan 上で mousedown して、StypleSpan 上で mouseup する
5.  DenotationSpan が作成されないこと
6.  テキストの選択が解除されること

## DenotationSpan の編集制限

### 背景

1.  v4.4.0 から、DenotationSpan の端から DenotationSpan の内側へテキストを選択した時に、DenotationSpan を縮める
2.  6.1.59 で兄弟 DenotationSpan の間で DenotationSpan を作れない場合に、テキストの選択を解除するようにしました。
3.  6.1.59 で祖父-孫 DenotationSpan の間で DenotationSpan を縮めらない場合に、テキストの選択を解除するようにしました。
4.  6.1.59 でテキスト-子孫 DenotationSpan の間で DenotationSpan を縮めらない場合に、テキストの選択を解除するようにしました。

### 兄弟 DenotationSpan の間で DenotationSpan を作れない

1.  DenotationSpan で mousedown し、兄弟 DenotationSpan で mouseup する
2.  テキストの選択が解除されること

### 祖父 DenotationSpan を孫 DenotationSpan まで縮められない

1.  祖父 DenotationSpan で mousedowen し、孫 DenotationSpan で mouseup する
2.  テキストの選択が解除されること

### テキストから親 DenotationSpan を超えて子 DenotationSpan まで縮められない

1.  テキストで mousedowen し、子 DenotationSpan で mouseup する
2.  テキストの選択が解除されること

### 子 DenotationSpan を親 DenotationSpan の外までのばせない

1.  子 DenotationSpan を親 DenotationSpan の外までのばす
2.  テキストの選択が解除されること

### 子 DenotationSpan を選択して親 DenotationSpan の外までのばせない

1.  子 DenotationSpan を選択する
2.  子 DenotationSpan を親 DenotationSpan の外までのばす
3.  alert が表示されること
4.  テキストの選択が解除されること

### 親 DenotationSpan を子 DenotationSpan をかぶって縮められない

1.  子が複数単語の親子 DenotationSpan を作る
2.  選択を解除する
3.  親 DenotationSpan の外のテキストで mousedown して、子 DenotationSpan の単語の途中で mouseup する
4.  テキストの選択が解除されること

### 親を選択して、子をかぶって縮められない

1.  子が複数単語の親子 DenotationSpan を作る
2.  親 DenotationSpan を選択する
3.  親 DenotationSpan を子 DenotationSpan の単語の途中まで縮める
4.  alert が表示されること

### 重複した DenotationSpanSpan は作れない

1.  DenotationSpanSpan を選択する
2.  DenotationSpanSpan になっている単語全体を選択する
3.  DenotationSpanSpan が削除されること

## StyleSpan 上で mouseup して、DenotationSpan を縮める

### 背景

1.  6.1.36 からテキスト上で mousedown に対応
2.  6.1.37 から DenotationSpan 上で mousedown に対応
3.  6.1.38 で親子 DenotationSpan の子 DenotationSpan で mousedown して、親 DenotationSpan 内の StyleSpan 上で mouseup すると、親 span がちぢむ現象に対応
4.  6.1.55 で、縮めたときに、意図せずに新しい Span ができる現象に対応

### テキスト上で mousedown して、StyleSpan 上で mouseup して、Span を縮める

#### `Boundary Detection` 有効

1.  Editor1 を選択
2.  `Boundary Detection`ボタンを押下状態にする
3.  StyleSpan を含む DenotationSpan を作成する
4.  DenotationSpan の外側のテキスト上で mousedown し、DenotationSpan 内の StyleSpan 上で mouseup する
5.  DenotationSpan が縮まること
6.  新しい DenotationSpan ができないこと

#### `Boundary Detection` 無効

1.  Editor1 を選択
2.  `Boundary Detection`ボタンを押上状態にする
3.  StyleSpan を含む DenotationSpan を作成する
4.  DenotationSpan の外側のテキスト上で mousedown し、DenotationSpan 内の StyleSpan 上で mouseup する
5.  アラートが表示され、Span が縮まらないこと

### DenotationSpan 上で mousedown して、StyleSpan 上で mouseup して、Span を縮める

#### `Boundary Detection` 有効

1.  Editor1 を選択
2.  `Boundary Detection`ボタンを押下状態にする
3.  StyleSpan を含む DenotationSpan を作成する
4.  上の DenotationSpan に親 DenotationSpan を作る
5.  親 DenotationSpan を選択解除する
6.  親 DenotationSpan 上で mousedown し、DenotationSpan 内の StyleSpan 上で mouseup する
7.  DenotationSpan が縮まること

#### `Boundary Detection` 無効

1.  Editor1 を選択
2.  `Boundary Detection`ボタンを押上状態にする
3.  StyleSpan を含む DenotationSpan を作成する
4.  上の DenotationSpan に親 DenotationSpan を作る
5.  親 DenotationSpan を選択解除する
6.  親 DenotationSpan 上で mousedown し、DenotationSpan 内の StyleSpan 上で mouseup する
7.  アラートが表示され、DenotationSpan が縮まらないこと

## StyleSpan 上で mouseup して、Span を伸ばす

### 背景

1.  6.1.38 で親子 DenotationSpan の子 DenotationSpan で mousedown して、親 DenotationSpan 内の StyleSpan 上で mouseup すると、親 span がちぢむ現象に対応

### Span 上で mousedown して、StyleSpan 上で mouseup して、Span を伸ばす

#### `Boundary Detection` 有効

1.  Editor1 を選択
2.  `Boundary Detection`ボタンを押下状態にする
3.  StyleSpan の隣に DenotationSpan を作成する
4.  上の StyleSpan と DenotationSpan 両方を含む親 DenotationSpan を作る
5.  DenotationSpan 上で mousedown し、StyleSpan 上で mouseup して、DenotationSpan を伸ばす
6.  DenotationSpan が伸びること

#### `Boundary Detection` 無効

1.  Editor1 を選択
2.  `Boundary Detection`ボタンを押下状態にする
3.  StyleSpan の隣に DenotationSpan を作成する
4.  上の StyleSpan と DenotationSpan 両方を含む親 DenotationSpan を作る
5.  DenotationSpan 上で mousedown し、StyleSpan 上で mouseup して、DenotationSpan を伸ばす
6.  アラートが表示され、Span が伸びないこと

## Term モードで DenotationSpan 上で mousedown して StyleSpan 上で mouseup してエラーが起きない

### 背景

1.  6.2.43 で発生
2.  6.3.20 で対応

### -- 手段 --

1.  Editor1 を選択
2.  Term モードにする
3.  DenotationSpan 上で mousedown して、StypleSpan 上で mouseup する
4.  エラーが起きないこと

## Term モードでテキスト上で mousedown して StyleSpan 上で mouseup してエラーが起きない

### 背景

1.  6.2.43 で発生
2.  6.3.19 で対応

### -- 手段 --

1.  Editor1 を選択
2.  Term モードにする
3.  テキスト上で mousedown して、右方向の、StypleSpan 上で mouseup する
4.  エラーが起きないこと
5.  テキスト上で mousedown して、左方向の、StypleSpan 上で mouseup する
6.  エラーが起きないこと

## Term モードで BlockSpan 上で mousedown して StyleSpan 上で mouseup してエラーが起きない

### 背景

1.  6.2.0 で関数名を Typo して発生
2.  6.3.18 で対応

### -- 手段 --

1.  Editor1 を選択
2.  Block モードにする
3.  StyleSpan の隣に BlockSpan を作成する
4.  Term モードにする
5.  BlockSpan 中のテキスト上で mousedown して、StypleSpan 上で mouseup する
6.  エラーが起きないこと

## 既存の要素を消す

### メイン

1.  Relation モードにする
2.  Relation を消す
3.  Entity を消す
4.  Term モードにする
5.  Span を消す
6.  Relation のある Span を消す
7.  Relation のある Entity を消す
8.  全て戻す
9.  選択されないこと
10. やり直す
11. 全て戻してからやり直すのを 4 回繰り返す

## ブロックを縮める

### 背景

1.  6.3.11 で対応
2.  6.3.13 で、BlockSpan の中の DenotationSpan と StyleSpan 上でのマウスアップに対応
3.  BlockSpan の先頭の文字列を選択したときは、BlockSpan のマウスダウンイベントが発生します。このとき縮めるために、単一 BlockSpan 内の文字列選択時に縮小しています。
4.  単一の BlockSpan 内の*途中の文字列*を選択したときは、BlockSpan が縮む動作に違和感がありました。
5.  6.3.15 で、単一の BlockSpan 内の文字列を選択したとき、BlockSpan の端の文字から選択したときだけ縮むようにしました。
6.  6.3.16 で、単一の BlockSpan 内の文字列を選択し縮まなかったときに、選択中の文字列を選択解除するようにしました。

### BlockSpan の端から縮める

1.  Block モードにする
2.  2 語以上の BlockSpan を作成する
3.  BlockSpan 中の文字列を先頭から 1 文字以上開けて選択する
4.  BlockSpan が縮まらないこと
5.  文字列が選択解除されること
6.  BlockSpan 中の文字列を先頭の文字を含んで選択する
7.  BlockSpan が縮むこと
8.  BlockSpan 中の文字列を末尾から 1 文字以上開けて選択する
9.  BlockSpan が縮まらないこと
10. 文字列が選択解除されること
11. BlockSpan 中の文字列を末尾の文字を含んで選択する
12. BlockSpan が縮むこと

### BlockSpan の外から縮める

1.  Editor1 を選択
2.  Block モードにする
3.  DenotationSpan と StyleSpan を含む BlockSpan を作成する
4.  BlockSpan の外から BlockSpan の中に文字列を選択するとき、次の組み合わせで BlockSpan が縮むこと
    1.  BlockSpan 外のテキストから、BlockSpan 中のテキスト
    2.  BlockSpan 外のテキストから、BlockSpan 中の DenotationSpan 中のテキスト
    3.  BlockSpan 外のテキストから、BlockSpan 中の StyleSpan 中のテキスト
    4.  BlockSpan 外の DenotationSpan 中のテキストから、BlockSpan 中のテキスト
    5.  BlockSpan 外の StyleSpan 中のテキストから、BlockSpan 中のテキスト
    6.  BlockSpan 外のテキストから、BlockSpan 中の DenotationSpan 中のテキスト
    7.  BlockSpan 外のテキストから、BlockSpan 中の StyleSpan 中のテキスト

## コントロールバー

### control 属性

#### 背景

1.  4.5.0 から html 上の control 属性でコントロールバーを表示・非表示を設定できるようになりました

#### -- 手段 --

1.  control 属性が`visible`の Editor は選択しなくてもコントロールバーが表示されていること（editor2）
2.  control 属性が`hidden`の Editor を選択してもコントロールバーが表示されないこと（editor3）

### Editor 毎に表示

#### 背景

1.  4.4.3 まで複数 Editor があってもコントロールバーを一つ表示していました
2.  4.5.0 からコントロールバーは Editor 毎に表示します

#### -- 手段 --

1.  各 Editor の最上部にコントロールバーが表示されないこと
2.  編集可能な Editor を選択する（editor1）
3.  Editor の上部にコントロールバーが表示されること
4.  View モードにする
5.  コントロールバーが表示されたままであること

### Editor の幅に合わせて折り返し

#### 背景

1.  コントロールバーは Editor の幅に合わせて、折り返してアイコンを表示します
2.  コントロールバーの高さが固定であったため、2 段目以降はにアイコンだけが表示されていました
3.  4.5.1 からコンロトールバーの高さも調整します

#### -- 手段 --

1.  ウインドウの幅をコントロールバーより短くする
2.  アイコンが 2 段以上に折り返されて表示されること
3.  アイコンの高さに合わせて、コントロールバーの高さが伸びること

### TextAE

1.  TextAE をクリックすると新しいタブで`http://textae.pubannotation.org/`が開くこと

## Entity パレットのタイトルを折り返さない

### 背景

1.  Attribute 定義がたくさんあるとき、EntityPallet のタイトルが折り返していました。
2.  6.3.12 でタイトルに最低幅を設定しました。

### -- 手段 --

1.  Editor1 を選択
2.  Term モードにする
3.  `Q`キーを押して、EntityPallet を開く
4.  左上のタイトル`Entity Configuration`が折り返さないこと

## ブロックを伸ばす

### 背景

1.  6.3.9 で対応
2.  6.3.10 で、DenotationSpan と StyleSpan 上でのマウスアップに対応

### -- 手段 --

1.  Editor1 を選択
2.  Block モードにする
3.  DenotationSpan と StyleSpan を含む BlockSpan を作成する
4.  BlockSpan 中のテキストから、BlockSpan 外の DenotationSpan 中のテキストを選択
5.  BlockSpan が伸びること
6.  BlockSpan 中のテキストから、BlockSpan 外の StyleSpan 中のテキストを選択
7.  BlockSpan が伸びること
8.  BlockSpan 中のテキストから、BlockSpan 外のテキストを選択
9.  BlockSpan が伸びること
10. BlockSpan 中の DenotationSpan 中のテキストから、BlockSpan 外のテキストを選択
11. BlockSpan が伸びること
12. BlockSpan 中の StyleSpan 中のテキストから、BlockSpan 外のテキストを選択
13. BlockSpan が伸びること

## Type 定義編集を annotation ファイルに保存

### 背景

1.  6.2.0 からブロック機能を追加

### DenotationEntity

1.  Editor1 を選択
2.  Term モードにする
3.  DenotationEntity を選択する
4.  `Change Label[W]`ボタンを押す
5.  既存の Value を消す
6.  `pro`を入力
7.  `production company@http://dbpedia.org/ontology/productionCompany`を選択
8.  OK ボタンを押す
9.  `Upload [U]`ボタンを押す
10. `Click to see the json source in a new window.`をクリック
11. `config.Entity Types`に`{"id":"http://dbpedia.org/ontology/productionCompany","label":"production company"}`が含まれていること

### BlockEntity

1.  Editor1 を選択
2.  Block モードにする
3.  BlockEntity を選択する
4.  `Change Label[W]`ボタンを押す
5.  既存の Value を消す
6.  `pro`を入力
7.  `productionCompany@http://dbpedia.org/ontology/productionCompany`を選択
8.  OK ボタンを押す
9.  `Upload [U]`ボタンを押す
10. `Click to see the json source in a new window.`をクリック
11. `config.Relation Types`に`{"id":"http://dbpedia.org/ontology/productionCompany","label":"productionCompany"}`が含まれていること

### Relation

1.  Editor1 を選択
2.  Relation モードにする
3.  Relation を選択する
4.  `Change Label[W]`ボタンを押す
5.  既存の Value を消す
6.  `pro`を入力
7.  `productionCompany@http://dbpedia.org/ontology/productionCompany`を選択
8.  OK ボタンを押す
9.  `Upload [U]`ボタンを押す
10. `Click to see the json source in a new window.`をクリック
11. `config.Relation Types`に`{"id":"http://dbpedia.org/ontology/productionCompany","label":"productionCompany"}`が含まれていること

## BlockSpan は親 Span を持たない

### 背景

1.  BlockSpan はなんらかの Span の子になることはありません。Block モードで、他の Span の子 BlockSpan を作成できていました。
2.  6.3.7 で対応しました

### -- 手段 --

1.  Term モードにする
2.  複数単語の DenotationSpan を作成する
3.  Block モードにする
4.  作成した DenotationSpan 中の 1 単語を選択する
5.  BlockSpan が作られないこと
6.  文字列の選択が解除されること

## 連続した空白の扱い

### 背景

1.  5.0.0 アノテーションテキスト中の連続した空白をまとめずに描画しています。
2.  Span をつくると、Span 内では連続した空白をまとめていました。
3.  6.1.1 で対応しました。

### -- 手段 --

1.  editor9 を選択
2.  `stomach ache`を Span にする
3.  単語の間の連続した空白がまとまらないこと

## annotation なし

### 背景

1.  開発中は annotation なしで開きません。エラーの見落としが多いです。
2.  `4.4.0`から、annotation がない時はデフォルト文字列を表示します。
3.  `4.5.0`から、html 属性で`mode="edit"`をつけない場合は View モードになり、View モードの場合はコントロールバーを表示しなくしました。

### Edit モード

1.  Editor7 を選択
2.  Editor 中に`Currently, the document is empty. Use the "import" button or press the key "i" to open a document with annotation.`が表示されること
3.  エディタを選択するとコントロールバーが表示されること

## inline で連続した空白を含む annotation を開けること

### 背景

1.  inline の annotation の text に、連続した空白が含まれていた場合、埋め込んだ時点で、１つの空白にまとめられていた
2.  annotation の texte に、連続した空白が含まれていた場合、Editor 上に表示する文字列ので、１つの空白にまとめられていた
3.  `textae-editor`クラスと、`textae-editor__body__text-box__paragraph-margin`クラスに、`white-space: pre`スタイルを指定が必要
4.  v4.5.7 で対応

### -- 手段 --

1.  editor9 を選択
2.  `stomach`の Span がズレていないこと

## アノテーション保存時にメッセージを alertify.js で表示

### 背景

1.  ステータスバーにメッセージを表示していました。
2.  Editor が大きいと隠れていた
3.  トーストを使って表示します

### -- 手段 --

1.  annotation を保存する
2.  右上に`annotation saved`と緑色のトースト表示がされること
3.  サーバを落とす
4.  サーバに annotation を保存する
5.  右上に`could not save`と赤色のトースト表示がされること

## shift を押して Span を選択

### コピー

1.  Term モードにする
2.  shift で複数の Span をえらぶ
3.  コピーする
4.  貼り付けする
5.  選択してる Span の全ての Entity がコピーされること

### 削除

1.  Term モードにする
2.  shift で複数の Span をえらぶ
3.  削除する
4.  選択してる Span が全て削除されること

## 先頭の Span を後ろから縮めて消したときにエラーが起きない

### 背景

1.  6.1.53 で、追加した必須パラメータのアサーションに 0 も引っかかって発生
2.  6.3.3 で対応

### -- 手段 --

1.  Editor0 を選択
2.  最初の Span を後ろから縮めて消す
3.  エラーが起きないこと

## ワイルドカードありの type を追加したときに、既存の Entity と Relation に設定が反映されること

### 背景

1.  5.0.0 から type 定義にはワイルドカード`*`を導入しました。
2.  id がワイルドカード`*`で終わる Type の color と label は、id が前方一致する type に反映されます。
3.  一致した type 定義が color と label を持つ場合は、それが優先されます。
4.  Type 定義を更新しても、Span を移動するなどして再レンダリングされるまで、既存の Entity の色に反映されませんでした。
5.  5.0.2 で修正
6.  5.2.0 で動かなくなりました
7.  6.1.0 で修正。Relation にも対応
8.  6.2.71 で Block モードでパレットが開けるようになりました

### -- 手段 --

#### DenotationEntity

1.  Editor1 を選択
2.  Term モードにする
3.  `Select Label [Q]`ボタンをクリックする
4.  `Add new type`ボタンをクリックする
5.  `Id`欄に`http*`を入力する
6.  `Color`欄を変更する
7.  `OK`ボタンを押す
8.  既存の DenotationEntity の色が変わること

#### BlockEntity

1.  Editor1 を選択
2.  Block モードにする
3.  `Select Label [Q]`ボタンをクリックする
4.  `Add new type`ボタンをクリックする
5.  `Id`欄に`block*`を入力する
6.  `Color`欄を変更する
7.  `OK`ボタンを押す
8.  既存の DenotationEntity の色が変わること

#### Relation

1.  Editor1 を選択
2.  Relation モードにする
3.  `Select Label [Q]`ボタンをクリックする
4.  `Add new type`ボタンをクリックする
5.  `Id`欄に`http*`を入力する
6.  `Color`欄を変更する
7.  `OK`ボタンを押す
8.  既存の Relation の色が変わること

## namespace

### 背景

1.  4.1.11 から`annotations.json`に namespace を書けるようになりました。
2.  prefix が`_base`だと http で始まらない全ての Type に反映されます
3.  uri で指定した値と Type が結合して、uri になります
4.  prefix が`_http`以外は prefix と一致した部分が置きかわります
5.  5.0.5 で selection attribute と string attribute にも namespace を適用しました。
6.  6.1.13 で、`annotations.json`上の namespace を一つしか読み込めなくなっていました。6.2.5 で修正しました。

### -- 手段 --

1.  View モードで`prefix.json`を開く
2.  最初の DenotationSpan の Type が pubannotation.org へのリンクになっていること
3.  最初の DenotationSpan の Attribute が pubannotation.org へのリンクになっていること
4.  第二の DenotationSpan の Type が「google で protein を検索した結果画面」へのリンクになっていること
5.  第二の DenotationSpan の Attribute が「google で protein を検索した結果画面」へのリンクになっていること
6.  第三の DenotationSpan の Type が abc.com へのリンクになっていること
7.  第三の DenotationSpan の Attribute が abc.com へのリンクになっていること

### namespace を更新しない

1.  アノテーション保存ダイアログを開く
2.  ソースを表示する
3.  namespace に id を追加していないこと

## ブロックモード

### 背景

1.  6.2.0 からブロック機能を追加
2.  ブロックを表現するためにテキスト上に装飾を配置すると、ブロック内のテキスト操作ができません。
3.  BlockSpan を伸ばす、縮める操作が、DenotationSpan と統一できません。
4.  6.3.0 からブロックの表現を、BlockSpan の右側に箱を配置することにしました。

### -- 手段 --

1.  コントロールバーに B アイコンがあること
2.  B アイコンを押す
3.  Block モードになること
4.  エディタの背景が紫色になること
5.  テキストを選択する
6.  新しく BlockSpan が作られること
7.  作られた BlockSpan の背景がオレンジ色（選択中）であること
8.  BlockSpan の上下に点線ボーダーが表示されること
9.  BlockSpan の右側に紫色の領域があること
10. BlockSpan の右側の領域に BlockEntity が表示されていること
11. テキストをクリックする
12. BlockSpan の背景色がなくなる（選択解除される）こと
13. BlockSpan の右側に紫色の領域をクリックする
14. BlockSpan の背景がオレンジ色（選択中）になること
15. 削除ボタンをクリックする
16. 選択中の BlockSpan が削除されること
17. 戻せること

### ブロック作成

#### 背景

1.  6.2.26 でブロックにボーダーを追加
2.  6.2.31 でブロックとテキストの間に左右 8 ピクセルの隙間を開けました
3.  6.2.50 で BlockEntity の右に隙間をあけました
4.  BlockSpan の表示位置を半行上に見せかけるために、BlockSpan は背景とヒットエリアを別に持っています
5.  Block モードではヒットエリアの z-index を加算するため、BlockSpan 自体をマウスオーバーできません。
6.  ヒットエリアに title 属性を設定していなかったため、ブロックモード中に BlockSpan をホバーしたときに、Span ID が表示されませんでした
7.  6.2.101 で対応しました
8.  6.3.0 からブロックの表現を、BlockSpan の右側に箱を配置することにしました。

#### -- 手段 --

1.  Editor1 を選択
2.  BlockSpan の背景が透明であること
3.  BlockSpan の上下にボーダーがあること
4.  BlockSpan とテキストの間に隙間があること
5.  BlockEntity の右に隙間があること

## 改行をまたいで Span を作成できる

### 背景

1.  テキスト中の改行をレンダリングするために、テキストを改行単位で区切って p タグ（パラグラフ）内に描画していました
2.  p タグをまたいで span を作れないため、パラグラフをまたいだ span の作成を禁止していました
3.  span が作成できないことをわかりやすくするために、パラグラフをまたいでテキストを選択したときにアラートを表示していました
4.  5.0.0 で、コンテキストメニューの右クリックで Span を作成しないようにするために、click イベントの代わりに mouseup イベントを監視するようにしたところアラート表示がされなくなっていました。
5.  5.2.8 で、パラグラフのみ click イベントを監視して、アラートを表示できるように戻しました。
6.  5.2.8 で、アラート表示がテキスト選択解除のあとになるようにスリープを入れました。
7.  6.0.0 でテキスト中の改行のレンダリングをパラグラフから、css の`white-space: pre-wrap;`に変更しました

### -- 手段 --

1.  Editor1 を選択
2.  改行をまたいでテキストを選択する
3.  Span が作成できること

## 長い文字列を含むアノテーションを開く

### 背景

1.  Google chrome と Safari は 65536 文字以上のテキストを複数の text node に分割します。
2.  span の開始位置の offset が text node の範囲を越えることがあります。
3.  text node の中に span をつくる場所が見つからずエラーになっていました。
4.  6.0.4 で対応しました。

### 手段

1.  <http://pubannotation.org/projects/Genomics_Informatics/docs/sourcedb/@ewha-bio/sourceid/365/annotations.json> を読み込む
2.  エラーが起きないこと

## Relation の編集

### 背景

1.  6.0.0 で Modification を廃止しました。

### 作る、変える、消す

1.  Span を２つ作る
2.  Relation モードにする
3.  Relation を作る
4.  作った Relation が選択される
5.  Relation の Value を変更する
6.  Relation の線が細くならないこと
7.  作った Relation を消す
8.  Entity を片方消す
9.  Span が残っていたら Span を消す（Span の Entity がゼロ個になると、Span は自動的に削除されます）
10. 全て戻す

## コンフィグレーション保存の Diff

### 背景

1.  5.0.0 でコンフィグレーションの保存機能を追加しました
2.  6.1.6 で コンフィグレーション保存ダイアログの高さ制限をなくして、Diff の表示領域の縦スクロールバーの表示をやめました
3.  6.1.6 で Diff から変更のない項目を非表示にしました
4.  6.1.6 でリストの順序を変更したときに、移動を検知して Diff の量を小さくしました。

### -- 手段 --

1.  editor1 を選択
2.  `Select Label [Q]`ボタンをクリックする
3.  Type 定義を編集する
4.  コンフィグレーション保存ダイアログを開く
5.  `Configuration differences`に diff が表示されること
6.  diff 表示領域に縦スクロールバーが表示されないこと
7.  変更のない Entity の定義が Diff に表示されていないこと
8.  Download ボタンを押して保存する
9.  DenotationEntity の Protein の id を変更する
10. コンフィグレーション保存ダイアログを開く
11. diff に Entity Protein の変更のみ表示されていること

## 連続した BlockSpan の間に空行が挟まらない

### 背景

1.  6.2.0 で Block モードを追加しました
2.  BlockSpan を div で表現しているため、div 間に改行が挟まれ、1 行余計に隙間が空いていました
3.  6.2.114 で、BlockSpan に`display: inline-block`と`width: 100px`を指定して、改行しつつ、余計な空行は挟まらないようにしました

### -- 手段 --

1.  Editor1 を選択
2.  `block1`と`block2`の間に隙間がないこと

## 別の annotatian を開いて高さが再計算されること

### 背景

1.  annotation によって行数が変わるので高さを再計算しなくてはいけません。

### -- 手段 --

1.  1_annotations.json を開く
2.  multi_tracks.json を開く
3.  高さが再計算されること
4.  下側の隙間が狭いこと

## パレットからのインスタンス選択

### 背景

1.  5.0.0 で Type の編集機能に、Type のインスタンスを選択する機能を追加しました
2.  6.2.0 からブロック機能を追加

### -- 手段 --

1.  Editor1 を選択
2.  Term モードにする
3.  `Select Label [Q]`ボタンをクリックする
4.  `Select all the cases of this type`ボタンをクリックする
5.  Type を持つ DenotationEntity がすべて選択されること
6.  Type に Attribute はあってもなくても選択されること
7.  Block モードにする
8.  `Select Label [Q]`ボタンをクリックする
9.  `Select all the cases of this type`ボタンをクリックする
10. Type を持つ BlockEntity がすべて選択されること
11. Type に Attribute はあってもなくても選択されること
12. Relation モードにする
13. `Select Label [Q]`ボタンをクリックする
14. `Select all the cases of this type`ボタンをクリックする
15. Type を持つ Relation がすべて選択されること

## BlockSpan にはひとつの BlockEntity しか追加できない

### 背景

1.  6.2.110 で、BlockSpan にはひとつの BlockEntity しか追加できなくしました

### -- 手順 --

1.  Editor1 を選択
2.  Block モードにする
3.  BlockSpan を選択
4.  `E`キーを押す
5.  BlockEntity が追加されないこと

## 未保存変更があるときに、別のアノテーションを読み込もうとすると確認ダイアログを表示

### 背景

1.  保存していない変更があるか状態を持っています
2.  変更があるときに load しようとすると確認ダイアログを表示します
3.  一度保存すると変更状態をリセットします
4.  確認ダイアログを表示しなくなります

### -- 手段 --

1.  変更する
2.  読込む
3.  確認ダイアログが出る
4.  キャンセルする
5.  保存する
6.  読込む
7.  保存する
8.  前回の保存内容と差があること

## Relation の曲率設定に Entity の位置が必要

### 背景

1.  Relation の移動時に Relation のカーブの曲率を修正しています
2.  Relation のカーブは Entity の位置から決めます
3.  Relation 描画開始前に Entity を削除するとエラーが起きます
4.  Undo/Redo 時は一連の処理が終わるまで Relation のレンダリングをスキップしています
5.  Entity の位置はキャッシュした Grid の位置から求めています
6.  5.0.0 の開発中、span の移動時に Grid の位置をキャッシュから削除したら、キャッシュ削除と Relation 移動が入れ違い、Grid の位置が取れずにエラーが発生しました

### -- 手段 --

1.  Term モードにする
2.  Relation のある Span を 4 回サイズ変更する
3.  z4 回,y ４回を繰り返す

## DOM の id から`:`または`.`を削除

### 背景

1.  annotation.json の id から Entity の DOM の id を生成している
2.  id に`:`または`.`が含まれていると、擬似クラス、クラスセレクタと見なされ id として指定できなくなる
3.  4.1.14 で対応しました。
4.  DOM の id から id の`:`または`.`を削除します。

### -- 手段 --

1.  Editor1 を開く
2.  `null`の Entity をクリックできること
3.  `null`の Entity の DOM 要素の`id`属性が`editor0__EE1ab`であること
4.  `null`の Entity の DOM 要素の`title`属性が`E1:a:b`であること
5.  `parent`の Entity をクリックできること
6.  `parent`の Entity の DOM 要素の`id`属性が`editor0__ET1ab`であること
7.  `parent`の Entity の DOM 要素の`title`属性が`T1.a.b`であること

## 特殊な Type 文字列

### ドメインな文字列

#### 背景

1.  Type の Value に url を指定した場合は短縮してラベルに表示します
2.  Type が`http://pubmed.org/`のときにディレクトリ名を取得しようとして空文字を取得していた
3.  ラベルが空だと正しくレンダリングできません
4.  4.1.8 で対応しました

#### -- 手段 --

1.  Editor1 を選択
2.  Type `http://pubmed.org/`の表示が`pubmed.org`になること

### ドメインが localhost

1.  既存の Entity を選択する
2.  Type の Value を`http://localhost:8000/abc`に変更する
3.  Type の表示が abc になること

### http で始まる URL ではない文字列

1.  既存の Entity を選択する
2.  Type の Value を`http://hoge`に変更する
3.  Type の表示が`http://hoge`になること

## Span は必ず Entity を持つ

### Entity を自動作成

#### 背景

1.  4.1.8 で Entity につける id の prefix を`E`から`T`に変えました
2.  6.2.0 からブロック機能を追加

#### -- 手段 --

1.  Term モードにする
2.  DenotationSpan を作成する
3.  default の Type の Entity ができること
4.  Entity の id が`T`で始まること
5.  Block モードにする
6.  BlockSpan を作成する
7.  default の Type の Entity ができること
8.  Entity の id が`T`で始まること

## 重複してコピーしない

1.  Span とその Entity を選択してコピーする
2.  貼付けたときに重複しないこと

## コピーした Entity を削除してから貼付ける

1.  Entity を選択する
2.  コピーする
3.  削除する
4.  別の Span を選択する
5.  貼付ける

## 起動直後

### 背景

1.  `4.4.0`からデフォルト文字列を表示します
2.  annotation がない場合も、Editor はサイズがありクリックできます
3.  起動時に一番上の Editor を選択する機能を消します

### -- 手段 --

1.  Editor7 が選択されていないこと（背景色が白い）
2.  Editor7 をクリック
3.  Editor7 が選択されること（背景色がベージュ）

## 外部 JavaScript で Editor を初期フォーカスできること

1.  <http://localhost:8000/dist/editor.html> を開く
2.  Editor1 が選択されていること（背景色がベージュ）

## タイプ変更を Undo したとき、変更対象を選択しない

### 背景

1.  6.2.0 からブロック機能を追加

### DenotationEntity

1.  Term モードにする
2.  タイプを変更する
3.  戻す
4.  選択されないこと

### BlockEntity

1.  Block モードにする
2.  タイプを変更する
3.  戻す
4.  選択されないこと

### Relation

1.  Relation モードにする
2.  タイプを変更する
3.  戻す
4.  選択されないこと

## リサイズすると Grid を移動する

### 背景

1.  4.1.10 の修正中に、リサイズしても、二段目より上の Type が横に移動するだけで縦に移動しなくなりました。
2.  4.4.3 の修正中に、Grid だけ移動して、Relation が移動しなくなりました

### -- 手段 --

1.  ウインドウをリサイズする
2.  Grid が Span に追従して移動すること
3.  Relation が Grid に追従して移動すること

### Relation を選択してリサイズする

1.  Relation モードにする
2.  Relation を選択
3.  リサイズして選択した Relation を移動する
4.  矢印が小さくならないこと
5.  ホバーしても、線が細くならないこと

## コピー&ペースト

### 背景

1.  6.0.0 で Modification を廃止しました。
2.  6.1.1 で一つの denotation を一つのエンティティに表示することしました。

### span

1.  Span を選択してコピーする
2.  他の Span を選択して貼り付ける
3.  選択した Span の全ての Entity と Attribute が、対象 Span に張り付く
4.  Relation はコピーされない

### Entity

1.  Entity を選択してコピーする
2.  他の Span を選択して貼り付ける
3.  選択した全ての Entity とその Attribute、対象 Span に張り付く
4.  Relation はコピーされない

## ホバー

### 背景

1.  6.0.0 で Modification を廃止しました
2.  6.1.49 Entity のインスタンスだけでなく、ラベルをホバーしたときも Relation を強調するようにしました
3.  6.2.28 で Entity のエンドポイントの表示をやめました
4.  6.2.85 で Term モードで、Relation が強調されなくなっていました
5.  6.2.101 で対応しました

### 連動

1.  Entity のラベルをホバーすると Relation も強調する
2.  Relation のラベルをホバーすると Relation も強調する

### ホバー時の見た目の変化

1.  Entity のラベルの div にシャドウ
2.  Relation はラベルのテキストにシャドウ

## Block 要素の div をクリックしたら選択解除する

### 背景

1.  BlockSpan は div としてレンダリングしています
2.  BlockSpan の表示位置を半行上に見せかけるために、BlockSpan は背景とヒットエリアを別に持っています
3.  BlockSpan 自体のマウスクリックイベントをハンドリングしていなかったため、BlockSpan の背景のすぐ下をクリックしたときに選択解除していませんでした。
4.  6.2.39 で対応しました

### -- 手段 --

1.  Term モードにする
2.  Span を選択する
3.  Block のすぐ下をクリックする
4.  Span が選択解除されること
5.  Block モードにする
6.  BlockSpan を選択する
7.  BlockSpan のすぐ下をクリックする
8.  BlockSpan が選択解除されること
9.  Relation モードにする
10. Relation を選択する
11. BlockSpan のすぐ下をクリックする
12. Relation が選択解除されること

## 選択中の BlockSpan で DenotationEntity を隠さない

### 背景

1.  6.2.0 からブロック機能を追加
2.  ブロックスパンの位置を、実際の div 要素の位置より半行上に見せかけるために、背景用の div を追加しています
3.  ブロックモードでは、ブロックをクリックできるように、背景用 div の z-index を加算していました
4.  背景用 div に選択中のスタイルを適用したときに DenotationEntity を隠していました
5.  6.2.37 で、背景用 div と別にマウス操作用の div を追加して、対応しました。

### -- 手段 --

1.  DenotationSpan の親になる BlockSpan を作成する
2.  DenotationEntity の色が変わらないこと

## ブロックを含むアノテーションを読み込んだあとに他のあとにを読み込めること

### 背景

1.  アノテーションを読み込む際に、読み込み済みのブロック情報をクリアしていませんでした。
2.  読み込んだアノテーションと矛盾が生じてエラーが起きていました。
3.  6.2.4 で対応

#### -- 手段 --

1.  Editor1 を選択
2.  `prefix.json`を開く
3.  エラーが起きないこと

## アノテーションファイル中の BlockEntity 間の Attribute を読み込める

### 背景

1.  6.2.0 からブロック機能を追加
2.  アノテーションファイルに BlockEntity の Attribute を記述しても、Attribute の参照先として BlockEntity が見つからにためバリデーションエラーになっていました
3.  6.2.99 で対応しました。

### -- 手段 --

1.  Editor1 を選択
2.  Block1 に Attribute があること

## アノテーションファイル中の BlockEntity 間の Relation を読み込める

### 背景

1.  6.2.0 からブロック機能を追加
2.  アノテーションファイルに BlockEntity 間の Relation を記述しても、Relation の参照先として BlockEntity が見つからにためバリデーションエラーになっていました
3.  6.2.97 で対応しました。

### -- 手段 --

1.  Editor1 を選択
2.  BlockEntity の間に Relation があること

## Simple モードでの Entity 追加したらメッセージを alertify.js で表示しない

### 背景

1.  Simple モードでは Entity を追加しても反応がありません
2.  4.1.8 で追加時にトースト表示することにしました
3.  6.1.1 で一つの denotation を一つのエンティティに表示することしました。
4.  Entity の追加がみえるようになったのでトーストの表示をやめました。

### -- 手段 --

1.  Simple モードにする
2.  既存の Span を選択する
3.  `E`キーを連打する
4.  トーストメッセージが表示されないこと
5.  戻してやり直す
6.  トーストメッセージが表示されないこと

## 自動保存

### 背景

1.  6.0.0 で自動保存機能を追加しました。

### -- 手段 --

#### サーバーからアノテーションファイルを読み込んだとき自動保存機能が有効になること

1.  Editor5 を選択
2.  自動保存機能ボタンが無効であること
3.  URL から`1_annotations.json`を読み込む
4.  自動保存機能ボタンが有効になること

#### 自動保存機能を有効にしてアノテーションを編集すると、一定時間後保存されること

1.  Editor1 を選択
2.  自動保存機能ボタンを押下する
3.  アノテーションを編集する
4.  5 秒後に`annotation saved`とトースト表示されること

#### アノテーションファイルを読み込むと自動保存機能が停止になること

1.  Editor1 を選択
2.  自動保存機能ボタンを押下する
3.  アノテーションを読み込む
4.  自動保存機能ボタンの押下が戻っていること

#### 保存に失敗すると自動保存機能が停止になること

1.  Editor0 を選択
2.  自動保存機能ボタンを押下する
3.  アノテーションを編集する
4.  5 秒後に認証ダイアログが表示されたらキャンセルする
5.  `could not save`とトースト表示されること
6.  自動保存機能ボタンの押下が戻っていること

## 読み込んだアノテーションの denotations と blocks の ID 重複の検出

### 背景

1.  6.2.20 ID が重複した denotations 検出機能を追加しました
2.  6.2.21 で blocks のバリデーションを追加しました。
3.  6.2.93 で`Dupulicated`の typo を修正
4.  6.2.94 ID 重複用のテーブルを denotations と blocks で一つにまとめました
5.  6.2.95 で denotations と blocks の ID が重複している場合もチェックするようにしました。

### -- 手段 --

1.  invalid.json を読み込む
2.  `Duplicated IDs in Denotations and Blocks.`に`T2`がふたつと`B3`がふたつ表示されること
3.  `Duplicated IDs in Denotations and Blocks.`に`EB1`がふたつ表示されること

## 読み込んだアノテーションの denotations と blocks と typesettings の境界交差の検出

### 背景

1.  6.0.0 で typesettings を導入し、typesettings の境界交差を検出していました
2.  denotations と typesettings が境界交差した場合にエラーが起きていました
3.  6.1.7 で対応しました。
4.  6.2.16 でテーブル名を`Denotations or Typesettings with boundary-cross.`に変えました
5.  6.2.89 で境界交差の検査対象に blocks を追加しました

### -- 手段 --

1.  invalid.json を読み込む
2.  `Denotations or Blocks or Typesettings with boundary-cross.`に typesettings が表示されること
3.  `Denotations or Blocks or Typesettings with boundary-cross.`に denotations が表示されること
4.  `Denotations or Blocks or Typesettings with boundary-cross.`に blocks が表示されること
5.  `Denotations or Blocks or Typesettings with boundary-cross.`に typesettings と denotations が交差している`E21`が表示されること

## 読み込んだアノテーションの blocks に不正データが含まれていたら Validation Dialog に表示すること

### 背景

1.  6.2.21 で blocks のバリデーションを追加しました。
2.  blocks にバリデーションエラーがあるときにエラーにしていませんでした
3.  このため blocks だけにバリデーションエラーがあるときに Validation Dialog を表示していませんでした
4.  6.2.60 で対応
5.  Dupulicated range 検出ロジックが常に true を返すバグがありました
6.  6.2.20 の対応で、bloks を含む 1_annotation.json を読むと常に Validation Dialog を表示するようになりました。
7.  6.2.61 で対応
8.  6.2.93 で`Dupulicated`の typo を修正

### -- 手段 --

1.  Editor1 を選択
2.  Validation Dialog が表示されないこと
3.  invalid_blocks_only.json を読み込む
4.  Validation Dialog を表示すること
5.  `Wrong range blocks.`に`E1`が表示されること
6.  `Out of text blokcs.`に`E2`が表示されること
7.  `Duplicated range blocks.`に`E4`と`E5`が表示されること
8.  `Duplicated IDs in Denotations and Blocks.`に`E3`がふたつ表示されること

## 読み込んだアノテーションの denotations に不正データが含まれていたら Validation Dialog に表示すること

### 背景

1.  6.2.20 ID が重複した denotations 検出機能を追加しました
2.  6.2.93 で`Dupulicated`の typo を修正

### -- 手段 --

1.  invalid.json を読み込む
2.  Validation Dialog を表示すること
3.  `Wrong range denotations.`に `T1`と`E2`が表示されること
4.  `Out of text denotations.`に`begin` が `-2` で `end` が `15` の denotation と`E1`が表示されること

## ファイル読み込み時の認証情報入力

### 背景

1.  4.1.19 から Basic 認証付きの anntation.json の読み込みに対応しました。

### -- 手段 --

1.  <http://127.0.0.1:8000/dev/private.json> を読み込む
2.  認証ダイアログが開くこと
3.  ユーザーに`Jin-Dong Kim`、パスワードに`passpass`を設定してログインボタンを押す
4.  private.json を読み込めること
5.  一度認証に成功するとブラウザがユーザーとパスワードを記憶します。もう一度試す場合はブラウザを再起動すること

## Relation 描画は非同期

### 高速に Relation のある Span を削除して戻す

#### 背景

1.  Relation の移動時に Relation のカーブの曲率を修正しています
2.  Relation のカーブは Entity の位置から決めます
3.  Relation の移動が非同期です
4.  Relation を作ってから移動するまでの間に Entity が削除されることがある
5.  Relation は Model からは削除されない（？）
6.  removed フラグをチエックする必要があります

#### -- 手段 --

1.  Relation のある Span を削除する
2.  `z`と`y`をできる限り高速に連打する
3.  30 回、Undo/Redo を繰り返しても、エラーがでないこと

### 高速に Relation を作って Relation を作る

#### 背景

1.  Relation 描画は非同期です
2.  Relation を追加後、Relation 描画開始前にデータを削除するとエラーが起きます
3.  Undo/Redo 時は一連の処理が終わるまで Relation のレンダリングをスキップしています

#### -- 手段 --

1.  Relation を作る
2.  Relation を作る
3.  z, z, y, y を 10 回なるべく高速に繰り返す

## 隣の単語と単語の一部が Span になっているときに残りを Span にする

### Boundary Detection 有効時の動作

1.  Editor1 を選択
2.  隣の単語と単語の一部までが Span にする（例：`Promoter met`）
3.  単語の残りの部分を選択する（例：`hylation`）
4.  Span ができないこと
5.  テキストの選択が解除されること

### Boundary Detection 無効時の動作

1.  Editor5 を選択
2.  隣の単語と単語の一部までが Span にする（例：`Ribonucleic a`）
3.  単語の残りの部分を選択する（例：`cid`）
4.  Span ができること
