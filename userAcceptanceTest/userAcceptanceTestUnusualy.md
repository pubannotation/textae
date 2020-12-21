# たまにやるテスト

## TermモードでDenotationSpan上でmousedownしてStyleSpan上でmouseupしてエラーが起きない

### 背景

1.  6.2.43で発生
2.  6.3.20で対応

### -- 手段 --

1.  Editor1を選択
2.  Termモードにする
3.  DenotationSpan上でmousedownして、StypleSpan上でmouseupする
4.  エラーが起きないこと

## Termモードでテキスト上でmousedownしてStyleSpan上でmouseupしてエラーが起きない

### 背景

1.  6.2.43で発生
2.  6.3.19で対応

### -- 手段 --

1.  Editor1を選択
2.  Termモードにする
3.  テキスト上でmousedownして、右方向の、StypleSpan上でmouseupする
4.  エラーが起きないこと
5.  テキスト上でmousedownして、左方向の、StypleSpan上でmouseupする
6.  エラーが起きないこと

## TermモードでBlockSpan上でmousedownしてStyleSpan上でmouseupしてエラーが起きない

### 背景

1.  6.2.0で関数名をTypoして発生
2.  6.3.18で対応

### -- 手段 --

1.  Editor1を選択
2.  Blockモードにする
3.  StyleSpanの隣にBlockSpanを作成する
4.  Termモードにする
5.  BlockSpan中のテキスト上でmousedownして、StypleSpan上でmouseupする
6.  エラーが起きないこと

## 既存の要素を消す

### メイン

1.  Relationモードにする
2.  Relationを消す
3.  Entityを消す
4.  Termモードにする
5.  Spanを消す
6.  RelationのあるSpanを消す
7.  RelationのあるEntityを消す
8.  全て戻す
9.  選択されないこと
10. やり直す
11. 全て戻してからやり直すのを4回繰り返す

## ブロックを縮める

### 背景

1.  6.3.11で対応
2.  6.3.13で、BlockSpanの中のDenotationSpanとStyleSpan上でのマウスアップに対応
3.  BlockSpanの先頭の文字列を選択したときは、BlockSpanのマウスダウンイベントが発生します。このとき縮めるために、単一BlockSpan内の文字列選択時に縮小しています。
4.  単一のBlockSpan内の_途中の文字列_を選択したときは、BlockSpanが縮む動作に違和感がありました。
5.  6.3.15で、単一のBlockSpan内の文字列を選択したとき、BlockSpanの端の文字から選択したときだけ縮むようにしました。
6.  6.3.16で、単一のBlockSpan内の文字列を選択し縮まなかったときに、選択中の文字列を選択解除するようにしました。

### BlockSpanの端から縮める

1.  Blockモードにする
2.  2語以上のBlockSpanを作成する
3.  BlockSpan中の文字列を先頭から1文字以上開けて選択する
4.  BlockSpanが縮まらないこと
5.  文字列が選択解除されること
6.  BlockSpan中の文字列を先頭の文字を含んで選択する
7.  BlockSpanが縮むこと
8.  BlockSpan中の文字列を末尾から1文字以上開けて選択する
9.  BlockSpanが縮まらないこと
10. 文字列が選択解除されること
11. BlockSpan中の文字列を末尾の文字を含んで選択する
12. BlockSpanが縮むこと

### BlockSpanの外から縮める

1.  Editor1を選択
2.  Blockモードにする
3.  DenotationSpanとStyleSpanを含むBlockSpanを作成する
4.  BlockSpanの外からBlockSpanの中に文字列を選択するとき、次の組み合わせでBlockSpanが縮むこと
    1.  BlockSpan外のテキストから、BlockSpan中のテキスト
    2.  BlockSpan外のテキストから、BlockSpan中のDenotationSpan中のテキスト
    3.  BlockSpan外のテキストから、BlockSpan中のStyleSpan中のテキスト
    4.  BlockSpan外のDenotationSpan中のテキストから、BlockSpan中のテキスト
    5.  BlockSpan外のStyleSpan中のテキストから、BlockSpan中のテキスト
    6.  BlockSpan外のテキストから、BlockSpan中のDenotationSpan中のテキスト
    7.  BlockSpan外のテキストから、BlockSpan中のStyleSpan中のテキスト

## コントロールバー

### control属性

#### 背景

1.  4.5.0からhtml上のcontrol属性でコントロールバーを表示・非表示を設定できるようになりました

#### -- 手段 --

1.  control属性が`visible`のEditorは選択しなくてもコントロールバーが表示されていること（editor2）
2.  control属性が`hidden`のEditorを選択してもコントロールバーが表示されないこと（editor3）

### Editor毎に表示

#### 背景

1.  4.4.3まで複数Editorがあってもコントロールバーを一つ表示していました
2.  4.5.0からコントロールバーはEditor毎に表示します

#### -- 手段 --

1.  各Editorの最上部にコントロールバーが表示されないこと
2.  編集可能なEditorを選択する（editor1）
3.  Editorの上部にコントロールバーが表示されること
4.  Viewモードにする
5.  コントロールバーが表示されたままであること

### スクロールしたときにEditorの表示領域上部に張り付く

#### 背景

1.  5.0.0のコンテキストメニュー追加時に、コントロールバーのみstickyして、コンテキストメニューはstickyしないことにしました。

#### -- 手段 --

1.  Editorを選択する
2.  ブラウザをスクロールする
3.  Editorがスクロールしても、コントロールバーがスクロールアウトせず、Editorの最上部にいつづけること
4.  ブラウザをもっとスクロールする
5.  Editorがスクロールアウトするときに、コントロールバーも一緒にスクロールアウトすること

### Editorの幅に合わせて折り返し

#### 背景

1.  コントロールバーはEditorの幅に合わせて、折り返してアイコンを表示します
2.  コントロールバーの高さが固定であったため、2段目以降はにアイコンだけが表示されていました
3.  4.5.1からコンロトールバーの高さも調整します

#### -- 手段 --

1.  ウインドウの幅をコントロールバーより短くする
2.  アイコンが2段以上に折り返されて表示されること
3.  アイコンの高さに合わせて、コントロールバーの高さが伸びること

### TextAE

1.  TextAEをクリックすると新しいタブで`http://textae.pubannotation.org/`が開くこと

## Entityパレットのタイトルを折り返さない

### 背景

1.  Attribute定義がたくさんあるとき、EntityPalletのタイトルが折り返していました。
2.  6.3.12 でタイトルに最低幅を設定しました。

### -- 手段 --

1.  Editor1を選択
2.  Termモードにする
3.  `Q`キーを押して、EntityPalletを開く
4.  左上のタイトル`Entity Configuration`が折り返さないこと

## ブロックを伸ばす

### 背景

1.  6.3.9で対応
2.  6.3.10で、DenotationSpanとStyleSpan上でのマウスアップに対応

### -- 手段 --

1.  Editor1を選択
2.  Blockモードにする
3.  DenotationSpanとStyleSpanを含むBlockSpanを作成する
4.  BlockSpan中のテキストから、BlockSpan外のDenotationSpan中のテキストを選択
5.  BlockSpanが伸びること
6.  BlockSpan中のテキストから、BlockSpan外のStyleSpan中のテキストを選択
7.  BlockSpanが伸びること
8.  BlockSpan中のテキストから、BlockSpan外のテキストを選択
9.  BlockSpanが伸びること
10. BlockSpan中のDenotationSpan中のテキストから、BlockSpan外のテキストを選択
11. BlockSpanが伸びること
12. BlockSpan中のStyleSpan中のテキストから、BlockSpan外のテキストを選択
13. BlockSpanが伸びること

## Type定義編集をannotationファイルに保存

### 背景

1.  6.2.0からブロック機能を追加

### DenotationEntity

1.  Editor1を選択
2.  Termモードにする
3.  DenotationEntityを選択する
4.  `Change Label[W]`ボタンを押す
5.  既存のValueを消す
6.  `pro`を入力
7.  `production company@http://dbpedia.org/ontology/productionCompany`を選択
8.  OKボタンを押す
9.  `Upload [U]`ボタンを押す
10. `Click to see the json source in a new window.`をクリック
11. `config.Entity Types`に`{"id":"http://dbpedia.org/ontology/productionCompany","label":"production company"}`が含まれていること

### BlockEntity

1.  Editor1を選択
2.  Blockモードにする
3.  BlockEntityを選択する
4.  `Change Label[W]`ボタンを押す
5.  既存のValueを消す
6.  `pro`を入力
7.  `productionCompany@http://dbpedia.org/ontology/productionCompany`を選択
8.  OKボタンを押す
9.  `Upload [U]`ボタンを押す
10. `Click to see the json source in a new window.`をクリック
11. `config.Relation Types`に`{"id":"http://dbpedia.org/ontology/productionCompany","label":"productionCompany"}`が含まれていること

### Relation

1.  Editor1を選択
2.  Relationモードにする
3.  Relationを選択する
4.  `Change Label[W]`ボタンを押す
5.  既存のValueを消す
6.  `pro`を入力
7.  `productionCompany@http://dbpedia.org/ontology/productionCompany`を選択
8.  OKボタンを押す
9.  `Upload [U]`ボタンを押す
10. `Click to see the json source in a new window.`をクリック
11. `config.Relation Types`に`{"id":"http://dbpedia.org/ontology/productionCompany","label":"productionCompany"}`が含まれていること

## BlockSpanは親Spanを持たない

### 背景

1.  BlockSpanはなんらかのSpanの子になることはありません。Blockモードで、他のSpanの子BlockSpanを作成できていました。
2.  6.3.7 で対応しました

### -- 手段 --

1.  Termモードにする
2.  複数単語のDenotationSpanを作成する
3.  Blockモードにする
4.  作成したDenotationSpan中の1単語を選択する
5.  BlockSpanが作られないこと
6.  文字列の選択が解除されること

## 連続した空白の扱い

### 背景

1.  5.0.0 アノテーションテキスト中の連続した空白をまとめずに描画しています。
2.  Spanをつくると、Span内では連続した空白をまとめていました。
3.  6.1.1で対応しました。

### -- 手段 --

1.  editor9を選択
2.  `stomach  ache`をSpanにする
3.  単語の間の連続した空白がまとまらないこと

## annotationなし

### 背景

1.  開発中はannotationなしで開きません。エラーの見落としが多いです。
2.  `4.4.0`から、annotationがない時はデフォルト文字列を表示します。
3.  `4.5.0`から、html属性で`mode="edit"`をつけない場合はViewモードになり、Viewモードの場合はコントロールバーを表示しなくしました。

### Editモード

1.  Editor7を選択
2.  Editor中に`Currently, the document is empty. Use the "import" button or press the key "i" to open a document with annotation.`が表示されること
3.  エディタを選択するとコントロールバーが表示されること

## inlineで連続した空白を含むannotationを開けること

### 背景

1.  inlineのannotationのtextに、連続した空白が含まれていた場合、埋め込んだ時点で、１つの空白にまとめられていた
2.  annotationのtexteに、連続した空白が含まれていた場合、Editor上に表示する文字列ので、１つの空白にまとめられていた
3.  `textae-editor`クラスと、`textae-editor__body__text-box__paragraph-margin`クラスに、`white-space: pre`スタイルを指定が必要
4.  v4.5.7で対応

### -- 手段 --

1.  editor9を選択
2.  `stomach`のSpanがズレていないこと

## アノテーション保存時にメッセージをalertify.jsで表示

### 背景

1.  ステータスバーにメッセージを表示していました。
2.  Editorが大きいと隠れていた
3.  トーストを使って表示します

### -- 手段 --

1.  annotationを保存する
2.  右上に`annotation saved`と緑色のトースト表示がされること
3.  サーバを落とす
4.  サーバにannotationを保存する
5.  右上に`could not save`と赤色のトースト表示がされること

## Attributeの削除

### 背景

1.  5.0.0でAttributeを導入した際に、Attributeの削除ができませんでした。
2.  編集後のAttributeと同じAttributeを編集前のAttributeから探してきて、すべて見つかったときには変更なしとしてモデルの更新をスキップしていました。
3.  Attributeを減らしたときに変更があることを検知できませんでした。
4.  5.0.2で修正
5.  6.2.0からブロック機能を追加

### -- 手段 --

1.  Editor1を選択
2.  Termモードにする
3.  AttributeのあるDenotationEntityを選択する
4.  Wキーを押す
5.  `Remove`ボタンを押す
6.  OKボタンが押す
7.  選択したDenotationEntityからAttributeが削除されること
8.  Blockモードにする
9.  AttributeのあるDenotationEntityを選択する
10. Wキーを押す
11. `Remove`ボタンを押す
12. OKボタンが押す
13. 選択したDenotationEntityからAttributeが削除されること

## shiftを押してSpanを選択

### コピー

1.  Termモードにする
2.  shiftで複数のSpanをえらぶ
3.  コピーする
4.  貼り付けする
5.  選択してるSpanの全てのEntityがコピーされること

### 削除

1.  Termモードにする
2.  shiftで複数のSpanをえらぶ
3.  削除する
4.  選択してるSpanが全て削除されること

## Relationをホバーする

1.  Relationモードにする
2.  Relationのラベルをホバーする
3.  Relationのラベルが濃くなること
4.  Relationの線が太くなること
5.  Relationの矢印が大きくなること

## 先頭のSpanを後ろから縮めて消したときにエラーが起きない

### 背景

1.  6.1.53で、追加した必須パラメータのアサーションに0も引っかかって発生
2.  6.3.3で対応

### -- 手段 --

1.  Editor0を選択
2.  最初のSpanを後ろから縮めて消す
3.  エラーが起きないこと

## ワイルドカードありのtypeを追加したときに、既存のEntityとRelationに設定が反映されること

### 背景

1.  5.0.0からtype定義にはワイルドカード`*`を導入しました。
2.  idがワイルドカード`*`で終わるTypeのcolorとlabelは、idが前方一致するtypeに反映されます。
3.  一致したtype定義がcolorとlabelを持つ場合は、それが優先されます。
4.  Type定義を更新しても、Spanを移動するなどして再レンダリングされるまで、既存のEntityの色に反映されませんでした。
5.  5.0.2で修正
6.  5.2.0で動かなくなりました
7.  6.1.0で修正。Relationにも対応
8.  6.2.71 でBlockモードでパレットが開けるようになりました

### -- 手段 --

#### DenotationEntity

1.  Editor1を選択
2.  Termモードにする
3.  `Select Label [Q]`ボタンをクリックする
4.  `Add new type`ボタンをクリックする
5.  `Id`欄に`http*`を入力する
6.  `Color`欄を変更する
7.  `OK`ボタンを押す
8.  既存のDenotationEntityの色が変わること

#### BlockEntity

1.  Editor1を選択
2.  Blockモードにする
3.  `Select Label [Q]`ボタンをクリックする
4.  `Add new type`ボタンをクリックする
5.  `Id`欄に`block*`を入力する
6.  `Color`欄を変更する
7.  `OK`ボタンを押す
8.  既存のDenotationEntityの色が変わること

#### Relation

1.  Editor1を選択
2.  Relationモードにする
3.  `Select Label [Q]`ボタンをクリックする
4.  `Add new type`ボタンをクリックする
5.  `Id`欄に`http*`を入力する
6.  `Color`欄を変更する
7.  `OK`ボタンを押す
8.  既存のRelationの色が変わること

## namespace

### 背景

1.  4.1.11から`annotations.json`にnamespaceを書けるようになりました。
2.  prefixが`_base`だとhttpで始まらない全てのTypeに反映されます
3.  uriで指定した値とTypeが結合して、uriになります
4.  prefixが`_http`以外はprefixと一致した部分が置きかわります
5.  5.0.5でselection attributeとstring attributeにもnamespaceを適用しました。
6.  6.1.13 で、`annotations.json`上のnamespaceを一つしか読み込めなくなっていました。6.2.5で修正しました。

### -- 手段 --

1.  Viewモードで`prefix.json`を開く
2.  最初のDenotationSpanのTypeがpubannotation.orgへのリンクになっていること
3.  最初のDenotationSpanのAttributeがpubannotation.orgへのリンクになっていること
4.  第二のDenotationSpanのTypeが「googleでproteinを検索した結果画面」へのリンクになっていること
5.  第二のDenotationSpanのAttributeが「googleでproteinを検索した結果画面」へのリンクになっていること
6.  第三のDenotationSpanのTypeがabc.comへのリンクになっていること
7.  第三のDenotationSpanのAttributeがabc.comへのリンクになっていること

### namespaceを更新しない

1.  アノテーション保存ダイアログを開く
2.  ソースを表示する
3.  namespace に id を追加していないこと

## ブロックモード

### 背景

1.  6.2.0からブロック機能を追加
2.  ブロックを表現するためにテキスト上に装飾を配置すると、ブロック内のテキスト操作ができません。
3.  BlockSpanを伸ばす、縮める操作が、DenotationSpanと統一できません。
4.  6.3.0からブロックの表現を、BlockSpanの右側に箱を配置することにしました。

### -- 手段 --

1.  コントロールバーにBアイコンがあること
2.  Bアイコンを押す
3.  Blockモードになること
4.  エディタの背景が紫色になること
5.  テキストを選択する
6.  新しくBlockSpanが作られること
7.  作られたBlockSpanの背景がオレンジ色（選択中）であること
8.  BlockSpanの上下に点線ボーダーが表示されること
9.  BlockSpanの右側に紫色の領域があること
10. BlockSpanの右側の領域にBlockEntityが表示されていること
11. テキストをクリックする
12. BlockSpanの背景色がなくなる（選択解除される）こと
13. BlockSpanの右側に紫色の領域をクリックする
14. BlockSpanの背景がオレンジ色（選択中）になること
15. 削除ボタンをクリックする
16. 選択中のBlockSpanが削除されること
17. 戻せること

