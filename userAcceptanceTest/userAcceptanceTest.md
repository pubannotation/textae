# 受け入れテスト

共通確認項目

1.  `npm run dist`を実行します
2.  `npm run dev:server`を実行します
3.  <http://localhost:8000/dist/demo/development.html> を開きます
4.  ブラウザの開発ツールを起動します。
5.  以下のテストを実行して、エラーが出ないこと

## Ctrl/Cmd を押して複数選択 Term モード

1.  Term モードにする
2.  要素を複数選択する
    1.  Span
    2.  Entity
    3.  Relation
3.  Span と Entity は同時に選択できる

## Ctrl/Cmd を押して複数選択 Relation モード

### 背景

1.  5.0.5 で Entity -> Relation の順で選択した際に、Ctrl/Cmd を押していなくても、両方選択されるバグが発生
2.  6.1.28 で対応

### -- 手段 --

1.  Relation モードにする
2.  Entity を選択する
3.  Relation をクリックする
4.  Entity の選択が解除され、Relation が選択されること
5.  Entity をクリックする
6.  Relation の選択が解除され、Entity が選択されること
7.  Ctrl/Cmd を押して Relation をクリックする
8.  Entity と Relation が両方選択されること

## 自動レプリケーション機能

### Boundary Detection 有効時の動作

1.  `Auto Replicate`ボタンを押下状態にする
2.  単語の一部を選択する
3.  単語単位でレプリカが作られること

### Boundary Detection 無効時の動作

1.  `Auto Replicate`ボタンを押下状態にする
2.  単語の一部を選択する
3.  文字単位でレプリカが作られること

## 手動レプリケーション機能

### Boundary Detection 有効時の動作

1.  Span を選択する
2.  `Replicate`ボタンを押下する
3.  単語単位でレプリカが作られること

### Boundary Detection 無効時の動作

1.  Span を選択する
2.  `Replicate`ボタンを押下する
3.  文字単位でレプリカが作られること

### 元 Span の Type の Attribute をコピーすること

#### 背景

1.  4.4.1 で Span をレプリケーションする際につける Type を default から、元 Span についている Type に変更しました
2.  5.0.0 で Entity の Type に Attribute が追加されました
3.  Attribute もレプリケーションできるようになりました

#### -- 手段 --

1.  Term モードにする
2.  レプリケーション可能な文字列の Span に Type を二種類以上、いずれかの Type に複数の Entity、1 つ以上の Attribute を作る
3.  上記 Span だけを選択する
4.  `Replicate Span annotation [R]`ボタンを押下する
5.  レプリカが作られること
6.  レプリカに、選択していた Span の Type（1 つのラベルとすべての Attribute）の Entity が一つずつ作られること

## Numeric Attribute の Object を編集した後も、obj の型が Number 型であること

### 背景

1.  5.0.4 から Numeric Attribute の Object を専用のダイアログで編集出来るようになりました。
2.  Numeric Attribute を Object を編集した際に、input 要素の入力値を Number 型に変換せずに設定していたため、obj の型が文字列型に変わっていました。
3.  5.2.7 で、Number 型への変換を追加して、対応しました。

### -- 手段 --

1.  Editor1 を選択
2.  Term モードにする
3.  Attribute のない Entity を選択する
4.  `4`キーを押して Numeric Attribute を追加する
5.  `4`キーを押して Numeric Attribute の編集ダイアログを開く
6.  Object の値を変更して、OK ボタンが押す
7.  Save Annotation ダイアログを開く
8.  `Click to see the json source in a new window.`リンクをクリックする
9.  表示された Annotation 内の attributes 配列の最後の attribute の obj が Number 型である(ダブルクォートされていない)こと

## 削除して Undo してもキーボードショートカットが有効

### 背景

1.  4.3.4 からキーボードイベントを body 全体から editor 単位でとるように変更
2.  editor かその子要素（Span か Entity Type）がフォーカスを持っていないとキーイベントが拾えない
3.  通常の作成時は新要素を自動選択する
4.  削除の Undo 時は、作成を実行するが、自動選択しない
5.  Undo の時は自動で editor を選択するようにした

### -- 手段 --

#### Term モード

1.  Term モードにする
2.  Span を削除する
3.  右の Span が選択されること
4.  Undo する
5.  Span が作成されること
6.  `Hキー`を押してキーボードヘルプが表示されること

#### Relation モード

1.  Relation モードにする
2.  Relation を削除する
3.  Undo する
4.  Relation が作成されること
5.  `Hキー`を押してキーボードヘルプが表示されること

## ダイアログを閉じたときに Editor が選択されている

### 背景

1.  jQuery ダイアログの閉じるボタンをクリックしたときに、Editor 外をクリックしたと判定して Editor の選択を解除していました
2.  4.5.0 で jQuery ダイアログ上のクリックイベントを無視するようにしました

### -- 手段 --

1.  Editor1 を選択
2.  `Hキー`を押す
3.  キーボードヘルプが表示されること
4.  右上の X ボタンをクリックする
5.  Editor1 を選択されたままであること（背景色がベージュ）

## inline annotation を読み込んだときにコントロールが初期化されること

1.  Editor5 を選択する
2.  コントロールバーのアイコンが有効になる
    1.  View Mode
    2.  Term Edit Mode
    3.  Relation Edit Mode
    4.  Simple View
    5.  Setting
    6.  Adjust LineHeight

## save_to パラメーター

### 背景

1.  5.0.0 から`save_to`パラメーターを導入
2.  現状では、Save Configurations ダイアログの URL 欄に、`source`パラメーターで指定した annotation.json の URL を初期表示します。
3.  `save_to`パラメーターが指定されている場合は、`save_to`パラメーターの URL を表示します。

### -- 手段 --

1.  editor6 を選択
2.  アノテーション読込ダイアログを表示する
3.  URL 欄に`../../dev/3_annotations.json`が表示されること
4.  Save Annotations ダイアログを表示する
5.  URL 欄に`http://pubannotation.org/projects/penguin-fly/docs/sourcedb/PubMed/sourceid/10089213/annotations.json`が表示されること

### Save Configurations ダイアログには影響を与えない

1.  editor6 を選択
2.  `Select Label [Q]`ボタンをクリックする
3.  Save Configurations ダイアログを開く
4.  URL 欄が空であること

## multi tracks

### Edit モード

#### 背景

1.  multi tracks でも json 上の annotation.text の位置は変わりません。
2.  JSON validator の導入時に annotation.text を track 内から取ろうとするバグがありました。
3.  4.1.10 で alert からトーストに表示方法を変更しました
4.  5.0.0 で`Upload`ボタンの制御を有効無効から、星マークの有無に変更しました

#### -- 手段 --

1.  multi_tracks.json が読み込めること
2.  読み込んだ時にトーストが表示されること
3.  文面は`track annotations have been merged to root annotations.`
4.  Relation に track id が表示されること
5.  `Upload`ボタンに星マークがつくこと

### View モード

#### 背景

1.  4.1.13 から View モードでは、トーストを表示しません
2.  4.1.13 から View モードでは、`Upload`ボタンを有効にしません
3.  4.5.6 から View モードでも、トーストを表示します
4.  5.0.0 で`Upload`ボタンの制御を有効無効から、星マークの有無に変更しました

#### -- 手段 --

1.  Editor2 を開く
2.  View モードにする（View-Simple モードでないと Term モードに自動遷移します）
3.  `multi_tracks.json`を開く
4.  読み込んだ時にトーストが表示されること
5.  文面は`track annotations have been merged to root annotations.`
6.  `Upload`ボタンに星マークがつくこと

## ショートカットキー

### 全体的な動作確認

#### 背景

1.  ショートカットキーを見直したので動作確認

#### -- 手段 --

1.  図が正しくでること
2.  図の通りに動作すること

## Span の全 Entity を消したときに Span も一緒に削除する

### 背景

1.  Entity のない Span を削除する機能があります
2.  Entity を一つずつ消して行く場合は正常に動いていました
3.  Entity を複数選択してまとめて消して Span の Entity がなくなったときに、Span が残るバグがありました
4.  4.1.8 で対応しました
5.  4.2.1 の開発中に、Span 削除時に unfocus するための DOM 要素が取得できずにエラーが起きました

### -- 手段 --

1.  Span に複数の Entity を作る
2.  Span を選択解除する
3.  すべての Entity を選択し、削除
4.  Span が削除されること

## Span を選択して削除

### 背景

1.  4.2.1 の開発中に、Span 削除時に unfocus するための DOM 要素が取得できずにエラーが起きました

### -- 手段 --

1.  Span を選択する
2.  `Dキー`を押す
3.  選択した Span が削除されること
4.  Span を選択する
5.  `Deleteボタン`（ゴミ箱アイコン）を押す
6.  選択した Span が削除されること

## pubannotation 認証

### 背景

1.  6.1.14 から PubAnnotation の認証に対応しました。
2.  textae は PubAnnotation のエディタとして利用可能です。
3.  PubAnnotation では、ログインしていないユーザからの保存リクエストにはログインを促します。
4.  PubAnnotation では、ダイジェスト認証と Google OAuth2 認証を選択可能にするためにログインページを開きます。
5.  PubAnnotation は、401 レスポンスに独自のヘッダー（WWW-Authenticate に ServerPage を指定し、Location ヘッダーでログイン画面の場所を指示）を返却します。

### 手段

1.  保存ダイアログを開く
2.  URL に`/dev/server_auth`を入力して、Save ボタンを押す
3.  ポップアップウインドウが開き`This is a dummy atuth page!`と表示されること
4.  ポップアップウインドウをとじる
5.  右上に`could not save`と赤色のトースト表示がされること