### ブロック作成

#### 背景

1.  6.2.26でブロックにボーダーを追加
2.  6.2.31でブロックとテキストの間に左右8ピクセルの隙間を開けました
3.  6.2.50でBlockEntityの右に隙間をあけました
4.  BlockSpanの表示位置を半行上に見せかけるために、BlockSpanは背景とヒットエリアを別に持っています
5.  Blockモードではヒットエリアのz-indexを加算するため、BlockSpan自体をマウスオーバーできません。
6.  ヒットエリアにtitle属性を設定していなかったため、ブロックモード中にBlockSpanをホバーしたときに、Span IDが表示されませんでした
7.  6.2.101で対応しました
8.  6.3.0からブロックの表現を、BlockSpanの右側に箱を配置することにしました。

#### -- 手段 --

1.  Editor1を選択
2.  BlockSpanの背景が透明であること
3.  BlockSpanの上下にボーダーがあること
4.  BlockSpanとテキストの間に隙間があること
5.  BlockEntityの右に隙間があること

## URLからアノテーション読み込み

### URLが指定されていなければOpenボタンを押せない

1.  アノテーション読み込みダイアログを開く
2.  URL欄が空の時は`Open`ボタンは無効
3.  Localのファイルが選択されていない時は`Open`ボタンは無効

### 読み込み失敗メッセージ

#### 背景

1.  読み込み失敗時のメッセージが素っ気なかった
2.  4.1.12から優しくなりました

#### -- 手段 --

1.  存在しないファイルを読み込む
2.  赤いトーストが表示されること
3.  `Could not load the file from the location you specified.:`が表示されること

### annotation.json以外のファイルを読み込んだらエラーメッセージを表示する

#### 背景

1.  コンソールにエラーを表示して、ぐるぐるが出たままでした。
2.  継続して使うことができませんでした。
3.  4.4.3で導入
4.  5.0.0でエラーメッセージを`This is not a json file of annotations.`から詳細化しました。
5.  5.3.4でエラーが起きていました。
6.  6.0.6 で対応

#### -- 手段 --

1.  読込みダイアログを表示
2.  URL欄に`development.html`を入力
3.  `Open`ボタンをクリック
4.  赤いトーストが表示されること
5.  `http://localhost:8000/dist/demo/development.html is not a annotation file or its format is invalid.`が表示されること

### URLからはテキストファイルは読み込めない

#### 背景

1.  5.0.0 でローカルファイルからのテストファイル読み込み機能を追加しました。

#### -- 手段 --

1.  読込みダイアログを表示
2.  URL欄に`http://localhost:8000/dev/target.txt`を入力し、`Open`ボタンを押して、サーバーから読み込む
3.  右上に`http://localhost:8000/dev/target.txt is not a annotation file or its format is invalid.`と赤色のトースト表示がされること

## ローカルファイルからアノテーション読み込み

### ファイルが指定されていなければOpenボタンを押せない

1.  アノテーション読み込みダイアログを開く
2.  Localのファイルが選択されていない時は`Open`ボタンは無効

### ローカルファイルからはテキストファイルが読み込める

#### 背景

1.  5.0.0 で機能を追加

#### -- 手段 --

1.  `target.txt`をファイルから読み込む
2.  アノテーションが読み込めること

### JSONでもテキストでもないファイルをファイルから読み込んだらエラーをalertify.jsで表示

#### 背景

1.  エラーが起きていました
2.  5.0.0 で対応
3.  5.3.4でエラーが起きていました。
4.  6.0.6 で対応

#### -- 手段 --

1.  適当なjsonでもtextでもないファイルを読み込む
2.  右上に`ファイル名(local file) is not a annotation file or its format is invalid.`と赤色のトースト表示がされること

## 改行をまたいでSpanを作成できる

### 背景

1.  テキスト中の改行をレンダリングするために、テキストを改行単位で区切ってpタグ（パラグラフ）内に描画していました
2.  pタグをまたいでspanを作れないため、パラグラフをまたいだspanの作成を禁止していました
3.  spanが作成できないことをわかりやすくするために、パラグラフをまたいでテキストを選択したときにアラートを表示していました
4.  5.0.0で、コンテキストメニューの右クリックでSpanを作成しないようにするために、clickイベントの代わりにmouseupイベントを監視するようにしたところアラート表示がされなくなっていました。
5.  5.2.8で、パラグラフのみclickイベントを監視して、アラートを表示できるように戻しました。
6.  5.2.8で、アラート表示がテキスト選択解除のあとになるようにスリープを入れました。
7.  6.0.0でテキスト中の改行のレンダリングをパラグラフから、cssの`white-space: pre-wrap;`に変更しました

### -- 手段 --

1.  Editor1を選択
2.  改行をまたいでテキストを選択する
3.  Spanが作成できること

## 長い文字列を含むアノテーションを開く

### 背景

1.  Google chromeとSafariは65536文字以上のテキストを複数のtext nodeに分割します。
2.  spanの開始位置のoffsetがtext nodeの範囲を越えることがあります。
3.  text nodeの中にspanをつくる場所が見つからずエラーになっていました。
4.  6.0.4で対応しました。

### 手段

1.  <http://pubannotation.org/projects/Genomics_Informatics/docs/sourcedb/@ewha-bio/sourceid/365/annotations.json> を読み込む
2.  エラーが起きないこと

## Relationの編集

### 背景

1.  6.0.0でModificationを廃止しました。

### 作る、変える、消す

1.  Spanを２つ作る
2.  Relationモードにする
3.  Relationを作る
4.  作ったRelationが選択される
5.  RelationのValueを変更する
6.  Relationの線が細くならないこと
7.  作ったRelationを消す
8.  Entityを片方消す
9.  Spanが残っていたらSpanを消す（SpanのEntityがゼロ個になると、Spanは自動的に削除されます）
10. 全て戻す

## コンフィグレーション保存のDiff

### 背景

1.  5.0.0 でコンフィグレーションの保存機能を追加しました
2.  6.1.6 でコンフィグレーション保存ダイアログの高さ制限をなくして、Diffの表示領域の縦スクロールバーの表示をやめました
3.  6.1.6 でDiffから変更のない項目を非表示にしました
4.  6.1.6 でリストの順序を変更したときに、移動を検知してDiffの量を小さくしました。

### -- 手段 --

1.  editor1を選択
2.  `Select Label [Q]`ボタンをクリックする
3.  Type定義を編集する
4.  コンフィグレーション保存ダイアログを開く
5.  `Configuration differences`にdiffが表示されること
6.  diff表示領域に縦スクロールバーが表示されないこと
7.  変更のないEntityの定義がDiffに表示されていないこと
8.  Downloadボタンを押して保存する
9.  DenotationEntityのProteinのidを変更する
10. コンフィグレーション保存ダイアログを開く
11. diffにEntity Proteinの変更のみ表示されていること

## 連続したBlockSpanの間に空行が挟まらない

### 背景

1.  6.2.0でBlockモードを追加しました
2.  BlockSpanをdivで表現しているため、div間に改行が挟まれ、1行余計に隙間が空いていました
3.  6.2.114 で、BlockSpanに`display: inline-block`と`width: 100px`を指定して、改行しつつ、余計な空行は挟まらないようにしました

### -- 手段 --

1.  Editor1を選択
2.  `block1`と`block2`の間に隙間がないこと

## コンフィグレーション保存

### 背景

1.  5.0.0 でコンフィグレーションの保存機能を追加しました

### 保存ファイル名は、読み込んだコンフィグレーションのファイル名

#### 背景

1.  コンフィグレーション保存ダイアログの保存ファイルの初期値は、最後に読み込んだコンフィグレーションのファイル名です
2.  6.1.4 で対応しました

#### -- 手段 --

1.  editor0を選択
2.  `Select Label [Q]`ボタンをクリックする
3.  コンフィグレーション読込ダイアログを開く
4.  ローカルファイルから`1_config.json`を読み込む
5.  `Select Label [Q]`ボタンをクリックする
6.  コンフィグレーション保存ダイアログを開く
7.  Local欄に`1_config.json`が表示されていること

### 保存先URLは、読み込んだコンフィグレーションのURL

#### 背景

1.  コンフィグレーション保存ダイアログの保存先URLの初期値は、最後に読み込んだコンフィグレーションのURLです
2.  読み込んだアノテーションファイルにコンフィグレーションが含まれず、textaeのHTML属性でコンフィグレーションのURLが指定されているときは、指定URLからコンフィグレーションを読み込みます。このときは読み込んだURLを保存していませんでした。
3.  コンフィグレーション読込ダイアログから、不正なコンフィグレーションを読み込んだときに、コンフィグレーションを適用しません。そのURLを保存していました。
4.  6.1.3 で対応しました

#### -- 手段 --

1.  editor1を選択
2.  アノテーション読込ダイアログを開く
3.  `/dev/2_annotations.json`を読み込む
4.  `Select Label [Q]`ボタンをクリックする
5.  コンフィグレーション保存ダイアログを開く
6.  URL欄に`../../dev/1_config.json?aaa`が表示されていること
7.  コンフィグレーション読込ダイアログを開く
8.  URL欄に`/dev/invalid_attributes_config.json`を入力して`open`ボタンをクリック
9.  コンフィグレーション保存ダイアログを開く
10. URL欄に`../../dev/1_config.json?aaa`が表示されていること

### URLを指定して保存

1.  editor1を選択
2.  `Select Label [Q]`ボタンをクリックする
3.  コンフィグレーション保存ダイアログを開く
4.  URLに保存する
5.  指定したファイル名`.dev_data.json`のファイルができていること
6.  指定したファイル名`.dev_data.json`のファイルに変更内容が反映されていること

### Localファイルに保存

1.  editor1を選択
2.  `Select Label [Q]`ボタンをクリックする
3.  コンフィグレーション保存ダイアログを開く
4.  Localに保存する
5.  指定したファイル名のファイルがダウンロードできること
6.  ダウンロードしたファイルに変更内容が反映されていること

### URLが指定されていなければsaveボタンを押せない

1.  editor1を選択
2.  `Select Label [Q]`ボタンをクリックする
3.  コンフィグレーション保存ダイアログを開く
4.  URL欄を空にする
5.  保存ダイアログ上のSaveボタンが無効になること

### コンフィグレーション保存時にメッセージをalertify.jsで表示

#### 背景

1.  5.0.0 開発中にサーバーに保存するときの、トーストメッセージが間違っていました

#### -- 手段 --

1.  editor1を選択
2.  `Select Label [Q]`ボタンをクリックする
3.  コンフィグレーション保存ダイアログを開く
4.  `Save`ボタンをクリックする
5.  右上に`configuration saved`と緑色のトースト表示がされること

## 別のannotatianを開いて高さが再計算されること

### 背景

1.  annotationによって行数が変わるので高さを再計算しなくてはいけません。

### -- 手段 --

1.  1_annotations.jsonを開く
2.  multi_tracks.jsonを開く
3.  高さが再計算されること
4.  下側の隙間が狭いこと

## line-height変更

### 背景

1.  4.1.8でtext−boxの下の隙間を小さくした
2.  4.1.16の開発中にモジュール読み込み構文の修正漏れでエラーを起こしていました。

### -- 手段 --

1.  Setingダイアログを開く
2.  line-heightを変更する
3.  高さが再計算されること
4.  下側の隙間が狭いこと

## パレットからのインスタンス選択

### 背景

1.  5.0.0でTypeの編集機能に、Typeのインスタンスを選択する機能を追加しました
2.  6.2.0からブロック機能を追加

### -- 手段 --

1.  Editor1を選択
2.  Termモードにする
3.  `Select Label [Q]`ボタンをクリックする
4.  `Select all the cases of this type`ボタンをクリックする
5.  Typeを持つDenotationEntityがすべて選択されること
6.  TypeにAttributeはあってもなくても選択されること
7.  Blockモードにする
8.  `Select Label [Q]`ボタンをクリックする
9.  `Select all the cases of this type`ボタンをクリックする
10. Typeを持つBlockEntityがすべて選択されること
11. TypeにAttributeはあってもなくても選択されること
12. Relationモードにする
13. `Select Label [Q]`ボタンをクリックする
14. `Select all the cases of this type`ボタンをクリックする
15. Typeを持つRelationがすべて選択されること

## BlockSpanにはひとつのBlockEntityしか追加できない

### 背景

1.  6.2.110で、BlockSpanにはひとつのBlockEntityしか追加できなくしました

### -- 手順 --

1.  Editor1を選択
2.  Blockモードにする
3.  BlockSpanを選択
4.  `E`キーを押す
5.  BlockEntityが追加されないこと

## 未保存変更があるときに、別のアノテーションを読み込もうとすると確認ダイアログを表示

### 背景

1.  保存していない変更があるか状態を持っています
2.  変更があるときにloadしようとすると確認ダイアログを表示します
3.  一度保存すると変更状態をリセットします
4.  確認ダイアログを表示しなくなります

### -- 手段 --

1.  変更する
2.  読込みする
3.  確認ダイアログが出る
4.  キャンセルする
5.  保存する
6.  読込みする
7.  保存する
8.  前回の保存内容と差があること

## Relationの曲率設定にEntityの位置が必要

### 背景

1.  Relationの移動時にRelationのカーブの曲率を修正しています
2.  RelationのカーブはEntityの位置から決めます
3.  Relation描画開始前にEntityを削除するとエラーが起きます
4.  Undo/Redo時は一連の処理が終わるまでRelationのレンダリングをスキップしています
5.  Entityの位置はキャッシュしたGridの位置から求めています
6.  5.0.0の開発中、spanの移動時にGridの位置をキャッシュから削除したら、キャッシュ削除とリレーション移動が入れ違い、Gridの位置が取れずにエラーが発生しました

### -- 手段 --

1.  Termモードにする
2.  RelationのあるSpanを4回サイズ変更する
3.  z4回,y４回を繰り返す

## DOMのidから`:`または`.`を削除

### 背景

1.  annotation.jsonのidからEntityのDOMのidを生成している
2.  idに`:`または`.`が含まれていると、擬似クラス、クラスセレクタと見なされidとして指定できなくなる
3.  4.1.14で対応しました。
4.  DOMのidからidの`:`または`.`を削除します。

### -- 手段 --

1.  Editor1を開く
2.  `null`のEntityをクリックできること
3.  `null`のEntityのDOM要素の`id`属性が`editor0__EE1ab`であること
4.  `null`のEntityのDOM要素の`title`属性が`E1:a:b`であること
5.  `parent`のEntityをクリックできること
6.  `parent`のEntityのDOM要素の`id`属性が`editor0__ET1ab`であること
7.  `parent`のEntityのDOM要素の`title`属性が`T1.a.b`であること

## 特殊なType文字列

### ドメインな文字列

#### 背景

1.  TypeのValueにurlを指定した場合は短縮してラベルに表示します
2.  Typeが`http://pubmed.org/`のときにディレクトリ名を取得しようとして空文字を取得していた
3.  ラベルが空だと正しくレンダリングできません
4.  4.1.8で対応しました

#### -- 手段 --

1.  Editor1を選択
2.  Type `http://pubmed.org/`の表示が`pubmed.org`になること

### ドメインがlocalhost

1.  既存のEntityを選択する
2.  TypeのValueを`http://localhost:8000/abc`に変更する
3.  Typeの表示がabcになること

### httpで始まるURLではない文字列

1.  既存のEntityを選択する
2.  TypeのValueを`http://hoge`に変更する
3.  Typeの表示が`http://hoge`になること

## Spanは必ずEntityを持つ

### Entityを自動作成

#### 背景

1.  4.1.8でEntityにつけるidのprefixを`E`から`T`に変えました
2.  6.2.0からブロック機能を追加

#### -- 手段 --

1.  Termモードにする
2.  DenotationSpanを作成する
3.  defaultのTypeのEntityができること
4.  Entityのidが`T`で始まること
5.  Blockモードにする
6.  BlockSpanを作成する
7.  defaultのTypeのEntityができること
8.  Entityのidが`T`で始まること

## 重複してコピーしない

1.  SpanとそのEntityを選択してコピーする
2.  貼付けたときに重複しないこと

## コピーしたEntityを削除してから貼付ける

1.  Entityを選択する
2.  コピーする
3.  削除する
4.  別のSpanを選択する
5.  貼付ける

## 起動直後

### 背景

1.  `4.4.0`からデフォルト文字列を表示します
2.  annotationがない場合も、Editorはサイズがありクリックできます
3.  起動時に一番上のEditorを選択する機能を消します

### -- 手段 --

1.  Editor7が選択されていないこと（背景色が白い）
2.  Editor7をクリック
3.  Editor7が選択されること（背景色がベージュ）

## 外部JavaScriptでEditorを初期フォーカスできること

1.  <http://localhost:8000/dist/editor.html> を開く
2.  Editor1が選択されていること（背景色がベージュ）

## タイプ変更をUndoしたとき、変更対象を選択しない

### 背景

1.  6.2.0からブロック機能を追加

### DenotationEntity

1.  Termモードにする
2.  タイプを変更する
3.  戻す
4.  選択されないこと

### BlockEntity

1.  Blockモードにする
2.  タイプを変更する
3.  戻す
4.  選択されないこと

### Relation

1.  Relationモードにする
2.  タイプを変更する
3.  戻す
4.  選択されないこと

## リサイズするとGridを移動する

### 背景

1.  4.1.10の修正中に、リサイズしても、二段目より上のTypeが横に移動するだけで縦に移動しなくなりました。
2.  4.4.3の修正中に、Gridだけ移動して、Relationが移動しなくなりました

### -- 手段 --

1.  ウインドウをリサイズする
2.  GridがSpanに追従して移動すること
3.  RelationがGridに追従して移動すること

### Relationを選択してリサイズする

1.  Relationモードにする
2.  Relationを選択
3.  リサイズして選択したRelationを移動する
4.  矢印が小さくならないこと
5.  ホバーしても、線が細くならないこと

## カット&ペースト

### 背景

1.  6.0.0でカット&ペースト機能を導入しました
2.  6.0.3でカットをキャンセルできるようにしました
3.  6.0.0から複数のSpanを選択してペーストするとエラーが起きていました
4.  6.1.12で、対応しました
5.  6.1.15で、ペーストしたときにSpanだけが残っていました
6.  6.2.104で、対応をしました
7.  6.1.15で、カットしたSpanを自分自身にペーストできるようになっていました
8.  6.2.105で、対応をしました

### 自分自身にペーストできない

1.  Spanを選択して`x`キーを押す
2.  Entityとラベルが半透明になること
3.  そのSpanを選択したまま、貼り付ける
4.  何も起きないこと

### カット&ペースト

1.  Spanを選択して`x`キーを押す
2.  Entityとラベルが半透明になること
3.  他のSpanを選択して貼り付ける
4.  選択したSpanの全てのEntityとAttributeが、対象Spanに張り付く
5.  Relationも張り付く
6.  元々あったEntityとラベルはなくなる

### 複数Spanを選択してペーストできない

1.  Spanを選択して`x`キーを押す
2.  Entityとラベルが半透明になること
3.  複数のSpanを選択して`v`キーを押して貼り付ける
4.  何も起きないこと

### カット状態のキャンセル

1.  Spanを選択して`x`キーを押す
2.  Entityとラベルが半透明になること
3.  同じSpanを選択したまま`x`キーを押す
4.  Entityとラベルが半透明でなくなること

## 上下キーでSpanとEntityの選択を切り替える

### 背景

1.  6.1.1で一つのdenotationを一つのエンティティに表示することしました。
2.  TypeとEntityの選択状態が区別されなくなりました。

### 上キーでSpanとEntityの選択を切り替える

1.  Termモードにする
2.  Spanを選択する
3.  `上キー`を押す
4.  Spanの一番先頭のEntityが選択されること

### 下キーでSpanとEntityの選択を切り替える

1.  Termモードにする
2.  Entityを選択する
3.  `下キー`を押す
4.  EntityのSpanが選択されること

## コピー&ペースト

### 背景

1.  6.0.0でModificationを廃止しました。
2.  6.1.1で一つのdenotationを一つのエンティティに表示することしました。

### span

1.  Spanを選択してコピーする
2.  他のSpanを選択して貼り付ける
3.  選択したSpanの全てのEntityとAttributeが、対象Spanに張り付く
4.  Relationはコピーされない

### Entity

1.  Entityを選択してコピーする
2.  他のSpanを選択して貼り付ける
3.  選択した全てのEntityとそのAttribute、対象Spanに張り付く
4.  Relationはコピーされない

## ホバー

### 背景

1.  6.0.0 でModificationを廃止しました
2.  6.1.49 Entityのインスタンスだけでなく、ラベルをホバーしたときもRelationを強調するようにしました
3.  6.2.28 でEntityのエンドポイントの表示をやめました
4.  6.2.85 でTermモードで、Relationが強調されなくなっていました
5.  6.2.101 で対応しました

### 連動

1.  EntityのラベルをホバーするとRelationも強調する
2.  RelationのラベルをホバーするとRelationも強調する

### ホバー時の見た目の変化

1.  Entityのラベルのdivにシャドウ
2.  Relationはラベルのテキストにシャドウ

## Block要素のdivをクリックしたら選択解除する

### 背景

1.  BlockSpanはdivとしてレンダリングしています
2.  BlockSpanの表示位置を半行上に見せかけるために、BlockSpanは背景とヒットエリアを別に持っています
3.  BlockSpan自体のマウスクリックイベントをハンドリングしていなかったため、BlockSpanの背景のすぐ下をクリックしたときに選択解除していませんでした。
4.  6.2.39で対応しました

### -- 手段 --

1.  Termモードにする
2.  Spanを選択する
3.  Blockのすぐ下をクリックする
4.  Spanが選択解除されること
5.  Blockモードにする
6.  BlockSpanを選択する
7.  BlockSpanのすぐ下をクリックする
8.  BlockSpanが選択解除されること
9.  Relationモードにする
10. Relationを選択する
11. BlockSpanのすぐ下をクリックする
12. Relationが選択解除されること

## 選択中のBlockSpanでDenotationEntityを隠さない

### 背景

1.  6.2.0からブロック機能を追加
2.  ブロックスパンの位置を、実際のdiv要素の位置より半行上に見せかけるために、背景用のdivを追加しています
3.  ブロックモードでは、ブロックをクリックできるように、背景用divのz-indexを加算していました
4.  背景用divに選択中のスタイルを適用したときにDenotationEntityを隠していました
5.  6.2.37で、背景用divと別にマウス操作用のdivを追加して、対応しました。

### -- 手段 --

1.  DenotationSpanの親になるBlockSpanを作成する
2.  DenotationEntityの色が変わらないこと

## ブロックを含むアノテーションを読み込んだあとに他のあとにを読み込めること

### 背景

1.  アノテーションを読み込む際に、読み込み済みのブロック情報をクリアしていませんでした。
2.  読み込んだアノテーションと矛盾が生じてエラーが起きていました。
3.  6.2.4で対応

#### -- 手段 --

1.  Editor1を選択
2.  `prefix.json`を開く
3.  エラーが起きないこと

## 1つのEntityは同一のPredicateのAttributeをひとつまでしか持てない

### 背景

1.  5.0.0で、エディタ上でのAttributeの追加・編集機能を追加しました。Annotationファイルの読み込み時はチェックしていませんでした。
2.  5.3.2から、Annotationファイルの読み込み時に1つのEntityにPredicateが等しいAttributeが複数ついているかチェックします。
3.  5.3.5から、アラートをpred単位で分けました。
4.  6.1.8から、重複したAttributeを無視し、Validation Dialogに表示します。
5.  6.2.93で`Dupulicated`のtypoを修正
6.  6.2.97で、参照先がないAttributeも、`Duplicated attributes.`テーブルに表示することにしました
7.  6.2.100で、BlockEntityのAttributeの重複チェックを追加しました

### Annotationファイルの読み込み時に1つのEntityにPredicateが等しいAttributeが複数ついているかチェックする

1.  Editor1を選択
2.  アノテーション読み込みダイアログを開く
3.  `invlaid.json`を読み込む
4.  Validation Dialogの`Duplicated attributes.`に`A1`と`A2`が表示されること
5.  Validation Dialogの`Duplicated attributes.`に`A4`と`A5`が表示されること
6.  Validation Dialogの`Duplicated attributes.`に`B2`と`B3`が表示されること

### ショートカットキー

1.  Editor1を選択
2.  Termモードにする
3.  Entityを選択する
4.  1キーを押す
5.  Attributeが追加されること
6.  1キーを押す
7.  パレットが開いてdenoteタブが選択されていること
8.  Attributeが追加されないこと

#### パレット

1.  Editor1を選択
2.  Termモードにする
3.  Entityを選択する
4.  パレットを開く
5.  denoteタブを選ぶ
6.  `Add to selected entity`ボタンを押す
7.  Attributeが追加されること
8.  `Add to selected entity`ボタンが`Remove from selected entity`ボタンに変わること
9.  Entityの選択を解除する
10. `Add to selected entity`ボタンが表示されること

## アノテーションファイル中のBlockEntity間のAttributeを読み込める

### 背景

1.  6.2.0からブロック機能を追加
2.  アノテーションファイルにBlockEntityのAttributeを記述しても、Attributeの参照先としてBlockEntityが見つからにためバリデーションエラーになっていました
3.  6.2.99 で対応しました。

### -- 手段 --

1.  Editor1を選択
2.  Block1にAttributeがあること

## アノテーションファイル中のBlockEntity間のRelationを読み込める

### 背景

1.  6.2.0からブロック機能を追加
2.  アノテーションファイルにBlockEntity間のリレーションを記述しても、リレーションの参照先としてBlockEntityが見つからにためバリデーションエラーになっていました
3.  6.2.97 で対応しました。

### -- 手段 --

1.  Editor1を選択
2.  BlockEntityの間にリレーションがあること

## SimpleモードでのEntity追加したらメッセージをalertify.jsで表示しない

### 背景

1.  SimpleモードではEntityを追加しても反応がありません
2.  4.1.8で追加時にトースト表示することにしました
3.  6.1.1で一つのdenotationを一つのエンティティに表示することしました。
4.  Entityの追加がみえるようになったのでトーストの表示をやめました。

### -- 手段 --

1.  Simpleモードにする
2.  既存のSpanを選択する
3.  `E`キーを連打する
4.  トーストメッセージが表示されないこと
5.  戻してやり直す
6.  トーストメッセージが表示されないこと

## 自動保存

### 背景

1.  6.0.0で自動保存機能を追加しました。

### -- 手段 --

#### サーバーからアノテーションファイルを読み込んだとき自動保存機能が有効になること

1.  Editor5を選択
2.  自動保存機能ボタンが無効であること
3.  URLから`1_annotations.json`を読み込む
4.  自動保存機能ボタンが有効になること

#### 自動保存機能を有効にしてアノテーションを編集すると、一定時間後保存されること

1.  Editor1を選択
2.  自動保存機能ボタンを押下する
3.  アノテーションを編集する
4.  5秒後に`annotation saved`とトースト表示されること

#### アノテーションファイルを読み込むと自動保存機能が停止になること

1.  Editor1を選択
2.  自動保存機能ボタンを押下する
3.  アノテーションを読み込む
4.  自動保存機能ボタンの押下が戻っていること

#### 保存に失敗すると自動保存機能が停止になること

1.  Editor0を選択
2.  自動保存機能ボタンを押下する
3.  アノテーションを編集する
4.  5秒後に認証ダイアログが表示されたらキャンセルする
5.  `could not save`とトースト表示されること
6.  自動保存機能ボタンの押下が戻っていること

## 読み込んだアノテーションのdenotationsとblocksのID重複の検出

### 背景

1.  6.2.20 IDが重複した denotations 検出機能を追加しました
2.  6.2.21 でblocksのバリデーションを追加しました。
3.  6.2.93で`Dupulicated`のtypoを修正
4.  6.2.94 ID重複用のテーブルをdenotationsとblocksで一つにまとめました
5.  6.2.95 でdenotationsとblocksのIDが重複している場合もチェックするようにしました。

### -- 手段 --

1.  invalid.jsonを読み込む
2.  `Duplicated IDs in Denotations and Blocks.`に`T2`がふたつと`B3`がふたつ表示されること
3.  `Duplicated IDs in Denotations and Blocks.`に`EB1`がふたつ表示されること

## 読み込んだアノテーションのdenotationsとblocksとtypesettingsの境界交差の検出

### 背景

1.  6.0.0 でtypesettingsを導入し、typesettingsの境界交差を検出していました
2.  denotationsとtypesettingsが境界交差した場合にエラーが起きていました
3.  6.1.7で対応しました。
4.  6.2.16でテーブル名を`Denotations or Typesettings with boundary-cross.`に変えました
5.  6.2.89で境界交差の検査対象にblocksを追加しました

### -- 手段 --

1.  invalid.jsonを読み込む
2.  `Denotations or Blocks or Typesettings with boundary-cross.`にtypesettingsが表示されること
3.  `Denotations or Blocks or Typesettings with boundary-cross.`にdenotationsが表示されること
4.  `Denotations or Blocks or Typesettings with boundary-cross.`にblocksが表示されること
5.  `Denotations or Blocks or Typesettings with boundary-cross.`にtypesettingsとdenotationsが交差している`E21`が表示されること

## 読み込んだアノテーションのblocksに不正データが含まれていたらValidation Dialogに表示すること

### 背景

1.  6.2.21 でblocksのバリデーションを追加しました。
2.  blocksにバリデーションエラーがあるときにエラーにしていませんでした
3.  このためblocksだけにバリデーションエラーがあるときにValidation Dialogを表示していませんでした
4.  6.2.60で対応
5.  Dupulicated range検出ロジックが常にtrueを返すバグがありました
6.  6.2.20の対応で、bloksを含む1_annotation.jsonを読むと常にValidation Dialogを表示するようになりました。
7.  6.2.61で対応
8.  6.2.93で`Dupulicated`のtypoを修正

### -- 手段 --

1.  Editor1を選択
2.  Validation Dialogが表示されないこと
3.  invalid_blocks_only.jsonを読み込む
4.  Validation Dialogを表示すること
5.  `Wrong range blocks.`に`E1`が表示されること
6.  `Out of text blokcs.`に`E2`が表示されること
7.  `Duplicated range blocks.`に`E4`と`E5`が表示されること
8.  `Duplicated IDs in Denotations and Blocks.`に`E3`がふたつ表示されること

## 読み込んだアノテーションのdenotationsに不正データが含まれていたらValidation Dialogに表示すること

### 背景

1.  6.2.20 IDが重複した denotations 検出機能を追加しました
2.  6.2.93で`Dupulicated`のtypoを修正

### -- 手段 --

1.  invalid.jsonを読み込む
2.  Validation Dialogを表示すること
3.  `Wrong range denotations.`に `T1`と`E2`が表示されること
4.  `Out of text denotations.`に`begin` が `-2` で `end` が `15` のdenotationと`E1`が表示されること

## ファイル読み込み時の認証情報入力

### 背景

1.  4.1.19からBasic認証付きのanntation.jsonの読み込みに対応しました。

### -- 手段 --

1.  <http://127.0.0.1:8000/dev/private.json> を読み込む
2.  認証ダイアログが開くこと
3.  ユーザーに`Jin-Dong Kim`、パスワードに`passpass`を設定してログインボタンを押す
4.  private.jsonを読み込めること
5.  一度認証に成功するとブラウザがユーザーとパスワードを記憶します。もう一度試す場合はブラウザを再起動すること

## Relation描画は非同期

### 高速にRelationのあるSpanを削除して戻す

#### 背景

1.  Relationの移動時にRelationのカーブの曲率を修正しています
2.  RelationのカーブはEntityの位置から決めます
3.  Relationの移動が非同期です
4.  Relationを作ってから移動するまでの間にEntityが削除されることがある
5.  RelationはModelからは削除されない（？）
6.  removedフラグをチエックする必要があります

#### -- 手段 --

1.  RelationのあるSpanを削除する
2.  `z`と`y`をできる限り高速に連打する
3.  30回、Undo/Redoを繰り返しても、エラーがでないこと

### 高速にRelationを作ってRelationを作る

#### 背景

1.  Relation描画は非同期です
2.  Relationを追加後、Relation描画開始前にデータを削除するとエラーが起きます
3.  Undo/Redo時は一連の処理が終わるまでRelationのレンダリングをスキップしています

#### -- 手段 --

1.  Relationを作る
2.  Relationを作る
3.  z, z, y, yを10回なるべく高速に繰り返す

## アノテーション保存

### 保存ファイル名は、読み込んだアノテーションのファイル名

#### 背景

1.  アノテーション保存ダイアログの保存ファイルの初期値は、最後に読み込んだアノテーションのファイル名です
2.  6.1.4 で対応しました

#### -- 手段 --

1.  editor0を選択
2.  アノテーション読込ダイアログを開く
3.  ローカルファイルから`1_annotations.json`を読み込む
4.  アノテーション保存ダイアログを開く
5.  Local欄に`1_annotations.json`が表示されていること

### Clipboard

#### 背景

1.  5.3.4で、JSONフォーマットを2回stringfyして壊れていまた
2.  6.1.2で対応

#### -- 手段 --

1.  アノテーション保存ダイアログを開く
2.  `Click to see the json source in a new window`をクリックする
3.  新しいタブが開いてannotation.jsonが表示されること
4.  `{\"target\"`のようにエスケープ用のバックスラッシュが入っていないこと
5.  表示したjsonに変更内容が反映されていること

### URL

1.  Editor1を選択
2.  アノテーション保存ダイアログを開く
3.  URLに保存する
4.  指定したファイル名`.dev_data.json`のファイルができていること
5.  指定したファイル名`.dev_data.json`のファイルに変更内容が反映されていること

### Local

1.  アノテーション保存ダイアログを開く
2.  Localに保存する
3.  指定したファイル名のファイルがダウンロードできること
4.  ダウンロードしたファイルに変更内容が反映されていること

### URLが指定されていなければsaveボタンを押せない

1.  アノテーション保存ダイアログを開く
2.  URL欄を空にする
3.  保存ダイアログ上のSaveボタンが無効になること

## 隣の単語と単語の一部がSpanになっているときに残りをSpanにする

### Boundary Detection有効時の動作

1.  Editor1を選択
2.  隣の単語と単語の一部までがSpanにする（例：`Promoter met`）
3.  単語の残りの部分を選択する（例：`hylation`）
4.  Spanができないこと
5.  テキストの選択が解除されること

### Boundary Detection無効時の動作

1.  Editor5を選択
2.  隣の単語と単語の一部までがSpanにする（例：`Ribonucleic a`）
3.  単語の残りの部分を選択する（例：`cid`）
4.  Spanができること

## 読み込んだアノテーションのtypesettingsに不正データが含まれていたらValidation Dialogに表示すること

### 背景

1.  6.2.17 で不正な範囲の typesettings 検出機能を追加しました
2.  6.2.19 でテキスト外の typesettings 検出機能を追加しました

### -- 手段 --

1.  invalid.jsonを読み込む
2.  Validation Dialogを表示すること
3.  `Wrong range typesettings.`に `begin` が `10` で `end` が `5` のtypesettingが表示されること
4.  `Out of text typesettings.`に `begin` が `0` で `end` が `1786` のtypesettingが表示されること

## 読み込んだアノテーションに不正データが含まれていたらValidation Dialogを表示すること

### 背景

1.  annotation.jsonに不正なデータが入っていた場合にエラーがおきていました
2.  4.1.8でannotation.jsonのデータチェック機能を追加しました
3.  元のデータを修正しているので、`Upload`ボタンを有効にします
4.  4.1.12でクロスするSpanの検出機能を追加しました
5.  4.1.15でValidation Dialogタイトルのミススペルを修正しました
6.  5.0.0で`Upload`ボタンの制御を有効無効から、星マークの有無に変更しました

### -- 手段 --

1.  invalid.jsonを読み込む
2.  不正なデータを検出してValidation Dialogを表示すること
3.  Validation Dialogのタイトルが`The following erroneous annotations ignored`であること

## Entityの見た目

### 背景

1.  6.2.28でEntityのエンドポイントの表示をやめました。

### -- 手段 --

1.  Entityの上に丸が表示されないこと

## Entity選択時のEntityの見た目の変化

### 背景

1.  6.2.28でEntityのエンドポイントの表示をやめました。

### -- 手段 --

1.  Entityを選択する
2.  Entityのラベルのボーダーが赤色になること

## typesettings

### 背景

1.  6.0.0でTypesetの表示に対応
2.  6.0.5でアノテーションファイル上のTypesetのプロパティ名を`type stes`から`typesettings`に変更
3.  6.1.0で、アノテーションファイルを読み直したときに、typesettingsの情報をリセットしていないバグに対応
4.  6.1.9で、ObjectSpanと完全一致するStyleSpanが表示されないバグがおきた
5.  6.1.11で対応
6.  6.1.16で、StyleSpanと完全一致するObjectSpanを作れないバグに対応

### -- 手段 --

#### StyleSpanと完全一致するObjectSpanを作成

1.  Editor1を選択
2.  太字で斜体の`CpG`をSpanにできること

#### リセット

1.  Editor1を選択
2.  `1_annotations.json`以外のアノテーションファイルを読み込む
3.  太字、字下げ、字上げが表示されないこと

#### レンダリング

1.  Editor1を選択
2.  1行目の`Down-regulation`が斜体で表示されていること
3.  1行目の`regulatory fact`が太字で表示されていること
4.  2行目の`gene`が字下げして表示されていること
5.  2行目の`euk`が字上げして表示されていること

#### Span作成

1.  Editor1を選択
2.  Style Spanを子とする親Spanが作れること
3.  Style Spanを親とする子Spanが作れること
4.  Style SpanとクロスしたSpanが作れないこと

## エンティティを選択中かつShiftキーを押している間に、Spanをマウスクリックするとエラーが起きないこと

### 背景

1.  エンティティを選択中かつShiftキーを押している間に、Spanをマウスクリックするとエラーが起きます
2.  6.0.0で対応しました。

### -- 手段 --

1.  エンティティを選択する
2.  Shiftキーを押しながら、Spanをマウスクリック
3.  エラーが起きないこと

## DenotationEntity編集後も選択状態を保持

1.  Term-Simpleモードにする
2.  Typeを選択する
3.  Typeを編集する
4.  Type編集後もラベルが選択されていること

## Relation編集ダイアログ

### Wキー

1.  Relationモードにする
2.  Relationを選択する
3.  `W`キーを押す
4.  編集ダイアログが開くこと
5.  選択したRelationのTypeのidが表示されること

### 複数Relation選択時はは元の文字列は表示されない

#### 背景

1.  どの要素のTypeを表示すればいいのかわからないので

#### -- 手段 --

1.  Relationモードにする
2.  複数Relationを選択する
3.  Typeを編集する
4.  空文字が表示されること

## オートコンプリートからType定義を追加更新したときのUndo

### 背景

1.  オートコンプリートで選択したTypeをconfigに保存します
2.  Undo/Redoが可能です

### DenotationEntityのTypeを追加

1.  Editor1を選択
2.  Termモードにする
3.  `Select Label [Q]`ボタンをクリックする
4.  パレットに`http://dbpedia.org/ontology/parent`があること
5.  `http://dbpedia.org/ontology/parent`のラベルが空であること
6.  DenotationEntityを選択する
7.  `Change Label[W]`ボタンを押す
8.  `par`を入力
9.  `parent@http://dbpedia.org/ontology/parent`を選択する
10. `OK`ボタンを押す
11. `Select Label [Q]`ボタンをクリックする
12. パレットに`http://dbpedia.org/ontology/parent`があること
13. `http://dbpedia.org/ontology/parent`のラベルが`parent`であること
14. `Undo [Z]`ボタンをクリックする
15. DenotationEntityのラベルが変更前に戻ること
16. `Select Label [Q]`ボタンをクリックする
17. パレットに`http://dbpedia.org/ontology/parent`があること
18. `http://dbpedia.org/ontology/parent`のラベルが空であること

### BlockEntityのTypeを追加

1.  Editor1を選択
2.  Blockモードにする
3.  `Select Label [Q]`ボタンをクリックする
4.  パレットに`http://dbpedia.org/ontology/parent`がないこと
5.  BlockEntityを選択する
6.  `Change Label[W]`ボタンを押す
7.  `par`を入力
8.  `parent@http://dbpedia.org/ontology/parent`を選択する
9.  `OK`ボタンを押す
10. `Select Label [Q]`ボタンをクリックする
11. パレットに`http://dbpedia.org/ontology/parent`があること
12. `http://dbpedia.org/ontology/parent`のラベルが`parent`であること
13. `Undo [Z]`ボタンをクリックする
14. BlockEntityのラベルが変更前に戻ること
15. `Select Label [Q]`ボタンをクリックする
16. パレットに`http://dbpedia.org/ontology/parent`がないこと

### RelationのTypeを追加

1.  Editor1を選択
2.  Relationモードにする
3.  `Select Label [Q]`ボタンをクリックする
4.  パレットに`http://dbpedia.org/ontology/parent`がないこと
5.  Relationを選択する
6.  `Change Label[W]`ボタンを押す
7.  `par`を入力
8.  `parent@http://dbpedia.org/ontology/parent`を選択する
9.  `OK`ボタンを押す
10. `Select Label [Q]`ボタンをクリックする
11. パレットに`http://dbpedia.org/ontology/parent`があること
12. `http://dbpedia.org/ontology/parent`のラベルが`parent`であること
13. `Undo [Z]`ボタンをクリックする
14. Relationのラベルが変更前に戻ること
15. `Select Label [Q]`ボタンをクリックする
16. パレットに`http://dbpedia.org/ontology/parent`がないこと

## Numeric Attribute定義の`default`, `min`, `max`, `step`がNumber型であること

### 背景

1.  5.1.0で、パレットから、Numeric Attributeの定義を追加する機能を追加しました。
2.  新規のNumeric Attributeの定義を追加する際に、input要素の入力値をNumber型に変換せずに設定していたため、文字列型で作成していました。
3.  5.2.7で、Number型への変換を追加して、対応しました。

### -- 手順 --

1.  Editor1を選択
2.  Termモードにする
3.  `Q`キーを押してパレットを開く
4.  `Add new attribute`タブをクリックする
5.  Attribute typeを`numeric`に変更
6.  `Predicate`を入力する
7.  ,`Default`, `Min`, `Max`, `Step`に数値を入力する
8.  `OK`ボタンをクリックする
9.  パレットの`Upload`アイコンをクリック
10. Configuration differencesに表示される、追加したAttribute定義の`default`, `min`, `max`, `step`がNumber型である(ダブルクォートされていない)こと

## Attribute定義の順序変更

### 背景

1.  5.3.6で、パレットのAttributeタブをドラッグアンドドロップして、Attribute定義の順序を変更する機能を追加しました。

### -- 手順 --

1.  Editor1を選択
2.  Termモードにする
3.  `Q`キーを押してパレットを開く
4.  `denote`タブを選択する
5.  `denote`タブをドラッグして、`warning`タブの前の矢印の上に移動する、タブの左側に空間ができること
6.  ドロップする
7.  `denote`タブが、`warning`タブの前に移動すること
8.  Zキーを押す
9.  `denote`タブが先頭に戻ること

## Configurationの自動更新

### 背景

1.  5.3.0で、ConfigurationにAttribute定義がないときにAttributeをふくむAnnotationファイルを開けるように、AnnotationファイルのAttributeの情報からAttribute定義を生成する機能を、導入しました
2.  5.3.5 から、config中のSelectionAttribute定義のvaluesプロパティにdefault値が無いときに、自動生成するようになりました。

### -- 手段 --

1.  Editor1を選択
2.  パレットを開く
3.  `denote`のデフォルト値が`Cell`（annotaion中で最も使われている値）であること
4.  `selection with empty values`のデフォルト値が`default`であること
5.  `selection with null values`のデフォルト値が`default`であること
6.  `selection without values`のデフォルト値が`default`であること
7.  自動生成されたAttribute定義`success`があること
8.  `success`がflag attributeであること
9.  自動生成されたAttribute定義`precision`があること
10. `precision`がnumeric attributeであること
11. `precision`のminが1.1であること
12. `precision`のmaxが100.002であること
13. `precision`のstepが0.001であること
14. `precision`のdefaultが10であること
15. `remark`がstring attributeであること
16. `remark`のdefaultがsuspiciousであること

## config指定

### 属性よりannotationファイル内を優先

#### 背景

1.  config属性が指定されている場合、初期化時にconfigを読み込みます
2.  config読み込みの完了がアノテーションよりあとになることがあるため、初期表示ではconfigが優先されることがあります
3.  手動でアノテーションを読み込んだ際は、属性よりannotationファイル内をを優先します
4.  5.0.2でannotation属性とconfig属性を同時に指定した時は、annotationファイル内にcongfigがないときだけ、configを読み込むことにしました。

#### -- 手段 --

1.  Editor1を開く
2.  annotation内のconfigが使用され、Proteinがピンクであること
3.  configなしannotationを指定してEditorをひらく(2_annotations.json)
4.  config属性のconfigが使用され、Proteinが青であること

### configのないannotationを読み込んだらdefaultタイプをリセットする

#### 背景

1.  5.0.0 の開発中に、configのないannotationを読み込んでもdefaultタイプをリセットしないバグが起きました

#### -- 手段 --

1.  Editor0を開く
2.  configありのannotationを開く(1_annotation.json)
3.  configなしのannotationを開く(2_annotation.json)
4.  Termモードにする
5.  Spanを作る
6.  Typeが`something`であること
7.  パレットを開く
8.  Typeが`something`だけであること

## パレットの表示項目

### 背景

1.  5.1.0 からEntityのパレットにAttributeタブを表示します。
2.  5.3.6 からAttributeタブにショートカットキーの番号を表示します。
3.  6.2.71 でBlockモードでパレットが開けるようになりました

### Termモード

1.  Editor1を選択
2.  Termモードにする
3.  パレットを開く
4.  全行にTypeのidが表示されること
5.  idが`http://wwww.yahoo.co.jp`のTypeのlabelに`Regulation`が表示されること
6.  idがURLのTypeの右端にアイコンが表示される
7.  Typeの使用数が表示されること
8.  全選択ボタンが表示されること
9.  編集ボタンが表示されること
10. 削除ボタンが表示されること
11. EntityがないTypeの削除ボタンが有効であること
12. Attributeタブが表示されること
13. 1〜9番目までのAttributeタブにショートカットキーが表示されること

### Blockモード

1.  Editor1を選択
2.  Blockモードにする
3.  パレットを開く
4.  全行にTypeのidが表示されること
5.  idがURLのTypeの右端にアイコンが表示される
6.  Typeの使用数が表示されること
7.  全選択ボタンが表示されること
8.  編集ボタンが表示されること
9.  削除ボタンが表示されること
10. EntityがないTypeの削除ボタンが有効であること
11. Attributeタブが表示されること
12. 1〜9番目までのAttributeタブにショートカットキーが表示されること

### Relationモード

1.  Editor1を選択
2.  Relationモードにする
3.  パレットを開く
4.  全行にTypeのidが表示されること
5.  idがURLのTypeの右端にアイコンが表示される
6.  Typeの使用数が表示されること
7.  全選択ボタンが表示されること
8.  編集ボタンが表示されること
9.  削除ボタンが表示されること

### Lock Edit Config

1.  Editor1を選択
2.  Termモードにする
3.  設定ダイアログをひらく`Lock Edit Config`にチェックを入れること
4.  パレットを開く
5.  全選択ボタンが表示されないこと
6.  編集ボタンが表示されないこと
7.  削除ボタンが表示されないこと
8.  Attirbute追加タブが表示されないこと

### モードに応じてパレットに表示するTypeを変更

#### Termモード

1.  Termモードにする
2.  パレットを開く
3.  EntityのTypeが表示されること

#### Term-Simpleモード

1.  Term-Simpleモードにする
2.  パレットを開く
3.  EntityのTypeが表示されること

#### Blockモード

1.  Blockモードにする
2.  パレットを開く
3.  EntityのTypeが表示されること

#### Block-Simpleモード

1.  Block-Simpleモードにする
2.  パレットを開く
3.  EntityのTypeが表示されること

#### Relationモード

1.  Relationモードにする
2.  パレットを開く
3.  RelationのTypeが表示されること

#### Viewモード

1.  Viewモードにする
2.  パレットが開けないこと

## BlockSpanをつくったときにTextBoxの高さを調整する

### 背景

1.  6.2.0からブロック機能を追加
2.  BlockSpanをつくるとテキストが折り返されるため、テキストの高さが変わります。
3.  変わったテキストの高さに合わせてTextBoxの高さを調整する必要があります。
4.  6.2.29で対応しました。

### -- 手段 --

1.  Editor4を選択
2.  Blockモードにする
3.  BlockSpanを追加する
4.  テキストがエディタの下にはみ出ていかないこと
5.  追加したBlockSpanを削除する
6.  テキストの下に余白ができないこと

## BlockEntityはTypeGapを表示しない

### 背景

1.  6.2.0からブロック機能を追加
2.  BlockEntityは横に並ばないため、リレーションも横方向にのびません
3.  リレーションの出元をBlockEntityの上にする必要がなく、見やすくするためにTypeGapをあける必要もありません
4.  6.2.81で、BlockEntityのTypeGapをなくしました

### -- 手段 --

1.  Editor1を選択
2.  `block1`にTypeGap（ラベルの上の空間）がないこと
3.  `block1`にAttributeを追加する
4.  `block1`にTypeGap（ラベルの上の空間）がないこと

## Type定義編集パレットの表示

### パレットの表示位置

1.  Termモードにする
2.  Entityを選択する
3.  `Select Label [Q]`ボタンをクリックする
4.  パレットがボタンの近くに開くこと
5.  `Q`キーを押す
6.  パレットがマウスカーソルの近くに開くこと

### パレットは画面サイズに合わせて縮小する

#### 上下

1.  ブラウザの上下のサイズをパレットより小さくする
2.  Termモードにする
3.  Entityを選択する
4.  `Q`キーを押す
5.  パレットが画面からはみ出ないこと
6.  パレットの上下に1pxずつ隙間ができること
7.  スクロールして、画面外のTypeを選択できること

#### 左右

1.  ブラウザの左右のサイズをパレットより小さくする
2.  Termモードにする
3.  Entityを選択する
4.  `Q`キーを押す
5.  パレットが画面からはみ出ないこと
6.  パレットの左右に1pxずつ隙間ができること

### パレットは画面からはみ出ない

#### 下

1.  Termモードにする
2.  一番下の行のEntityを選択する
3.  `Q`キーを押す
4.  パレットが画面からはみ出ないこと

#### 右

1.  Termモードにする
2.  右端ギリギリのEntityを選択する
3.  `Q`キーを押す
4.  パレットが画面からはみ出ないこと

### パレットはドラッグできる

1.  Termモードにする
2.  Entityを選択する
3.  `Q`キーを押す
4.  パレットがドラッグアンドドロップで移動できること

## Attributeの追加

### 背景

1.  5.0.0でAttitudeを追加しました
2.  5.2.0 でショートカットキーTを廃止しました
3.  5.2.3 で編集ダイアログの編集機能は廃止され、パレットを開くボタンに代わりました
4.  6.2.71 でBlockモードでパレットが開けるようになりました
5.  6.2.79で でBlockモードで、ショートカットキー1~9でAttributeの追加ができるようになりました

### -- 手段 --

#### BlockEntityにパレットからAttributeを追加

1.  Editor1を選択
2.  Blockモードにする
3.  BlockEntityを選択する
4.  パレットを開く
5.  denoteタブを選択する
6.  `Add to selected entity`ボタンを押す
7.  Attributeが追加されること

#### BlockEntityにパレットからAttributeを追加

1.  Editor1を選択
2.  Blockモードにする
3.  BlockEntityを選択する
4.  パレットを開く
5.  denoteタブを選択する
6.  `Add to selected entity`ボタンを押す
7.  Attributeが追加されること

#### BlockEntityにショートカットキーからAttributeを追加

1.  Editor1を選択
2.  Blockモードにする
3.  BlockEntityを選択する
4.  1キーを押す
5.  Attributeが追加されること

#### DenotationEntityにパレットからAttributeを追加

1.  Editor1を選択
2.  Termモードにする
3.  DenotationEntityを選択する
4.  パレットを開く
5.  denoteタブを選択する
6.  `Add to selected entity`ボタンを押す
7.  Attributeが追加されること

#### DenotationEntityにパレットからAttributeを追加

1.  Editor1を選択
2.  Termモードにする
3.  DenotationEntityを選択する
4.  パレットを開く
5.  denoteタブを選択する
6.  `Add to selected entity`ボタンを押す
7.  Attributeが追加されること

#### DenotationEntityにショートカットキーからAttributeを追加

1.  Editor1を選択
2.  Termモードにする
3.  DenotationEntityを選択する
4.  1キーを押す
5.  Attributeが追加されること

## Attributeの編集

### 背景

1.  5.0.0で、Attributeを追加するためにのショートカットキーTを追加しました
2.  5.0.2で、1~5のキーで選択中のEntityへ、Attributeを追加、shiftと同時押しで削除するようにしました
3.  5.0.5で、Attributeのショートカットキーを1~9までに増やしました
4.  5.2.0で、AttributeのショートカットキーTを廃止しました
5.  5.2.3 で編集ダイアログの編集機能は廃止され、パレットを開くボタンに代わりました
6.  6.2.71 でBlockモードでパレットが開けるようになりました
7.  6.2.79で でBlockモードで、ショートカットキー1~9でAttributeの追加ができるようになりました

### BlockEntityのAttributeを編集ダイアログから変更

1.  Editor1を選択
2.  Blockモードにする
3.  BlockEntityを選択する
4.  1キーを押す
5.  Attributeが追加されること
6.  Wキーを押す
7.  `Edit`ボタンを押す
8.  パレットが開くこと
9.  denoteタブが選ばれていること

### DenotationEntityのAttributeを編集ダイアログから変更

1.  Editor1を選択
2.  Termモードにする
3.  DenotationEntityを選択する
4.  1キーを押す
5.  Attributeが追加されること
6.  Wキーを押す
7.  `Edit`ボタンを押す
8.  パレットが開くこと
9.  denoteタブが選ばれていること

### BlockEntityのAttributeをショートカットキー操作で変更

1.  Editor1を選択
2.  Blockモードにする
3.  BlockEntityを選択する
4.  1キーを押す、Attributeを追加されること
5.  1キーをもう一度押すと、Value選択用のパレットが表示されること
6.  パレットのValueを押すと、選択中のBlockEntityの該当predicateのAttributeのValueが変更できること

### DenotationEntityのAttributeをショートカットキー操作で変更

1.  Editor1を選択
2.  Termモードにする
3.  DenotationEntityを選択する
4.  1キーを押す、Attributeを追加されること
5.  1キーをもう一度押すと、Value選択用のパレットが表示されること
6.  パレットのValueを押すと、選択中のDenotationEntityの該当predicateのAttributeのValueが変更できること

## Attributeの削除

### 背景

1.  5.0.0で、Attributeを追加するためにのショートカットキーTを追加しました
2.  5.0.2で、1~5のキーで選択中のEntityへ、Attributeを追加、shiftと同時押しで削除するようにしました
3.  5.0.5で、Attributeのショートカットキーを1~9までに増やしました
4.  5.2.0で、AttributeのショートカットキーTを廃止しました
5.  5.2.3 で編集ダイアログの編集機能は廃止され、パレットを開くボタンに代わりました
6.  6.2.71 でBlockモードでパレットが開けるようになりました
7.  6.2.79で でBlockモードで、ショートカットキー1~9でAttributeの追加ができるようになりました

### 編集ダイアログからBlockEntityのAttributeを削除する

1.  Termモードにする
2.  BlockEntityを選択する
3.  1キーを押す
4.  Attributeが追加されること
5.  Wキーを押す
6.  `Remove`ボタンを押す
7.  `OK`ボタンを押す
8.  選択中のBlockEntityの該当predicateのAttributeが削除されること

### 編集ダイアログからDenotationEntityのAttributeを削除する

1.  Termモードにする
2.  DenotationEntityを選択する
3.  1キーを押す
4.  Attributeが追加されること
5.  Wキーを押す
6.  `Remove`ボタンを押す
7.  `OK`ボタンを押す
8.  選択中のDenotationEntityの該当predicateのAttributeが削除されること

### パレットからBlockEntityのAttributeを削除する

1.  Editor1を選択
2.  Blockモードにする
3.  BlockEntityを選択する
4.  1キーを押す、Attributeを追加させること
5.  1キーをもう一度押すと、Value選択用のパレットが表示されること
6.  パレットの`Remove from selected entity`ボタンを押すと、選択中のBlockEntityの該当predicateのAttributeが削除されること

### パレットからDenotationEntityのAttributeを削除する

1.  Editor1を選択
2.  Termモードにする
3.  DenotationEntityを選択する
4.  1キーを押す、Attributeを追加させること
5.  1キーをもう一度押すと、Value選択用のパレットが表示されること
6.  パレットの`Remove from selected entity`ボタンを押すと、選択中のDenotationEntityの該当predicateのAttributeが削除されること

### ショートカットでBlockEntityのAttributeを削除する

1.  Editor1を選択
2.  Blockモードにする
3.  BlockEntityを選択する
4.  1キーを押す、Attributeを追加させること
5.  Shiftを押しながら1キーを押すと、選択中のEntityの該当predicateのAttributeが削除されること
6.  Tキーを押しても何も起きないこと

### ショートカットでDenotationEntityのAttributeを削除する

1.  Editor1を選択
2.  Termモードにする
3.  DenotationEntityを選択する
4.  1キーを押す、Attributeを追加させること
5.  Shiftを押しながら1キーを押すと、選択中のEntityの該当predicateのAttributeが削除されること
6.  Tキーを押しても何も起きないこと

## BlockEntityの色とラベル

### 背景

1.  6.2.0からブロック機能を追加
2.  6.2.78からブロックのType定義の色とラベルをBlockEntityに反映します

### -- 手段 --

1.  Editor1を選択
2.  `block1`のラベルの背景色が赤系であること
3.  `block1`のラベルの文言が`Label of block1`であること

## エンティティパレットの左右キーでアトリビュートタブを切り替える

### Blockモード

#### 背景

1.  6.2.77でBlockモードに対応しました

#### -- 手段 --

1.  Editor1を選択
2.  Blockモードにする
3.  パレットを開く
4.  右キーを押す
5.  アトリビュートタブが切り替わること

### アトリビュートがないとき

#### 背景

1.  5.2.0から左右キーでタブを切り替えられるようにしました
2.  アトリビュート定義がないときに、エンティティパレットを開いて右キーを押すとエラーが起きました
3.  6.2.70で対応しました

#### -- 手段 --

1.  Editor0を選択
2.  パレットを開く
3.  右キーを押す
4.  エラーが起きないこと

## Type定義の編集

### パレットに表示している、インスタンスの情報から取得した型のラベルを変更

#### 背景

1.  パレットにはconfig上にType定義がなくても、インスタンスのTypeを表示します
2.  ユーザーの操作としては、既存のType定義の編集にみえますが、TypeDefinition上は新しいType定義の追加操作です
3.  これを勘違いして常に既存Type定義の編集として実装し、エラーが起きていました
4.  6.1.51で、変更後のIDを変更前のID上書きしないために、IDのマージをなくす修正をしました。
5.  ラベル変更時に、新しく追加する型情報にIDがないと、Mapのkeyがundefinedになりエラーが起きました。
6.  6.2.5で、IDはマージするが上書きしない対応をしました。

#### -- 手段 --

1.  Editor0を選択
2.  Relationモードにする
3.  `Select Label [Q]`ボタンをクリックする
4.  `Edit this type`ボタンをクリックする
5.  `Label`欄を変更する
6.  `OK`ボタンを押す
7.  エラーがおきないこと

### パレットに表示している、インスタンスの情報から取得した型のIDを変更

#### 背景

1.  5.0.0でパレットにインスタンスの情報から取得した型を表示している
2.  この種の型のIDを変更したときに、追加される型のIDが変更前の値であるバグがありました
3.  同時にインスタンスのIDは変更しているため、パレット上には型が増えたように見えていました
4.  6.1.51で対応

#### -- 手段 --

1.  Editor0を選択
2.  Relationモードにする
3.  `Select Label [Q]`ボタンをクリックする
4.  `Edit this type`ボタンをクリックする
5.  `Id`欄を変更する
6.  `OK`ボタンを押す
7.  既存の型定義のidが更新されれるだけで、新しい型定義が増えないこと

## ダイアログを開いているときにEditorをクリックしてもパレットを閉じない

### 背景

1.  jQueryUIダイアログを開いた時に表示されるベールをクリックすると、Editor外を選択したと判定してEditorの選択を解除していました
2.  jQueryUIダイアログは閉じた時に、ダイアログを開いたときに選択していた要素を選択し直す機能があります。このため一見わかりません
3.  パレットはエディタの選択が解除された時点で、閉じます。
4.  ベールが表示されているのに、その下にあるものが操作できるように見えます。これに違和感があります
5.  5.0.0で、jQueryUIダイアログのベールをクリックイベントを無視する対応しました

### -- 手段 --

1.  `Select Label [Q]`ボタンをクリックする
2.  パレットが開くこと
3.  アノテーション読込みダイアログを開く
4.  ベールをクリックする
5.  パレットが閉じないこと

## パレットを開いて、Editorを選択解除するとパレットが閉じる

1.  Editorをクリックする
2.  Editorが選択されていること（背景色がベージュ）
3.  Termモードにする
4.  Entityを選択する
5.  `Select Label [Q]`ボタンをクリックする
6.  パレットがボタンの近くに開くこと
7.  一番上のinputをクリックする
8.  Editorが選択解除されること（背景色が白）
9.  パレットが閉じること

## Bodyクリックでパレットが閉じる

### 背景

1.  6.1.30 でBodyクリックでtext-boxクリックイベントを分けたときに、text-boxクリックイベントをわけました。
2.  Bodyクリックイベントは、コントロールバーの右の領域で発火し、その他の行間ではtext-boxクリックイベントが発火します。
3.  text-boxクリックイベントにパレットを閉じる処理を移動しなかったため、パレットが閉じなくなりましt。
4.  6.1.60 でBodyクリックイベントとtext-boxクリックイベントの両方でパレットを閉じるようにしました。
5.  6.2.75 でBlockモードに対応しました

### -- 手段 --

### Termモード

1.  Termモードにする
2.  `Select Label [Q]`ボタンをクリックする
3.  パレットが開くこと
4.  行間をクリックする
5.  パレットが閉じること

### Blockモード

1.  Blockモードにする
2.  `Select Label [Q]`ボタンをクリックする
3.  パレットが開くこと
4.  行間をクリックする
5.  パレットが閉じること

### Relationモード

1.  Relationモードにする
2.  `Select Label [Q]`ボタンをクリックする
3.  パレットが開くこと
4.  行間をクリックする
5.  パレットが閉じること

## パレットを開きながらモードを変更したときに選択解除

### 背景

1.  Bodyクリック時は選択解除するときにパレットが開いていると選択解除しません。
2.  モード変更時も、パレットが開いていると選択解除していませんでした。
3.  モード変更時は、パレットを閉じるのと、選択解除を両方実行するようにしました。
4.  6.1.61 で対応しました。

### -- 手段 --

1.  Entityを選択する
2.  パレットを開く
3.  モードを変更する
4.  Entityが選択解除されること
5.  パレットが閉じること

## Aキーを押してエラーが起きない

### 背景

1.  6.1.5で、Commanderをオブジェクトからクラスに変更したときに、メソッド呼び出しの修正もれで、メソッドにレシバーが渡せず、エラーが起きるようになりました
2.  6.2.73 で対応しました

### -- 手段 --

1.  `A`キーを押す
2.  エラーが起きないこと

## Selection AttributeのValueの編集

### Selection AttributeのValueのid変更

#### 背景

1.  5.2.0 からEntityパレットでSelection AttributeのValueが編集出来るようになりました。
2.  Selection Attribute定義のvalueのidを変更したときに、annotation上のAttributeのobjの値を更新していなかったため、Attribute定義とannotation上のAttributeの情報が乖離するバグがありました。
3.  6.0.6 で対応しました。
4.  6.2.66 でChangeAttributeCommandのプロパティ名を変更時の修正もれでエラーがおきました。
5.  6.2.72 で対応しました

#### -- 手段 --

1.  Editor1を選択
2.  パレットを開く
3.  `denote`タブを選択
4.  `Cell`のEdit Valueボタンをクリック
5.  `id`を変更して`OK`をクリック
6.  エンティティ`E1:a:b`のAttributeの値が変更されること
7.  すべてもどす
8.  すべてやり直す

### Selection AttributeのValueが唯一のときは、削除不可

#### 背景

1.  Selection AttributeのValueをすべて消そうとするとエラーが起きます
2.  6.1.57 で対応しました。

#### -- 手段 --

1.  Editor1を選択
2.  Termモードにする
3.  `Select Label [Q]`ボタンをクリックする
4.  `selection`タブを選択
5.  `default`の`Remove this value.`ボタンが無効なこと
6.  `Add new value`ボタンをクリックする
7.  `id`欄を入力する
8.  `OK`ボタンを押す
9.  `default`の`Remove this value.`ボタンが有効になること
10. 追加したValueの`Remove this value.`ボタンがクリックする
11. `default`の`Remove this value.`ボタンが無効になること

### Selection AttributeのValueがannotation上で使われているときは、削除不可

#### 背景

1.  5.2.0 からEntityパレットでSelection AttributeのValueが編集出来るようになりました。
2.  Selection Attribute定義のvalueがannotation上で使われているときは、削除不可になります。
3.  削除ボタンは見た目上無効になっているだけで、押せば動きました。
4.  6.0.6 で対応しました。

#### -- 手段 --

1.  Editor1を選択
2.  Termモードにする
3.  `Select Label [Q]`ボタンをクリックする
4.  `denote`タブを選択
5.  `Add new value`ボタンをクリックする
6.  `id`欄を入力する
7.  `default`欄にチェックを入れる
8.  `label`欄を入力する
9.  `color`欄を入力する
10. `OK`ボタンを押す
11. パレットに追加したValueが表示されること
12. 削除ボタンが有効であること
13. Entityを選択肢、denote attributeを追加する
14. Valueが入力した値であること
15. ラベルが入力した値であること
16. 背景色が入力した値であること
17. 追加したValueの`Remove this value.`ボタンが無効になること
18. 実際に`Remove this value.`ボタンを押しても無反応であること
19. denote attributeをもつEntityを削除する
20. 追加したValueの`Remove this value.`ボタンが有効になること
21. 追加したValueの`Remove this value.`ボタンがクリックする
22. 追加したValueが削除されること
23. すべてもどす
24. すべてやり直す

### Selection AttributeのValueのlabel、color変更

#### 背景

1.  5.2.0 からEntityパレットでSelection AttributeのValueが編集出来るようになりました。

#### -- 手段 --

1.  Editor1を選択
2.  Termモードにする
3.  `Select Label [Q]`ボタンをクリックする
4.  `denote`タブを選択
5.  `Cell`の`Edit this value`ボタンをクリックする
6.  `label`欄を変更する
7.  `color`欄を変更する
8.  `OK`ボタンを押す
9.  パレットのValueの値が更新されるここと
10. エンティティ`E1:a:b`のAttributeのラベルと色が更新されるここと
11. すべてもどす
12. すべてやり直す

## DenotationEntityのType定義の編集

### 背景

1.  5.0.0でTypeの編集機能にラベル変更とカラー変更を追加しました

### DenotationEntityのType定義を追加

1.  Termモードにする
2.  `Select Label [Q]`ボタンをクリックする
3.  `Add new type`ボタンをクリックする
4.  `Id`欄を入力する
5.  `Label`欄を入力する
6.  `Color`欄を変更する
7.  `Default Type`を選択する
8.  `OK`ボタンを押す
9.  パレットに追加したTypeが表示されること
10. Typeの使用数が0であること
11. 削除ボタンが有効であること
12. 新しくSpanを作る
13. DenotationEntityのラベルが`Label`欄の文字列になること
14. すべてもどす
15. 追加したTypeが消えること

### DenotationEntityのType定義を変更

1.  Termモードにする
2.  `Select Label [Q]`ボタンをクリックする
3.  `Edit this type`ボタンをクリックする
4.  `Id`欄を変更する
5.  `Label`欄を変更する
6.  `Color`欄を変更する
7.  `Default Type`を選択する
8.  `OK`ボタンを押す
9.  DenotationEntityのラベルが`Label`欄の文字列になること
10. 新しくSpanを作る
11. Entityのラベルが`Label`欄の文字列になること
12. すべてもどす
13. 変更したTypeがもとにもどること

### DenotationEntityのType定義を削除

1.  Termモードにする
2.  `Select Label [Q]`ボタンをクリックする
3.  `Remove this type`ボタンをクリックする
4.  Typeが行ごと消えること
5.  すべてもどす
6.  変更したTypeがもとにもどること

## BlockEntityのType定義の編集

### 背景

1.  6.2.71 でBlockモードでパレットが開けるようになりました

### BlockEntityのType定義を追加

1.  Blockモードにする
2.  `Select Label [Q]`ボタンをクリックする
3.  `Add new type`ボタンをクリックする
4.  `Id`欄を入力する
5.  `Label`欄を入力する
6.  `Color`欄を変更する
7.  `Default Type`を選択する
8.  `OK`ボタンを押す
9.  パレットに追加したTypeが表示されること
10. Typeの使用数が0であること
11. 削除ボタンが有効であること
12. 新しくSpanを作る
13. BlockEntityのラベルが`Label`欄の文字列になること
14. すべてもどす
15. 追加したTypeが消えること

### BlockEntityのType定義を変更

1.  Blockモードにする
2.  `Select Label [Q]`ボタンをクリックする
3.  `Edit this type`ボタンをクリックする
4.  `Id`欄を変更する
5.  `Label`欄を変更する
6.  `Color`欄を変更する
7.  `Default Type`を選択する
8.  `OK`ボタンを押す
9.  BlockEntityのラベルが`Label`欄の文字列になること
10. 新しくSpanを作る
11. Entityのラベルが`Label`欄の文字列になること
12. すべてもどす
13. 変更したTypeがもとにもどること

### BlockEntityのType定義を削除

1.  Blockモードにする
2.  `Select Label [Q]`ボタンをクリックする
3.  `Remove this type`ボタンをクリックする
4.  Typeが行ごと消えること
5.  すべてもどす
6.  変更したTypeがもとにもどること

## RelationのType定義の編集

### RelationのType定義を追加

1.  Relationモードにする
2.  `Select Label [Q]`ボタンをクリックする
3.  `Add new type`ボタンをクリックする
4.  `Id`欄を入力する
5.  `Label`欄を入力する
6.  `Color`欄を変更する
7.  `Default Type`を選択する
8.  `OK`ボタンを押す
9.  パレットに追加したTypeが表示されること
10. Typeの使用数が0であること
11. 削除ボタンが有効であること
12. 新しくRelationを作る
13. RelationのラベルがRelation IDと`Id`欄の文字列になること
14. すべてもどす
15. 追加したTypeが消えること

### RelationのType定義を変更

1.  Relationモードにする
2.  `Select Label [Q]`ボタンをクリックする
3.  `Edit this type`ボタンをクリックする
4.  `Id`欄を変更する
5.  `Label`欄を変更する
6.  `Color`欄を変更する
7.  `Default Type`を選択する
8.  `OK`ボタンを押す
9.  コントロールバーの`Upload`ボタンに星マークがつくこと
10. RelationのラベルがRelation IDと`Id`欄の文字列になること
11. 新しくRelationを作る
12. RelationのラベルがRelation IDと`Id`欄の文字列になること
13. すべてもどす
14. 変更したTypeがもとにもどること

### RelationのType定義を削除

1.  Relationモードにする
2.  `Select Label [Q]`ボタンをクリックする
3.  `Add new type`ボタンをクリックする
4.  `Id`欄を入力する
5.  `Label`欄を入力する
6.  `Color`欄を変更する
7.  `Default Type`を選択する
8.  `OK`ボタンを押す
9.  追加したTypeの`Remove this type`ボタンをクリックする
10. Typeが行ごと消えること
11. すべてもどす

## String AttributeのValueの編集

### 背景

1.  5.2.0 からEntityパレットでString AttributeのValueが編集出来るようになりました。

### String AttributeのValueの追加、編集、削除

1.  Editor1を選択
2.  Termモードにする
3.  `Select Label [Q]`ボタンをクリックする
4.  `free_text_predicate`タブを選択
5.  `Add new value`ボタンをクリックする
6.  `pattern`欄に`abc`を入力する
7.  `label`欄を入力する
8.  `color`欄を入力する
9.  `OK`ボタンを押す
10. パレットに追加したValueが表示されること
11. 削除ボタンが有効であること
12. 新しくfree_text_predicate attributeを作る
13. ラベルがDown the Rabbit Holeであること
14. 背景色が水色であること
15. 追加したValueの`Edit this value.`ボタンをクリックする
16. `pattern`欄に`a`を入力する
17. パレットのValueの値が更新されるここと
18. free_text_predicate attributeのラベルと色が更新されるここと
19. 追加したValueの`Remove this value.`ボタンがクリックする
20. 追加したValueが削除されること
21. free_text_predicate attributeのラベルがDown the Rabbit Holeになること
22. free_text_predicate attributeの背景色が水色になること
23. すべてもどす
24. すべてやり直す

## Firefox用

### Spanを縮めて消したときに右のSpanを選択

#### 背景

1.  spanのmouseupイベントで、Spanを縮める、Spanを消した際は右のSpanを選択しています。
2.  Firefoxでは、spanのmouseupイベントの後で、text-boxのclickイベントを発火します。
3.  パラグラフでspanのmouseupイベントに起因する、clickイベントを止めて、パラグラフマージンで、行間へのクリックを別々に拾っていまいさt。
4.  6.0.0でパラグラフのレンダリングを消した際に、clickイベントをtext-boxだけで拾うことにしました。
5.  これによって、テキスト上をクリックした際に、選択を解除できるようになりました。
6.  一方でFilefoxでは、Spanを縮めて消したときに、選択した右のSpanを、選択解除するようになっていました。
7.  6.1.30で、spanのmouseupイベント発生時に一瞬だけフラグを立てて、text-boxのclickイベントをフィルターして、対応しました。

#### -- 手段 --

1.  Editor0を選択
2.  最初のSpanを縮めて消す
3.  右のSpanが選択されること

### パレットのアイコン

#### 背景

1.  5.0.0でType定義の編集機能を追加しました
2.  編集機能用のアイコンのボタンのデフォルトスタイルが、Firefoxで異なるため、パレットのレイアウトが崩れていました。

#### -- 手段 --

1.  Editor1を選択
2.  Termモードにする
3.  `Select Label [Q]`ボタンをクリックする
4.  パレットの操作アイコンが1行で表示されること

### コンテキストメニュー

#### 背景

1.  5.0.0の開発中にFirefoxで、マウスの右ボタンを押下するとコンテキストメニューが開き、放すと閉じるバグがありました。
2.  Firefoxではマウスの右クリックでclickイベントが発火します。
3.  MouseEventのFirefoxの独自プロパティ`which`を使って、クリックしたボタンを判別し、右クリックの時はコンテキストメニューを閉じません。

#### -- 手段 --

1.  FirefoxでEditorを開く
2.  マウスの右ボタンを押下する
3.  コンテキストメニューが表示されること
4.  マウスの右ボタンを放す
5.  コンテキストメニューが表示されたままであること

## Numeric AttributeのValueの編集

### 背景

1.  5.2.0 からEntityパレットでNumeric AttributeのValueが編集出来るようになりました。
2.  6.1.62 でAttributeのValue編集でエラー発生
3.  6.2.69 で対応

### Numeric AttributeのValueの追加、編集、削除

1.  Editor1を選択
2.  Termモードにする
3.  `Select Label [Q]`ボタンをクリックする
4.  `score`タブを選択
5.  `Add new value`ボタンをクリックする
6.  `range`欄に`[0.6`を入力する
7.  `label`欄を入力する
8.  `color`欄を入力する
9.  `OK`ボタンを押す
10. パレットに追加したValueが表示されること
11. 削除ボタンが有効であること
12. 新しくscore attributeを作る
13. ラベルがMiddleであること
14. 背景色が緑であること
15. Objectを0.6にする
16. ラベルが入力した値であること
17. 背景色が入力した値であること
18. 追加したValueの`Edit this value`ボタンをクリックする
19. `range`欄に`[0.7`を入力する
20. パレットのValueの値が更新されるここと
21. score attributeのラベルがMiddleに更新されること
22. score attributeの背景色が緑に更新されること
23. 追加したValueの`Remove this value.`ボタンがクリックする
24. 追加したValueが削除されること
25. すべてもどす
26. すべてやり直す

## コンフィグレーションをUNDO/REDOしたときにトーストを表示

### 背景

1.  5.2.0 からコンフィグレーションのUNDO/REDO実行時にトーストを表示します

### -- 手段 --

1.  Type定義を変更する
2.  UNDOする
3.  緑色のトーストが表示されること
4.  REDOする
5.  緑色のトーストが表示されること

## コンフィグレーションに変更があるときは保存ボタンに星マークを表示

### 背景

1.  5.0.0 でコンフィグレーションの保存機能を追加しました

### -- 手段 --

1.  editor0を選択
2.  Settingダイアログで`Lock Edit Config`のチェックを外す
3.  `Select Label [Q]`ボタンをクリックする
4.  コンフィグレーション保存ボタンに星マークがついていること
5.  Localに保存する
6.  コンフィグレーション保存ボタンに星マークが消えること
7.  Type定義を変更する
8.  コンフィグレーション保存ボタンに星マークがついていること
9.  UNDOする
10. コンフィグレーション保存ボタンに星マークが消えること
11. REDOする
12. コンフィグレーション保存ボタンに星マークがついていること
13. Localに保存する
14. コンフィグレーション保存ボタンに星マークが消えること

## 実用的なannotationを開く

1.  <http://pubannotation.org/projects/genia-medco-coref/docs/sourcedb/PubMed/sourceid/10022882/annotations.json>

## DenotationEntity編集ダイアログ

### 背景

1.  5.0.0 からAttributeが追加されました。
2.  Typeは`Predicate`が`type`になりました。
3.  Typeの`id`は`Value`に呼び方が変りました。

#### Change Label[W]ボタン

1.  Termモードにする
2.  DenotationEntityを選択する
3.  `Change Label[W]`ボタンを押す
4.  編集ダイアログが開くこと
5.  ダイアログのタイトルが`Please edit type and attributes`であること
6.  `Predicate`欄に`type`が表示されること
7.  `Value`欄に選択したDenotationEntityのTypeのidが表示されること
8.  選択したDenotationEntityのAttributeのPredicateとValueが表示されること

#### Wキー

1.  Termモードにする
2.  DenotationEntityを選択する
3.  `W`キーを押す
4.  編集ダイアログが開くこと

#### コンテキストメニュー

1.  Termモードにする
2.  DenotationEntityを選択する
3.  右クリックする
4.  コンテキストメニューが開くこと
5.  コンテキストメニューの
6.  `Change Label[W]`ボタンを押す
7.  編集ダイアログが開くこと

### 複数DenotationEntity選択時は最初のTypeと最初のAttributeを表示すること

#### 背景

1.  どの要素のTypeを表示すればいいのかわからないので
2.  5.0.0 でAttribute編集を追加した際に、全部消してしまうと再入力が大変すぎるので、なるべく残すようにしました。

#### -- 手段 --

1.  Termモードにする
2.  複数DenotationEntityを選択する
3.  Typeを編集する
4.  Value欄に最初のTypeのValueが表示されること
5.  すべてのAttributeのPredicateが表示されること
6.  AttributeのPredicateが重複した際は、最初のValueが表示されること

### 編集確定

#### OKボタン

1.  Termモードにする
2.  DenotationEntityを選択する
3.  `W`キーを押す
4.  編集ダイアログが開くこと
5.  文字を変更する
6.  `OK`ボタンを押す
7.  DenotationEntityのidが変わること

#### Enterキー

1.  Termモードにする
2.  DenotationEntityを選択する
3.  `W`キーを押す
4.  編集ダイアログが開くこと
5.  文字を変更する
6.  `Enter`キーを押す
7.  DenotationEntityのidが変わること

### 編集キャンセル

#### 閉じるボタン

1.  Termモードにする
2.  DenotationEntityを選択する
3.  `W`キーを押す
4.  編集ダイアログが開くこと
5.  文字を変更する
6.  `X`ボタンを押す
7.  DenotationEntityのidが変わらないこと

#### Escキー

1.  Termモードにする
2.  DenotationEntityを選択する
3.  `W`キーを押す
4.  編集ダイアログが開くこと
5.  文字を変更する
6.  `Esc`キーを押す
7.  DenotationEntityのidが変わらないこと

## BlockEntity編集ダイアログ

### 背景

1.  6.2.64で対応しました

#### Change Label[W]ボタン

1.  Blockモードにする
2.  BlockEntityを選択する
3.  `Change Label[W]`ボタンを押す
4.  編集ダイアログが開くこと
5.  ダイアログのタイトルが`Please edit type and attributes`であること
6.  `Predicate`欄に`type`が表示されること
7.  `Value`欄に選択したBlockEntityのTypeのidが表示されること

#### Wキー

1.  Blockモードにする
2.  BlockEntityを選択する
3.  `W`キーを押す
4.  編集ダイアログが開くこと

#### コンテキストメニュー

1.  Blockモードにする
2.  BlockEntityを選択する
3.  右クリックする
4.  コンテキストメニューが開くこと
5.  コンテキストメニューの
6.  `Change Label[W]`ボタンを押す
7.  編集ダイアログが開くこと

### 複数BlockEntity選択時は最初のTypeを表示すること

1.  Blockモードにする
2.  複数BlockEntityを選択する
3.  Typeを編集する
4.  Value欄に最初のTypeのValueが表示されること

### 編集確定

#### OKボタン

1.  Blockモードにする
2.  BlockEntityを選択する
3.  `W`キーを押す
4.  編集ダイアログが開くこと
5.  文字を変更する
6.  `OK`ボタンを押す
7.  BlockEntityのidが変わること

#### Enterキー

1.  Blockモードにする
2.  BlockEntityを選択する
3.  `W`キーを押す
4.  編集ダイアログが開くこと
5.  文字を変更する
6.  `Enter`キーを押す
7.  BlockEntityのidが変わること

### 編集キャンセル

#### 閉じるボタン

1.  Blockモードにする
2.  BlockEntityを選択する
3.  `W`キーを押す
4.  編集ダイアログが開くこと
5.  文字を変更する
6.  `X`ボタンを押す
7.  BlockEntityのidが変わらないこと

#### Escキー

1.  Blockモードにする
2.  BlockEntityを選択する
3.  `W`キーを押す
4.  編集ダイアログが開くこと
5.  文字を変更する
6.  `Esc`キーを押す
7.  BlockEntityのidが変わらないこと

## ビューモードでリレーションのラベルがURLだったときリンクになる

### 背景

1.  以前から対応していました
2.  6.2.0でブロック機能を追加
3.  6.2.65でブロックモードでリレーションのラベルがURLのときにクリックしてもリンク先を開かなくしました。

### -- 手段 --

1.  Editor1を選択
2.  Viewモードにする
3.  `[R13] SPARQL`をクリック
4.  新しいタブで <https://en.wikipedia.org/wiki/SPARQL> が開くこと
5.  Termモードにする
6.  `[R13] SPARQL`をクリック
7.  新しいタブで <https://en.wikipedia.org/wiki/SPARQL> が開かないこと
8.  Blockモードにする
9.  `[R13] SPARQL`をクリック
10. 新しいタブで <https://en.wikipedia.org/wiki/SPARQL> が開かないこと
11. Relationモードにする
12. `[R13] SPARQL`をクリック
13. 新しいタブで <https://en.wikipedia.org/wiki/SPARQL> が開かないこと

## コンフィグレーション読み込み

### URLが指定されていなければOpenボタンを押せない

1.  editor1を選択
2.  `Select Label [Q]`ボタンをクリックする
3.  コンフィグレーション読み込みダイアログを開く
4.  URLが空の時は`Open`ボタンは無効
5.  Localのファイルが選択されていない時は`Open`ボタンは無効

### 必須プロパティのないAttributes定義を読み込んだらエラーをalertify.jsで表示

#### 背景

1.  5.0.0 で、EntityとTypeの定義を書いたコンフィグレーションを動的に（htmlのconfig属性以外の方法で）読み込みできるようになりました。
2.  5.0.2 で、configのJSON schemeを使ったバリデーションを追加しました。
3.  5.3.3 から、config中のAttribute定義に必須プロパティが無いときに、アラートにpredとプロパティ名を表示します。
4.  5.3.5 から、config中のSelectionAttribute定義にvaluesプロパティが無いときに、自動生成するようになりました。

#### -- 手段 --

1.  `Select Label [Q]`ボタンをクリックする
2.  コンフィグレーション読み込みダイアログを開く
3.  `invalid_attributes_config.json`を読み込む
4.  右上に`Invalid configuration: The attribute type whose predicate is 'category' misses a mandatory property, 'default'.`と赤色のトースト表示がされること

### JSONでないファイルをサーバーから読み込んだらエラーをalertify.jsで表示

#### 背景

1.  5.0.0の開発中にエラーが起きていました
2.  5.0.0 で対応
3.  5.3.0 で再びエラーになりました
4.  5.3.4 で対応

#### -- 手段 --

1.  editor1を選択
2.  `Select Label [Q]`ボタンをクリックする
3.  コンフィグレーション読み込みダイアログを開く
4.  URL欄に`development.html`を入力し、`Open`ボタンを押して、サーバーから読み込む
5.  右上に`http://localhost:8000/dist/demo/development.html is not a configuration file or its format is invalid.`と赤色のトースト表示がされること

### JSONでないファイルをファイルから読み込んだらエラーをalertify.jsで表示

#### 背景

1.  editor1を選択
2.  `Select Label [Q]`ボタンをクリックする
3.  コンフィグレーション読み込みダイアログを開く
4.  エラーが起きていました
5.  5.0.0 で対応
6.  5.3.0 でアラートを表示せずに、configを初期化するようになりました
7.  5.3.4 で対応

#### -- 手段 --

1.  適当なjsonでもtextでもないファイルを読み込む
2.  右上に`ファイル名(local file) is not a configuration file or its format is invalid.`と赤色のトースト表示がされること

## BlockSpanを選択したときに自動的にBlockEntityを選択

### 背景

1.  6.2.0からブロック機能を追加
2.  BlockSpanはBlockEntityをただひとつ持つので、別々に選択する必要がありません
3.  6.2.59で導入

### −− 手段 --

1.  Blockモードにする
2.  BlockSpanを選択する
3.  BlockEntityが選択されること
4.  BlockEntityを選択する
5.  BlockSpanが選択されること

## BlockSpan選択時のコントロールバーの見た目の変化

### 背景

1.  6.2.0からブロック機能を追加
2.  6.2.51で、`Add new entity[E]`, `Copy [C]`, `Cut [X]`が有効にならないようにしました
3.  6.2.52で、`Replicate span annotation [R]`が有効にならないようにしました

### −− 手段 --

1.  Blockモードにする
2.  BlockSpanを選択する
3.  コントロールバーの`Delete [D]`アイコンが有効になること

## 作成して自動選択したSpanと他のSpanをshiftを押して範囲選択

### 背景

1.  作成して自動選択したSpanと他のSpanをshiftを押して範囲選択すると、Selection.typeが`None`になります
2.  `Caret`のみ対応していたため、作成して自動選択したSpanと他のSpanをshiftを押して範囲選択できませんでした
3.  作成して自動選択したSpanを一度選択解除して、選択しなおせば、他のSpanをshiftを押して範囲選択可能です
4.  6.2.57でBlockSpanに対応しました
5.  6.2.58でDenotationSpanに対応しました

### -- 手段 --

1.  Termモードにする
2.  DenotationSpanを作成する
3.  Shiftを押しながら他のDenotationSpanを選択する
4.  両端を含む、間のDenotationSpanが選択されること
5.  Blockモードにする
6.  BlockSpanを作成する
7.  Shiftを押しながら他のBlockSpanを選択する
8.  両端を含む、間のBlockSpanが選択されること

## shiftを押してSpanを範囲選択

### 背景

1.  6.0.0でテキスト中の改行のレンダリングをパラグラフから、cssの`white-space: pre-wrap;`に変更しました
2.  6.1.0で折返し可能なBlock Spanを廃止しました。

### -- 手段 --

1.  Termモードにする
2.  Spanを1つ選ぶ
3.  2つ以上のSpanを選んでいると、最後に選んだSpanだけが選択される
4.  shiftを押しながら２つ以上離れたSpanを選ぶ
5.  両端を含む、間のSpanが選択される
6.  Spanの他にEntityを選択していても選ばれること

## 必須プロパティのないAttributes定義をふくむAnnotationファイルを読み込んだらエラーをalertify.jsで表示

### 背景

1.  5.3.3 から、config中のAttribute定義に必須プロパティが無いときに、アラートにpredとプロパティ名を表示します。

### -- 手段 --

1.  読込みダイアログを表示
2.  URL欄に`invalid_attributes_annotation.json`を入力
3.  `Open`ボタンをクリック
4.  赤いトーストが表示されること
5.  右上に`Invalid configuration: The attribute type whose predicate is 'rate' misses a mandatory property, 'default'.`と赤色のトースト表示がされること

## 左右キーで選択Spanを変更

### -- 手段 --

1.  Spanを選択する
2.  `左キー`を押す
3.  左隣のSpanが選択されること
4.  `右キー`を押す
5.  右隣のSpanが選択されること

### 左右キーで端っこより先に選択を変更できない

#### Termモード

1.  先頭のSpanを選択する
2.  `左キー`を押す
3.  選択するSpanが変わらないこと
4.  最後のSpanを選択する
5.  `右キー`を押す
6.  選択するSpanが変わらないこと

#### Simpleモード

1.  先頭のSpanを選択する
2.  `左キー`を押す
3.  選択するSpanが変わらないこと
4.  最後のSpanを選択する
5.  `右キー`を押す
6.  選択するSpanが変わらないこと

## BlockEntityを選択する

### 背景

1.  6.2.0からブロック機能を追加
2.  BlockEntityをTermモードで選択できていましたが、Blockモードでは選択できませんでした。
3.  6.2.54で対応しました。

### -- 手段 --

1.  Termモードにする
2.  BlockEntityのラベルをクリックする
3.  BlockEntityが選択されないこと
4.  Blockモードにする
5.  BlockEntityのラベルをクリックする
6.  BlockEntityが選択されること

## BlockEntityのTypeGap部分をクリックしたらエディタを選択する

### 背景

1.  6.2.0からブロック機能を追加
2.  Termモードにするでは対応していましたが、Blockモードでは対応していませんでした。
3.  6.2.53で対応しました。

### -- 手段 --

1.  Blockモードにする
2.  Editorの選択を解除する（背景色が白くなること）
3.  BlockEntityのTypeGap部分（ラベルの上の空間）をクリックする
4.  Editorが選択され、背景色が紫色になること

## Entity選択時のコントロールバーの見た目の変化

### 背景

1.  5.0.0になるときに、labelの編集機能を追加しました。
2.  `Show label list editor [Q]`ボタンをクリックするとパレットで、labelを編集します。
3.  変更対象を選んでいるかどうかによらず、`Show label list editor [Q]`は常に有効です。
4.  5.3.0で`Add Attributes [T]`を廃止しました
5.  6.0.0でModificationを廃止しました。
6.  6.0.0でカット&ペースト機能を導入しました。
7.  6.1.1でEntity選択時にコントロールバーのアイコンの状態が更新されていませんでした。
8.  6.1.15で修正しました。

### -- 手段 --

1.  Termモードにする
2.  Entityを選択する
3.  コントロールバーの`Change label [W]`アイコンが有効になること
4.  コントロールバーの`Delete [D]`アイコンが有効になること
5.  コントロールバーの`Copy [C]`アイコンが有効になること
6.  コントロールバーの`Cut [X]`アイコンが有効になること

## Relationを選択する

### 背景

1.  5.0.0の開発中に初期表示されているGoogle Chromeでは初期表示しRelationを選択しても太くならないことに気が付きました。
2.  6.0.0でModificationを廃止しました。
3.  Relationの太さは、jsPlumbでpath要素のstroke-width属性を設定していました。上手く反映されないことがあります。
4.  6.0.1で、外部スタイルシートでstroke-widthスタイルを指定してRelationを太くするようにしました。

### 初期表示されているRelation

1.  Relationモードにする
2.  初期表示されているRelationを選択する
3.  Relationは線が太くなる、矢印が大きくなる、ラベルが太字になること
4.  コントロールバーの`Change label [W]`アイコンが有効になること
5.  コントロールバーの`Delete [D]`アイコンが有効になること

### 作成したRelation

1.  Relationモードにする
2.  Relationを作成する
3.  作成したRelationを選択する
4.  Relationは線が太くなる、矢印が大きくなる、ラベルが太字になること
5.  コントロールバーの`Change label [W]`アイコンが有効になること
6.  コントロールバーの`Delete [D]`アイコンが有効になること

## BlockSpanをつくったときにドキュメントの最上部までスクロールしない

### 背景

1.  6.2.0からブロック機能を追加
2.  BlockSpanを作ったとき、同時にBlockEntityを作成し両者を選択します
3.  エンティティを選択する際に、ラベルにフォーカスをあてて、選択しているエンティティをブラウザの表示領域にスクロールインします
4.  BlockEntityを作成する際、位置の基準となるDivの位置がブラウザ上で確定するするのが遅いため、一瞬ドキュメントの最上部に配置されます
5.  このときフォーカスするとブラウザがドキュメントの最上部までスクロールします
6.  6.2.49で、BlockEntityを選択する際に、位置が確定していなければ、確定後にフォーカスする処理をいれ、対応しました

### -- 手段 --

1.  Editor4を選択
2.  Blockモードにする
3.  BlockSpanを追加する
4.  ブラウザがドキュメントの最上部までスクロールしないこと

## BlockモードでStyleSpanでマウスダウンして、BlockSpanを作る

### 背景

1.  6.2.48で対応

### -- 手段 --

1.  Editor1を選択
2.  Blockモードにする
3.  StyleSpanでマウスダウン、テキストでマウスアップ
4.  BlockSpanができること
5.  StyleSpanでマウスダウン、DenotationSpanでマウスアップ
6.  BlockSpanができること
7.  StyleSpanでマウスダウン、StyleSpanでマウスアップ
8.  BlockSpanができること

## BlockモードでDenotationSpanでマウスダウンして、BlockSpanを作る

### 背景

1.  6.2.45で、テキストでのマウスアップに対応
2.  6.2.46で、DenotationSpanでのマウスアップに対応
3.  6.2.47で、StyleSpanでのマウスアップに対応

### -- 手段 --

1.  Editor1を選択
2.  Blockモードにする
3.  DenotationSpanでマウスダウン、テキストでマウスアップ
4.  BlockSpanができること
5.  DenotationSpanでマウスダウン、DenotationSpanでマウスアップ
6.  BlockSpanができること
7.  DenotationSpanでマウスダウン、StyleSpanでマウスアップ
8.  BlockSpanができること

## Blockモードでテキストでマウスダウンして、BlockSpanを作る

### 背景

1.  6.2.0で、テキストでのマウスアップに対応
2.  6.2.43で、StyleSpanでのマウスアップに対応
3.  6.2.44で、DenotationSpanでのマウスアップに対応

### -- 手段 --

1.  Editor1を選択
2.  Blockモードにする
3.  テキストでマウスダウン、テキストでマウスアップ
4.  BlockSpanができること
5.  テキストでマウスダウン、DenotationSpanでマウスアップ
6.  BlockSpanができること
7.  テキストでマウスダウン、StyleSpanでマウスアップ
8.  BlockSpanができること

## BlockモードでStyleSpanをクリックしたら選択解除する

### 背景

1.  6.2.41で対応しました

### -- 手段 --

1.  Blockモードにする
2.  BlockSpanを選択
3.  StyleSpanをクリック
4.  BlockSpanが選択解除されること

## BlockモードでDenotationSpanをクリックしたら選択解除する

### 背景

1.  6.2.42で対応しました

### -- 手段 --

1.  Blockモードにする
2.  BlockSpanを選択
3.  DenotationSpanをクリック
4.  BlockSpanが選択解除されること

## RelationモードでSpanをクリックしたら選択解除する

### 背景

1.  Relationモードでは、text-boxそのもののマウスクリックイベントのみをハンドリングし、text-box内のSpanのマウスクリックイベントをハンドリングしていませんでした
2.  Spanをクリックしたときに選択解除をしていませんでした
3.  6.2.0でBlockを導入してこの動作が目立つようになりました
4.  6.2.33で、text-boxの内の要素をマウスクリックイベントもハンドリングするようにしました

### -- 手段 --

1.  Relationモードにする
2.  Relationを選択
3.  DenotationSpanをクリック
4.  Relationが選択解除されること
5.  Relationを選択
6.  StyleSpanをクリック
7.  Relationが選択解除されること
8.  Entityを選択
9.  BlockSpanをクリック
10. Entityが選択解除されること

## コンテキストメニュー

### 背景

1.  5.0.0でコンテキストメニューを追加しました。

### Entityを選択してコンテキストメニューを開いたときにEntityを選択したままであること

#### 背景

1.  5.0.0の開発中に、右クリックで`mouseup`イベントは発火するため、エディタのbodyをクリックしたと判断してEntityの選択を解除したことがありました。
2.  エディタのbodyがリッスンするイベントを`click`イベント（右クリックでは発火しない、代わりに`contextmenu`イベントが発火する）に変更して対応しました。

#### -- 手段 ---

1.  Entityを選択する
2.  Editor上の何も無いところでマウスの右ボタンを押下する
3.  コンテキストメニューが表示されること
4.  Entityを選択されたままであること

### コンテキストメニュー常に右クリックした座標にひらく

#### 背景

1.  5.0.0の開発中に、コンテキストメニューの開く位置が右クリックしたオブジェクトによって、変わっていました。

#### -- 手段 ---

1.  Editor上の何も無いところでマウスの右ボタンを押下する
2.  ポインターの座標を左上として、コンテキストメニューが表示されること
3.  Editorの文字を上でマウスの右ボタンを押下する
4.  ポインターの座標を左上として、コンテキストメニューが表示されること
5.  Spanの上でマウスの右ボタンを押下する
6.  ポインターの座標を左上として、コンテキストメニューが表示されること
7.  Entityの上でマウスの右ボタンを押下する
8.  ポインターの座標を左上として、コンテキストメニューが表示されること
9.  relationの上でマウスの右ボタンを押下する
10. ポインターの座標を左上として、コンテキストメニューが表示されること
11. コントロールバーの上でマウスの右ボタンを押下する
12. ポインターの座標を左上として、コンテキストメニューが表示されること
13. ステータスバーの上でマウスの右ボタンを押下する
14. ポインターの座標を左上として、コンテキストメニューが表示されること

### コンテキストメニュー上を右クリックすると、クリックした右下にコンテキストメニューがひらく

#### 背景

1.  5.0.0の開発中に、コンテキストメニュー上を右クリックしたときに、クリックした位置ではなくEditorからの相対位置でコンテキストメニューが開いていました。

#### -- 手段 ---

1.  マウスの右ボタンを押下する
2.  コンテキストメニューが表示されること
3.  コンテキストメニュー上を右クリックする
4.  ポインターの座標を左上として、コンテキストメニューが表示されること

### 別Editorをクリックしたらコンテキストメニューを閉じる

#### 背景

1.  5.0.0の開発中に、コンテキストメニューを開いているときに、別のEditorをクリックしたときにコンテキストメニューを閉じる挙動を追加しました。

#### -- 手段 ---

1.  マウスの右ボタンを押下する
2.  コンテキストメニューが表示されること
3.  別のEditorを左クリックする
4.  コンテキストメニューが閉じること
5.  マウスの右ボタンを押下する
6.  コンテキストメニューが表示されること
7.  別のEditorを右クリックする
8.  コンテキストメニューが閉じること

### 左クリックでコンテキストメニューを閉じる

#### 背景

1.  5.0.0の開発中に、コンテキストメニューを開いているときに、コンテキストメニュー以外の場所を左クリックされたしてもコンテキストメニューが閉じないバグがありました。

#### -- 手段 ---

1.  マウスの右ボタンを押下する
2.  コンテキストメニューが表示されること
3.  コンテキストメニュー以外の場所を左クリックする
4.  コンテキストメニューが閉じること

### macOSでコンテキストメニューを開ける

#### 背景

1.  5.0.0の開発中にmacOSで、マウスの右ボタンを押下するとコンテキストメニューが開き、放すと閉じるバグがありました。

#### -- 手段 ---

1.  マウスの右ボタンを押下する
2.  コンテキストメニューが表示されること
3.  マウスの右ボタンを放す
4.  コンテキストメニューが表示されたままであること

## 親子Spanの親子とも左端が画面の左端にある親Spanを選択して、左から縮めたときに、親Spanが縮まること

### 背景

1.  anchorNodeが子Spanで、focusNodeが親Spanのときは必ずanchorNodeのSpan（子Span）を広げる処理をしていました
2.  5.3.2で、focusNode（親Span）が選択されているときは、親Spanを縮める処理にする判定を追加しました

### -- 手段 --

1.  Termモードにする
2.  画面左端から複数の単語をSpanにする
3.  作ったSpan内の左端の単語をSpanにする
4.  親Spanを選択して、左から、子Spanを超えて、縮める
5.  親Spanが縮まること

## Attribute付きのSpanを伸ばす/縮める

### 画面上のAttributeが増えないこと

#### 背景

1.  5.0.0の開発中にAttributeのあるSpanを伸ばしたり縮めると、画面上のAttributeが増えることがありました。
2.  Entityの場合は既にDOMがある場合に二重に描かないチェックを指定していました。
3.  Attributeでは同様のチェックが抜けていました。

#### -- 手段 --

1.  Termモードにする
2.  Spanを作る
3.  Attributeを追加する
4.  Attribute付きのSpanを伸ばす
5.  画面上のAttributeの数が増えないこと
6.  Attribute付きのSpanを縮める
7.  画面上のAttributeの数が増えないこと

### 戻したときにAttributeの表示が消えないこと

#### 背景

1.  5.0.0の開発中に新規追加したAttributeのあるSpanを伸ばしたり縮めたあとに戻すと、Attributeが消えることがありました。

#### -- 手段 --

1.  Termモードにする
2.  Spanを作る
3.  Attributeを追加する
4.  Attribute付きのSpanを伸ばす
5.  戻す
6.  Attributeが消えないこと
7.  Attribute付きのSpanを縮める
8.  戻す
9.  Attributeが消えないこと

## BlockEntityを表示する領域をクリックしたら選択解除する

### 背景

1.  6.2.0ではtext-boxの幅を縮小して、BlockEntityを表示する領域を確保していました
2.  annotation-boxには選択解除用のイベントハンドラーを入れていないため、BlockEntityを表示する領域をクリックしても、選択解除されませんでした
3.  6.2.36で、BlockEntityを表示する領域をtext-boxのpadding-rightで確保するように修正しました。

### -- 手段 --

1.  Termモードにする
2.  Spanを選択する
3.  右端のBlockEntityを表示する領域をクリック
4.  Spanが選択解除されること
5.  Blockモードにする
6.  BlockSpanを選択する
7.  右端のBlockEntityを表示する領域をクリック
8.  BlockSpanが選択解除されること
9.  Relationモードにする
10. Relationを選択する
11. 右端のBlockEntityを表示する領域をクリック
12. Relationが選択解除されること

## リサイズ後もリレーションのラベルクリックでリレーションを選択できる

### 背景

1.  jsPlumbは、リレーションを描画した直後はラベルのクリックイベントをリレーションのクリックイベントとして通知します
2.  リサイズなどでリレーションを書き直したとき、リレーションを描画するSVG要素を作り直したときに、ラベルのクリックイベントを通知しなくなります。
3.  6.1.43で、描画直後の状態だけで、jsPlumbが常にラベルのクリックイベントを通知すると判断して、ラベルへのイベントハンドラー設定をなくしました
4.  6.2.38で、再度ラベルにもイベントハンドラーを設定しました

### -- 手段 --

1.  リレーションモードにする
2.  ブラウザをリサイズして、リレーションを移動する
3.  リレーションのラベルをクリックする
4.  リレーションが選択されること

## Bodyクリックで選択解除

### 背景

1.  6.0.0からSpanになっていないテキストをクリックしたときに選択を解除します
2.  6.2.0からブロック機能を追加
3.  6.2.35でtypesettingsが設定されていて、Spanになっていないテキストのクリックに対応しました

### -- 手段 --

### Termモード

1.  Editor1を選択
2.  Termモードにする
3.  Spanを選択する
4.  行間をクリックする
5.  Spanの選択が解除されること
6.  Entityを選択する
7.  Spanになっていないテキストをクリックする
8.  Entityの選択が解除されること
9.  Entityを選択する
10. SpanになっていないStyleが設定されているテキストをクリックする
11. Entityの選択が解除されること

### Blockモード

1.  Editor1を選択
2.  Blockモードにする
3.  BlockSpanを選択する
4.  行間をクリックする
5.  BlockSpanの選択が解除されること
6.  BlockSpanを選択する
7.  Spanになっていないテキストをクリックする
8.  BlockSpanの選択が解除されること
9.  BlockSpanを選択する

### Relationモード

1.  Relationモードにする
2.  Entityを選択する
3.  行間をクリックする
4.  Entityの選択が解除されること
5.  Relationを選択する
6.  Spanになっていないテキストをクリックする
7.  Relationの選択が解除されること

## editorを選択して、editor外をクリックすると、editorが選択解除される

1.  フォーカスされない要素をclickしても、Editorを選択解除していませんでした
2.  4.4.2からEditor外をclick時に、Editorを選択解除します

### -- 手段 --

1.  Editorをクリックする
2.  Editorが選択されていること（背景色がベージュ）
3.  一番上のinputの横の`Wellcome!`をクリックする
4.  Editorが選択解除されること（背景色が白）

## Editorを選択解除してもSpanとEntityとRelationは選択解除しない

### 背景

1.  4.4.0の開発中に、Editorのfocus out時に、要素の選択解除をしたら、Entityクリック時にEntityが選択できなくなりました
2.  イベントの発生順序がmouse up, focus out, focus inのため、Entity選択後に、選択解除されます
3.  6.2.0からブロック機能を追加

### -- 手段 --

#### Span

1.  Editorをクリックする
2.  Editorが選択されていること（背景色がベージュ）
3.  Termモードにする
4.  Spanを選択する
5.  一番上のinputをクリックする
6.  Editorが選択解除されること（背景色が白）
7.  Spanが選択されたままであることこと

#### BlockSpan

1.  Editorをクリックする
2.  Editorが選択されていること（背景色がベージュ）
3.  Blockモードにする
4.  BlockSpanを選択する
5.  一番上のinputをクリックする
6.  Editorが選択解除されること（背景色が白）
7.  BlockSpanが選択されたままであることこと

#### Entity

1.  Editorをクリックする
2.  Editorが選択されていること（背景色がベージュ）
3.  Termモードにする
4.  Entityを選択する
5.  一番上のinputをクリックする
6.  Editorが選択解除されること（背景色が白）
7.  Entityが選択されたままであることこと

#### Relation

1.  Editorをクリックする
2.  Editorが選択されていること（背景色がベージュ）
3.  Relationモードにする
4.  Relationを選択する
5.  一番上のinputをクリックする
6.  Editorが選択解除されること（背景色が白）
7.  Entityが選択されたままであることこと

## Relationを複数個作った直後のマウスホバーアウト

### 背景

1.  リレーションのレンダリングが非同期なため、ホバー等のリレーションのHTML要素の操作は、レンダリング完了後に行う必要があります
2.  ctrl（Macの場合はCmd）を押しながらRelationを作成すると、手動でも高速にRelationが作成できます
3.  この時、ホバーアウトで、レンダリング前に、Relationの強調、強調解除でHTML要素を操作が起き、エラーが発生します
4.  6.1.21 で、Relationモデルのインスタンスをレンダリング前のダミーとして使ったいたのをやめたときに、レンダリング済みのチェックが同時に抜け、エラーが起きるようになりました
5.  6.1.49 で、EntityのラベルをホバーしたときにRelationを強調するようにしたため、比較的よく発生するようになりました
6.  6.2.11 で対応

### -- 手段 --

1.  Editor0を選択
2.  Relationモードにする
3.  Entityを選択する
4.  ctrl（Macの場合はCmd）を押しながら、他のEntityを連打し複数のリレーションを作った直後にマウスアウトする
5.  エラーが起きないこと

## Relationの作成

### ctrl

1.  Relationモードにする
2.  ctrl（Macの場合はCmd）を押しながらRelationを作る
3.  選んでいたEntityと作ったRelationが選択される

### shift

1.  Relationモードにする
2.  shiftを押しながらRelationを作る
3.  あとに選んだEntityと作ったRelationが選択される

## Relationモードの背景色

1.  Relationモードにする
2.  背景が薄ピンク色になること

## Ctrl/Cmdを押して複数選択した要素を編集できる

### 背景

1.  6.0.0でModificationを廃止しました。

### -- 手段 --

1.  Spanを複数選択してEntityをコピー
2.  Spanを複数選択して貼付け
3.  Spanを複数選択して削除
4.  Entityを複数選択してコピーして、Spanに貼りけ
5.  Entityを複数選択してType変更
6.  Entityを複数選択してAttribute追加
7.  Entityを複数選択してAttribute編集
8.  Entityを複数選択してAttribute削除
9.  Entityを複数選択して削除
10. Relationを複数選択してType変更
11. Relationを複数選択して削除

## `F`と`M`キーでの切り替え

### 背景

1.  SpanとEntityは選択解除時に、対応するhtml要素をblurしていた
2.  Editor、Span、Entityの全てからフォーカスが外れるため、キーボードショートカットが効かなくなった
3.  4.5.6で、blurは不要な処理なので削除した
4.  4.5.6でSimpleモードからRelationモードに遷移するように変更
5.  6.0.0でショートカットキーによるモード切替にViewモードを含めました
6.  6.2.30でショートカットキーによるモード切替にBlockモードを含めました

### -- 手段 --

#### Fキー

1.  Editor2を開く
2.  Fキーを押す
3.  Blockモードになること
4.  Fキーを押す
5.  Relationモードになること
6.  Fキーを押す
7.  Viewモードになること
8.  Fキーを押す
9.  Termモードになること
10. Fキーを押す
11. Relationモードになること

#### Mキー

1.  Editor2を開く
2.  Fキーを押す
3.  Blockモードになること
4.  Fキーを押す
5.  Relationモードになること
6.  Fキーを押す
7.  Viewモードになること
8.  Fキーを押す
9.  Termモードになること
10. Fキーを押す
11. Relationモードになること

## 左右キーに連動してスクロールすること

### 背景

1.  5.0.0 でAttributeを追加した際に、TypeのDOM構造を変更しました
2.  DOMの取得にpreviousElementSibling, nextElementSiblingを使っているところをElement.closestまたはElement.querySelectorにおきかえました。
3.  機能が壊れていないか確認します。

### TermモードのEntity

1.  Termモードにする
2.  Entityを選択する
3.  `左キー`を何回も押して、表示領域外のEntityを選択する
4.  選択したEntityが表示される位置に表示されること
5.  `右キー`を何回も押して、表示領域外のEntityを選択する
6.  選択したEntityが表示される位置に表示されること

### SimpleモードのEntity

#### 背景

1.  SimpleモードではEntityが非表示のためfocusが当たらない
2.  Entityを選んだ時はlabelをfocusを当てて対応した

#### -- 手段 --

1.  Simpleモードにする
2.  Entityを選択する
3.  `左キー`を何回も押して、表示領域外のEntityを選択する
4.  選択したEntityが表示される位置に表示されること
5.  `右キー`を何回も押して、表示領域外のEntityを選択する
6.  選択したEntityが表示される位置に表示されること

### Span

1.  Spanを選択する
2.  `左キー`を何回も押して、表示領域外のSpanを選択する
3.  選択したSpanが表示される位置に表示されること
4.  `右キー`を何回も押して、表示領域外のSpanを選択する
5.  選択したSpanが表示される位置に表示されること

## Viewモード

### 背景

1.  4.1.6開発中にurlにmodeパラメーターをつけるとViewモードにならなくなりました
2.  4.5.0でurlパラメーターを廃止し、必要な場合は外部のJavaScriptで属性に設定することにしました
3.  5.0.0で`Upload`ボタンの制御を有効無効から、星マークの有無に変更しました
4.  5.0.0の開発中にTypeDomのDOM要素の構成を変更したときに、TypeValuesへのイベントハンドラー無効化処理をいれわすれたため、Typeラベルのリンクがクリックできないバグがありました
5.  5.0.5から、Attributeのラベルも、URLだったらViewモードでリンクとして表示することにしました

### 期待する振る舞い

#### -- 手段 --

1.  Viewモードにする
2.  Viewボタンが押下状態であること
3.  要素を選択できないこと
    1.  Span
    2.  Entity
    3.  Relation
4.  Enityラベルがリンクになる
5.  Attributeラベルがリンクになる
6.  saveできる
7.  loadできる
8.  TypeGapを変更できる
9.  LineHeightを変更できる
10. EntityをホバーするとRelationも強調される
11. Termモードに変更できる
12. Relationモードに変更できる
13. Blockモードに変更できる

### annotationファイルの自動修正時に`Upload`ボタンに星マークがつく

#### -- 手段 --

1.  Viewモードで開く
2.  invalid.jsonを読み込む
3.  `Upload`ボタンに星マークがつくこと
4.  Termモードに変更する
5.  `Upload`ボタンに星マークがついたままであること

## モード切り替え

### 背景

1.  モード切り替えが分かりずらい
2.  4.1.16でモード切り替え用のボタンを追加しました
3.  6.2.0でBlockモードを追加しました

### -- 手段 --

1.  Editor1を選択
2.  Termモードであること
3.  Termボタンを押す
4.  Termモードに既になっていて、変わらないこと
5.  Viewボタンを押す
6.  Viewモードになること
7.  Termボタンを押す
8.  Termモードになること
9.  Relationボタンを押す
10. Relationモードになること
11. Simpleボタンが無効になること
12. Viewボタンを押す
13. Viewモードになること
14. Relationボタンを押す
15. Relationモードになること
16. Termボタンを押す
17. Termモードになること
18. Simpleボタンを押す
19. Simpleモードになること
20. Viewボタンを押す
21. Viewモードになること
22. Simpleボタンが押下されたままであること
23. Termボタンを押す
24. Simpleモードになること
25. Relationボタンを押す
26. Relationモードになること
27. Viewボタンを押す
28. Viewモードになること
29. Simpleボタンを押す
30. View-Simpleモードになること
31. Blockボタンを押す
32. Block-Simpleモードになること
33. Simpleボタンを押す
34. Blockモードになること
35. Termボタンを押す
36. Termモードになること

## annotationファイル内のbegin, endを整数に自動変換する

### 背景

1.  annotationファイル内のbegin, endが文字列の場合、クロススパンの検出時にエラーが出ます
2.  annotationファイル内のbegin, endが小数点を含む場合、生成するspanのDOMのIDに`.`が含まれ、DOMのIDとして不正な形式になります
3.  5.3.1から、begin, endの値を自動的に整数に変換します

### -- 手段 --

1.  invalid.jsonを読み込む
2.  トーストが表示されること
3.  annotationをソース表示する
4.  `T2`のbeginが、ダブルクォートされた文字列ではなく、数値であること
5.  `T2`のendが、少数ではなく、整であること

## 行の高さ調整アイコン

### 背景

1.  4.1.12で行の高さ調整アイコンを追加しました。
2.  4.1.16の開発中にモジュール読み込み構文の修正漏れでエラーを起こしていました。

### -- 手段 --

1.  もっとも高いGridを削除する
2.  `Adjust LineHeight`アイコンをクリックする
3.  高さが調整されること
4.  もっとも高いGridより高いGridを作る
5.  `Adjust LineHeight`アイコンをクリックする
6.  高さが調整されること

## idなしdenotationへのid自動採番

### idなしdenotationの読み込み

#### 背景

1.  annotation.jsonに記載するdenotationはidが必須でした
2.  idがない場合に、自動でidを振る機能を4.1.8で追加しました
3.  6.0.0でModificationを廃止しました。

#### -- 手段 --

1.  Editor1を開く
2.  `no id`エンティティをホバーしたらid `T18` が表示されること
3.  id `R13` が表示されるRelationにidがあること
4.  annotationをソース表示する

### idなしdenotation入りのmultitrack読み込み

#### 背景

1.  multitrackのannotation.jsonでもidを自動採番します
2.  multitrackでは読み込み時にIDの重複を避けるために`trackX_`なプレフィックスをつけて読み込みます
3.  Entity追加時には`Txx`形式で、trackを無視した連番で自動採番します
4.  idなしdenotationは後者と同じ方式で`Txx`形式で自動採番します

#### -- 手段 --

1.  idがないdenotiationを持つmultitrackなannotation.jsonを開く(multi_track.json)
2.  `no id t2`エンティティをホバーしたら`T2`が表示されること
3.  `no id t1`エンティティをホバーしたら`T1`が表示されること
4.  idがないRelationにid`R1`が表示されること
5.  annotationをソース表示する

## Editorの下の要素をクリックできる

### 背景

1.  テキストの余白が上に大きく、下は少ないように見せています
2.  実際のテキストはパラグラフの中央にあります
3.  Editorの下に透明のパラグラフがはみ出しています
4.  はみ出たパラグラフの下の要素がクリックできません
5.  4.4.0でEditorの`over-flow`スタイルに`hidden`属性を設定。はみ出たパラグラフを非表示にしました
6.  5.0.0でコンテキストメニューを追加したときに、コンテキストメニューをEditorからはみ出させたくなりました
7.  `over-flow`スタイルを設定する要素を、`.textae-editor`から、パラグラフのすぐ親の要素`.textae-editor__body__text-box`に変更しました
8.  6.0.0でテキスト中の改行のレンダリングをパラグラフから、cssの`white-space: pre-wrap;`に変更しました

### -- 手段 --

1.  Editor1の下のinputをクリックする
2.  inputにフォーカスがうつること
3.  inputに文字が入力できること

## Spanの耳をひっぱて縮める

### 背景

1.  パラグラフの端にあるSpanをパラグラフの外から縮められません
2.  v4.4.0から、Spanの端からSpanの内側へテキストを選択した時に、Spanを縮める
3.  6.0.0でテキスト中の改行のレンダリングをパラグラフから、cssの`white-space: pre-wrap;`に変更しました

### -- 手段 --

#### 一番先頭のSpanを左から縮める

1.  Termモードにする
2.  一番先頭の単語を含む複数語をSpanにする
3.  作ったSpanを左から縮める

#### 一番最後のSpanを右から縮める

1.  Termモードにする
2.  一番最後のピリオドを含む複数語をSpanにする
3.  作ったSpanを右から縮める

#### Span選択時は選択しているSpanを縮める

1.  Termモードにする
2.  子が一語の親子Spanを作る
3.  親Spanを選択する
4.  子Spanの端をマウスダウン、子Spanの途中でマウスアップ
5.  親Spanが縮まること

#### 左端の単語をダブルクリックするとSpanが縮まる

1.  Termモードにする
2.  複数語をSpanにする
3.  左端の単語をダブルクリックする
4.  ダブルクリックした単語分、Spanが短くなること

## Term/Simple 自動切り替え

1.  6.1.1で一つのdenotationを一つのエンティティに表示することしました。
2.  同時に複数のdennotationを一つのエンティティに表示しているときに初期モードをTermモードにする機能を削除しました。

### Termモードになるannotationの初期表示

1.  Editor1を選択
2.  Termボタンが押下状態であること
3.  Simpleボタンが押下状態でないこと

### Simpleモードになるannotaionの初期表示

1.  Editor2を選択
2.  Termボタンが押下状態であること
3.  Simpleボタンが押下状態であること

### RelationモードからTerm/Simpleへの自動切り替え

#### Termモードになる場合

1.  Editor1を選択
2.  Relationボタンを押す
3.  Relationモードになること
4.  Termボタンを押す
5.  Termモードになること

#### Simpleモードになる場合

1.  Editor2を選択
2.  Relationボタンを押す
3.  Relationモードになること
4.  Termボタンを押す
5.  Simpleモードになること
