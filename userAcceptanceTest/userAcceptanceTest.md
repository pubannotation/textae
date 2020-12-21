# 受け入れテスト

共通確認項目

1.  `npm run dist`を実行します
2.  `npm run dev:server`を実行します
3.  <http://localhost:8000/dist/demo/development.html> を開きます
4.  ブラウザの開発ツールを起動します。
5.  以下のテストを実行して、エラーが出ないこと

## StyleSpan上でmouseupして、Spanを伸ばす

### 背景

1.  6.1.38で親子Spanの子Spanでmousedownして、親Span内のStyleSpan上でmouseupすると、親spanがちぢむ現象に対応

### Span上でmousedownして、StyleSpan上でmouseupして、Spanを伸ばす

#### `Boundary Detection` 有効

1.  `Boundary Detection`ボタンを押下状態にする
2.  StyleSpanの隣にSpanを作成する
3.  上のStyleSpan上でとSpan両方を含む親Spanを作る
4.  Span上でmousedownし、StyleSpan上でmouseupして、Spanを伸ばす
5.  Spanが伸びること

#### `Boundary Detection` 無効

1.  `Boundary Detection`ボタンを押下状態にする
2.  StyleSpanの隣にSpanを作成する
3.  上のStyleSpan上でとSpan両方を含む親Spanを作る
4.  Span上でmousedownし、StyleSpan上でmouseupして、Spanを伸ばす
5.  アラートが表示され、Spanが伸びないこと

## StyleSpan上でmouseupして、Spanを縮める

### 背景

1.  6.1.36からテキスト上でmousedownに対応
2.  6.1.37からSpan上でmousedownに対応
3.  6.1.38で親子Spanの子Spanでmousedownして、親Span内のStyleSpan上でmouseupすると、親spanがちぢむ現象に対応
4.  6.1.55で、縮めたときに、意図せずに新しいSpanができる現象に対応

### テキスト上でmousedownして、StyleSpan上でmouseupして、Spanを縮める

#### `Boundary Detection` 有効

1.  `Boundary Detection`ボタンを押下状態にする
2.  StyleSpanを含むSpanを作成する
3.  Spanの外側のテキスト上でmousedownし、Span内のStyleSpan上でmouseupして、Spanを縮める
4.  Spanが縮まること
5.  新しいSpanができないこと

#### `Boundary Detection` 無効

1.  `Boundary Detection`ボタンを押上状態にする
2.  StyleSpanを含むSpanを作成する
3.  Spanの外側のテキスト上でmousedownし、Span内のStyleSpan上でmouseupして、Spanを縮める
4.  アラートが表示され、Spanが縮まらないこと

### Span上でmousedownして、StyleSpan上でmouseupして、Spanを縮める

#### `Boundary Detection` 有効

1.  `Boundary Detection`ボタンを押下状態にする
2.  StyleSpanを含むSpanを作成する
3.  上のSpanに親Spanを作る
4.  親Span上でmousedownし、Span内のStyleSpan上でmouseupして、Spanを縮める
5.  Spanが縮まること

#### `Boundary Detection` 無効

1.  `Boundary Detection`ボタンを押上状態にする
2.  StyleSpanを含むSpanを作成する
3.  上のSpanに親Spanを作る
4.  親Span上でmousedownし、Span内のStyleSpan上でmouseupして、Spanを縮める
5.  アラートが表示され、Spanが縮まらないこと

## Spanの編集制限

### 背景

1.  v4.4.0から、Spanの端からSpanの内側へテキストを選択した時に、Spanを縮める

## Spanの編集制限

### 背景

1.  v4.4.0から、Spanの端からSpanの内側へテキストを選択した時に、Spanを縮める
2.  6.1.59 で兄弟Spanの間でSpanを作れない場合に、テキストの選択を解除するようにしました。
3.  6.1.59 で祖父-孫Spanの間でSpanを縮めらない場合に、テキストの選択を解除するようにしました。
4.  6.1.59 でテキスト-子孫Spanの間でSpanを縮めらない場合に、テキストの選択を解除するようにしました。

### 兄弟Spanの間でSpanを作る

1.  Spanでmousedownし、兄弟Spanでmouseupする
2.  テキストの選択が解除されること

### 祖父Spanを孫Spanまで縮める

1.  祖父Spanでmousedowenし、孫Spanでmouseupする
2.  テキストの選択が解除されること

### テキストから親Spanを超えて子Spanまで縮める

1.  テキストでmousedowenし、子Spanでmouseupする
2.  テキストの選択が解除されること

### 子を親の外までのばす

1.  子を親の外までのばす
2.  テキストの選択が解除されること

### 子を選択して親の外までのばす

1.  子を選択する
2.  子を親の外までのばす
3.  alertが表示されること
4.  テキストの選択が解除されること

### 親を子をかぶって縮める

1.  子が複数単語の親子Spanを作る
2.  選択を解除する
3.  親を子の単語の途中まで縮める
4.  文字列として選択できないこと

### 親を選択して、子をかぶって縮める

1.  子が複数単語の親子Spanを作る
2.  親を選択する
3.  親を子の単語の途中まで縮める
4.  alertが表示されること

### 重複したSpanは作れない

1.  Spanを選択する
2.  Spanになっている単語をマウスオーバーで選択する
3.  Spanが削除されること

## StyleSpan上でmouseupして、StypleSpan上でmousedowする

### 背景

1.  6.1.58 でStyleSpan上でmouseupして、StypleSpan上でmousedowしたときにSpanを作れるようにしました。
2.  6.1.59 でSpanを作れない場合に、テキストの選択を解除するようにしました。

### テキスト上のStyleSpanとStyleSpan

1.  Editor1を選択
2.  既存のSpanを消してテキスト上に2つのStyleSpanを並べる
3.  StyleSpan上でmouseupして、StypleSpan上でmousedowする
4.  Spanが作成されること

### Span上のStyleSpanとStyleSpan

1.  Editor1を選択
2.  既存のSpanをいい感じに編集して、一つのSpanの上に2つのStyleSpanを並べる
3.  StyleSpan上でmouseupして、StypleSpan上でmousedowする
4.  Spanが作成されること

### 片方だけSpan上のStyleSpanとStyleSpan

1.  Editor1を選択
2.  既存のSpanをいい感じに編集して、一つをSpanの上StyleSpan、一つをテキスト上のStyleSpanにする
3.  StyleSpan上でmouseupして、StypleSpan上でmousedowする
4.  Spanが作成されないこと
5.  テキストの選択が解除されること

## StyleSpan上でmousedownして、Span上でmouseupする

### 背景

1.  6.1.56で対応

### StyyleSpanが親でSpanが子のとき、さらにその親Spanがあるとき

#### 子Spanでmouseupすると

1.  Editor1を選択
2.  StyleSpanを親に持つSpanを作る
3.  さらに親Spanを作る
4.  選択を解除する
5.  StyleSpan上でmousedownして、子Span上でmouseupする
6.  子Spanが縮む

#### 親Spanでmouseupすると

1.  Editor1を選択
2.  StyleSpanを親に持つSpanを作る
3.  さらに親Spanを作る
4.  選択を解除する
5.  StyleSpan上でmousedownして、親Span上でmouseupする
6.  親Spanが縮む

### Spanが親でStyyleSpanが子のとき、さらにその親Spanがあるとき

#### 1つ上の親Spanでmouseupすると

1.  Editor1を選択
2.  StyleSpanを子に持つSpanを作る
3.  さらに親Spanを作る
4.  選択を解除する
5.  StyleSpan上でmousedownして、1つ上の親Span上でmouseupする
6.  1つ上の親Spanが縮む

#### 2つ上の親Spanでmouseupすると

1.  Editor1を選択
2.  StyleSpanを子に持つSpanを作る
3.  さらに親Spanを作る
4.  選択を解除する
5.  StyleSpan上でmousedownして、2つ上の親Span上でmouseupする
6.  1つ上の親Spanが伸びる

#### 1つ上の親Spanを選択して、1つ上の親Spanでmouseupすると

1.  Editor1を選択
2.  StyleSpanを子に持つSpanを作る
3.  さらに親Spanを作る
4.  1つ上の親を選択
5.  StyleSpan上でmousedownして、1つ上の親Span上でmouseupする
6.  1つ上の親Spanが縮む

#### 2つ上の親Spanを選択して、1つ上の親Spanでmouseupすると

1.  Editor1を選択
2.  StyleSpanを子に持つSpanを作る
3.  さらに親Spanを作る
4.  2つ上の親を選択
5.  StyleSpan上でmousedownして、1つ上の親Span上でmouseupする
6.  2つ上の親Spanが縮む

#### 1つ上の親Spanを選択して、2つ上の親Spanでmouseupすると

1.  Editor1を選択
2.  StyleSpanを子に持つSpanを作る
3.  さらに親Spanを作る
4.  1つ上の親を選択
5.  StyleSpan上でmousedownして、2つ上の親Span上でmouseupする
6.  1つ上の親Spanが伸びる

#### 2つ上の親Spanを選択して、2つ上の親Spanでmouseupすると

1.  Editor1を選択
2.  StyleSpanを子に持つSpanを作る
3.  さらに親Spanを作る
4.  2つ上の親を選択
5.  StyleSpan上でmousedownして、2つ上の親Span上でmouseupする
6.  2つ上の親Spanが縮む

## configのautocompletion_ws属性

### 背景

1.  5.2.0でconfigでオートコンプリートのURLを指定できるようになりました

### -- 手段 --

#### configのautocompletion_ws属性でURLを指定すると、オートコンプリートの候補を指定URLから取得する

##### Typeのラベル変更

1.  Editor2を選択
2.  Spanを作成する
3.  `Change Label[W]`ボタンを押す
4.  既存のidを消す
5.  `SPA`を入力
6.  候補に`http://www.amazon.com/Learning-SPARQL-Bob-DuCharme/dp/1449371434/ref=sr_1_1?ie=UTF8&qid=1452147643&sr=8-1&keywords=sparql`が右寄せで表示されること

##### EntityのType定義の追加

1.  Editor2を選択
2.  Termモードにする
3.  `Select Label [Q]`ボタンをクリックする
4.  `Add new type`ボタンをクリックする
5.  `Id`欄に`SPA`を入力する
6.  候補に`http://www.amazon.com/Learning-SPARQL-Bob-DuCharme/dp/1449371434/ref=sr_1_1?ie=UTF8&qid=1452147643&sr=8-1&keywords=sparql`が右寄せで表示されること

##### EntityのType定義の変更

1.  Editor2を選択
2.  Termモードにする
3.  `Select Label [Q]`ボタンをクリックする
4.  `Edit this type`ボタンをクリックする
5.  `Id`欄に`Lig`を入力する
6.  候補に`http://www.yahoo.co.jp`が右寄せで表示されること

##### RelationのType定義の追加

1.  Editor2を選択
2.  Relationモードにする
3.  `Select Label [Q]`ボタンをクリックする
4.  `Add new type`ボタンをクリックする
5.  `Id`欄に`SPA`を入力する
6.  候補に`http://www.amazon.com/Learning-SPARQL-Bob-DuCharme/dp/1449371434/ref=sr_1_1?ie=UTF8&qid=1452147643&sr=8-1&keywords=sparql`が右寄せで表示されること

##### RelationのType定義の変更

1.  Editor2を選択
2.  Relationモードにする
3.  `Select Label [Q]`ボタンをクリックする
4.  `Edit this type`ボタンをクリックする
5.  `Id`欄に`Lig`を入力する
6.  候補に`http://www.yahoo.co.jp`が右寄せで表示されること

#### htmlのautocompletion_ws属性はconfigのautocompletion_ws属性にまさる

1.  Editor1
2.  Entityを選択する
3.  `Change Label[W]`ボタンを押す
4.  既存のidを消す
5.  `par`を入力
6.  候補に`parent@http://dbpedia.org/ontology/parent`が右寄せで表示されること

## configでEntityのTypeにlabel属性を定義

### 背景

1.  4.3.0からconfigにEntityのTypeにlabelを定義できるようになりました

### -- 手段 --

1.  Edtor1を選択
2.  Entityを選択する
3.  `w`キーを押して、Typeを`http://www.yahoo.co.jp`に変更します
4.  Typeの表示が`Regulation`になること
5.  Vアイコンを押してViewモードに切り替える
6.  Typeのラベルがリンクになること
7.  リンクをクリックすると`http://www.yahoo.co.jp`が開くこと

## 境界検出

### 動作確認

#### 背景

1.  テキストをドラッグするとdelimiter characterまで自動的に調整してくれる機能があります
2.  4.1.7で、この機能を`Boundary Detection`ボタンでOn/Offできるようになりました
3.  ショートカットキーは`b`です
4.  6.0.0でショートカットキー`b`が動作しなくなりました。6.0.3で対応しました。

### ショートカットキー`b`

1.  ショートカット`b`を押す
2.  `Boundary Detection`ボタンを押上状態になること
3.  単語の一部を選択する
4.  単語の選択部分がSpanになること
5.  ショートカット`b`を押す
6.  `Boundary Detection`ボタンを押下状態にする
7.  単語の一部を選択する
8.  単語全体がSpanになること

### `Boundary Detection`ボタン

1.  `Boundary Detection`ボタンを押下状態にする
2.  単語の一部を選択する
3.  単語全体がSpanになること
4.  `Boundary Detection`ボタンを押上状態にする
5.  単語の一部を選択する
6.  単語の選択部分がSpanになること

### Spanをのばす縮める

#### Boundary Detection有効時の動作

1.  Spanをのばす
2.  右に
3.  左に
4.  Spanを縮める
5.  戻す
6.  単語単位で変更されること

#### Boundary Detection無効時の動作

1.  Spanをのばす
2.  右に
3.  左に
4.  Spanを縮める
5.  戻す
6.  文字単位で変更されること

## configのPushButton設定

### 背景

1.  6.1.5 からconfigで自動保存、境界検出、行の高さ自動調整のON/OFFを設定できるようになりした

### 自動保存

1.  Editor0の自動保存が無効であること
2.  Editor1の自動保存が有効であること
3.  Editor2の自動保存が無効であること

### 境界検出

1.  Editor0の境界検出が有効であること
2.  Editor1の境界検出が有効であること
3.  Editor2の境界検出が無効であること

### 行の高さ自動調整

1.  Editor0の行の高さ自動調整が無効であること
2.  Editor1の行の高さ自動調整が有効であること
3.  Editor2の行の高さ自動調整が無効であること

## 行の高さ自動調整

### 背景

1.  6.0.0から行の高さ自動調整機能を追加しました。
2.  6.0.3から、エンティティをすべて消したときに、行の高さ指定を初期値にもどします。

### -- 手段 --

1.  Editor2を選択
2.  `Auto Adjust LineHeight`アイコンを押下する
3.  Entityを追加する
4.  高さが調整されること
5.  Entityを削除する
6.  line-heightが14pxになること

## 外部JavaScriptでURLパラメータから属性に設定した値が反映されること

### 背景

1.  4.5.0でURLパラメータを読むのをやめました
2.  外部のJavaScriptでtextae-editorに設定した属性は読みます
3.  外部のJavaScriptでtextae-editorにURLパラメータの値を設定するサンプルの動作確認をします

### -- 手段 --

1.  <http://localhost:8000/dist/editor.html?mode=edit&source=%2Fdev%2F1_annotations.json> を開く
2.  1_annotationsが表示されること
3.  Editor1を選択
4.  Editモードであること

## Entityを作成すると自動選択

### 背景

1.  新規EntityのIDをanntotian.jsonのdennotationのidから連番で降っています
2.  TではじまるIDを生成したIDとして扱っていました
3.  annotation.jsonにidがTではじまって数字以外を含むdennotation（たとえばT1.a.b）を入れると新規IDが常にTNaNになります
4.  Entityを何個作ってもTNaNが振られます
5.  作成後IDでDOMを選択する際に、最初の一個が選択されます
6.  4.1.14で対応しました
7.  生成したIDをT数字のみに制限しました

### -- 手段 --

1.  Termモードにする
2.  Spanを作る
3.  Entityを追加する
4.  二つの作ったEntityが選択されること
5.  Spanを作る
6.  後に作ったSpanのEntityだけが選択されること(前に作ったSpanのEntityが選択されないこと)

## オートコンプリートの候補を表示したときにEntityダイアログに横スクロールバーが表示されないこと

### 背景

1.  5.0.6でEntityダイアログのオートコンプリートの候補の幅を、なるべく値が省略されないように、広くしました。
2.  Firefoxでは、Entityダイアログに横スクロールバーが表示されていました。5.2.7で候補の幅を5px短くして、対応しました。

### --- 手段 ---

1.  Editor1を選択
2.  Termモードにする
3.  AttributeのないEntityを選択する
4.  `Change Label[W]`ボタンを押す
5.  既存のidを消す
6.  `par`を入力
7.  候補に`parent@http://dbpedia.org/ontology/parent`が表示されること
8.  ダイアログに横スクロールバー表示されないこと

## オートコンプリートの候補がダイアログの下に隠れないこと

### 背景

1.  4.3.0でオートコンプリート導入。候補をconfigとsource server(オートコンプリートの問い合わせ先サーバー。HTML上のautocompletion_ws属性で設定します)から検索します
2.  4.5.5でjQuery UIをtextae.jsに同梱した時、オートコンプリートの候補が選択できなくなりました。jQuery UIのcore部分とjQuery UIのオートコンプリート機能のバージョン不一致で、オートコンプリートの候補を選択したときにエラーが起きた。4.5.6で対応
3.  5.0.0でtypeの編集機能を追加した際に、オートコンプリートで検索結果のラベルを`Value:`の右に、idをValue欄に表示するように変更しました
4.  5.0.0でRelationのラベルもEntityと同様の短縮表示しました
5.  5.0.5でオートコンプリートの候補がダイアログの裏に隠れるバグを修正した際に、同時に、候補の末尾の文字が見切れない用に右寄せにしました
6.  5.0.5でAttributeのないEntityを編集するときに、オートコンプリートの候補の2つ目以降が見切れていました。5.2.6でダイアログの高さに最小値を設定しました

### -- 手段 --

#### Entity

1.  Editor1を選択
2.  Termモードにする
3.  AttributeのないEntityを選択する
4.  `Change Label[W]`ボタンを押す
5.  既存のidを消す
6.  `pro`を入力
7.  候補に`production@http://dbpedia.org/ontology/production`が右寄せで表示されること
8.  候補に`productionCompany@http://dbpedia.org/ontology/productionCompany`が右寄せで表示されること
9.  2つ目以降の候補が隠れないこと
10. `production@http://dbpedia.org/ontology/production`を選択する
11. Valueの右に`production`が表示されること
12. Valueの値が`http://dbpedia.org/ontology/production`になること
13. `OK`ボタンを押す
14. Entityのラベルが`production`になること

#### Relation

1.  Editor1を選択
2.  Relationモードにする
3.  Relationを選択する
4.  `Change Label[W]`ボタンを押す
5.  既存のidを消す
6.  `par`を入力
7.  候補に`parent@http://dbpedia.org/ontology/parent`が右寄せで表示されること
8.  `parent@http://dbpedia.org/ontology/parent`を選択する
9.  Valueの右に`parent`が表示されること
10. Valueの値が`http://dbpedia.org/ontology/parent`になること
11. `OK`ボタンを押す
12. Relationのラベルが`parent`になること

## アノテーションが無いときに行の高さが41pxになること

### 背景

1.  5.0.0 でアノテーションが無いときに行の高さがなくなっていました
2.  5.2.4 で対応しました

### -- 手段 --

1.  Editor7を選択する
2.  `.textae-editor__body__text-box`のline-heightが`41px`であること
3.  `.textae-editor__body__text-box`のpadding-topが`20.5px`であること
4.  Setting ダイアログを開く
5.  Line Heightの値が41であること

## Termモード

### 背景

1.  4.1.18 でtextをRelationより前に表示するようにしました。
2.  6.0.0 でtextがRelationのラベルの後ろに隠れていて、背後のテキストを選択してSpanがつくることができませんでした
3.  6.1.46で対応しました

### -- 手段 --

1.  Termモードにする
2.  textがRelationとRelationのラベルの手前に表示されること
3.  Relationを持つEntityをホバーする
4.  RelationとRelationのラベルがtextの手前に表示されること
5.  Relationモードにする
6.  RelationとRelationのラベルがtextの手前に表示されること
7.  Viewモードにする
8.  RelationとRelationのラベルがtextの手前に表示されること

## スタイルで行の高さを指定できること

### 背景

1.  4.1.14 で行の高さをスタイルで上書きできるようになりました
2.  6.0.0 でpadding-topとheightが設定されなくなりました
3.  6.1.45 で対応

### -- 手段 --

1.  Editor2を選択する
2.  `.textae-editor__body__text-box`のline-heightが`14px`であること
3.  `.textae-editor__body__text-box`のpadding-topが`7px`であること
4.  `.textae-editor__body__text-box`のheightが`48px`であること
5.  Setting ダイアログを開く
6.  Line Heightの値が14であること

## 2つ以上連続した空白を選択してもエラーにならないこと

### 背景

1.  2つ以上連続した空白を選択したときに、空白を一つだけ消して、残りの空白でSpanを作成していました
2.  Spanのレンダリング時にエラーが起きていました
3.  6.1.44で対応

### -- 手段 --

1.  Editor9を選択
2.  Termモードにする
3.  `stomach  ache`の間の連続した空白を選択する
4.  選択が解除されて、何もおきないこと

## 作ってUndoしてもキーボードショートカットが有効

### 背景

1.  4.3.4からキーボードイベントをbody全体からeditor単位でとるように変更
2.  editorかその子要素（SpanかEntity Type）がフォーカスを持っていないとキーイベントが拾えない
3.  通常の削除時は右要素を自動選択する
4.  作成のUndo時は、削除を実行するが、自動選択しない
5.  Focus対象がなくなった時に自動でeditorを選択するようにした

### -- 手段 --

#### Termモード

1.  Termモードにする
2.  Spanを作成する
3.  Spanが選択されること
4.  Undoする
5.  Spanが削除されること
6.  `Hキー`を押してキーボードヘルプが表示されること

#### Relationモード

1.  Relationモードにする
2.  Relationを作成する
3.  Undoする
4.  Relationが削除されること
5.  `Hキー`を押してキーボードヘルプが表示されること

## ステータスバーの表示

### URLが長いときは...を表示する

#### 背景

1.  URLが長い場合に、 `Source:` の後ろで改行され、URLがフッターの範囲外に出てしまい表示されていませんでした
2.  5.0.0 からステータスバーに表示するURLが長いときは省略して表示し、改行されないようにしました

#### -- 手段 --

1.  Editor0を選択
2.  ブラウザの幅を縮める
3.  URLの末尾が切れて`...`が表示されること

### annotationsファイルをURLで読み込んだとき

1.  絶対URLパスで読み込んだとき、ファイルの絶対パスが表示されること（editor0）
2.  絶対URLパスで読み込んだとき、リンクが開けること（editor0）
3.  相対URLパスで読み込んだとき、ファイルの絶対パスが表示されること（editor1）
4.  相対URLパスで読み込んだとき、リンクが開けること（editor1）

### annotationsファイルをローカルファイルから読み込んだとき

1.  annotationsファイルのファイル名と`(local file)`が表示されること

### annotationsをinlineで指定したとき

1.  inlineでannotationsファイルを読み込んだ場合は`inline`が表示されること（editor5）

## autocompletion_ws属性

### autocompletion_ws属性でURLを指定すると、オートコンプリートの候補を指定URLから取得する

1.  <http://localhost:8000/dist/demo/bionlp-st-ge/demo-multi.html> を開く
2.  一つ目のEditorを選択する
3.  Entityを選択する
4.  `Change Label[W]`ボタンを押す
5.  既存のValueを消す
6.  `Lig`を入力
7.  候補に`Light stuff@http://www.yahoo.co.jp`が表示されること

### autocompletion_ws属性が指定されていなくても、configからオートコンプリートの候補を取得

1.  <http://localhost:8000/dist/demo/bionlp-st-ge/demo-multi.html> を開く
2.  二つ目のEditorを選択する
3.  Entityを選択する
4.  `Change Label[W]`ボタンを押す
5.  既存のValueを消す
6.  `pro`を入力
7.  候補に`production company@http://dbpedia.org/ontology/productionCompany`が表示されること

## 親Spanを選択してのばす

### 背景

1.  6.0.0で、意図せずに、アンカーノードの親が選択されているときだけ、Spanを伸ばすように変更していた
2.  6.1.35で、アンカーノードの先祖ノードが選択されていれば、Spanを伸ばすように修正して、対応した

### -- 手段 --

1.  親のSpanを選択
2.  子の上でmousedownして、親Spanの外でmouseupして、親Spanをのばす
3.  戻す

## 親子Span編集

### 子Spanを選択して縮める

1.  子のSpanを選択
2.  親の範囲外でmousedownして、子Spanの中でmouseupして、子spanを縮める
3.  戻す

### 親子Spanを作る

#### 背景

1.  5.0.0の開発中にAttributeを含めたGridの位置計算が上手く行かず、Gridが重なりあうことがありました。

#### -- 手段 --

1.  Termモードにする
2.  Spanを作る
3.  親Spanを作る
4.  Gridが重なりあわないこと
5.  Simpleモードにする
6.  Gridが重なりあわないこと

### Typeを２つ持つSpanに親を作る

#### 背景

1.  Gridの高さを子のSpanのTypeにかぶらないように上にずらしています

#### -- 手段 --

1.  Typeを二つ持つSpanに親を作る
2.  親のTypeが二つのTypeの上に表示されること

### 入れ子Spanを編集

1.  子のSpanを親の範囲内でのばす
2.  親のSpanを子にかぶらないように縮める
3.  戻す

### 同じサイズに

1.  親を子と同じサイズに縮める
2.  消える

### 親子Spanを入れ替える

1.  親Spanと子Spanの片側をあわせる
2.  親Spanの合っていない側を子Spanの内側に寄せる
3.  親と子のTypeの位置が入れ替わること

## 兄弟Spanを親Spanにする

### 背景

1.  5.2.1, 5.2.2で並んだ兄弟Spanの片方を伸ばすして、端を共有する親子Spanにする操作を便利にしました
2.  以前は、一度両側がはみ出た大きな親Spanにしてから、はみ出た部分を縮める操作が必要でした
3.  5.2.1で、親にしたいSpanを選択して、伸ばして子にしたいSpanの上でmouse upして、端を共有する親Spanにできるようになりました
4.  5.2.2で、親にしたいSpanを選択して、伸ばして子にしたいSpanの上にブラウザのセレクションが有る状態で、テキスト間の空白領域でmouse upして、端を共有する親Spanにできるようになりました

#### -- 手段 --

##### 兄弟Spanを親Spanにする

1.  Termモードにする
2.  Spanを作る
3.  兄弟になるSpanを作る
4.  片方のSpanをもう片方のSpanを覆う範囲に広げる
5.  親子Spanになること

##### 兄弟Spanを端を共有する親Spanにする（Span上でmouse up）

1.  Termモードにする
2.  Spanを作る
3.  兄弟になるSpanを作る
4.  片方のSpanを選択する
5.  選択したSpanをもう片方のSpanの反対側の端と同じ範囲まで広げる（span上でmouse upすること）
6.  親子Spanになること

##### 兄弟Spanを端を共有する親Spanにする（行間上でmouse up）

1.  Termモードにする
2.  Spanを作る
3.  兄弟になるSpanを作る
4.  片方のSpanを選択する
5.  選択したSpanをもう片方のSpanの反対側の端と同じ範囲まで広げる（テキストとテキストの行間の空白領域でmouse upすること）
6.  親子Spanになること

## 選択中に削除すると右の要素を選択する

### 背景

1.  6.1.1で一つのdenotationを一つのエンティティに表示することしました。

### Span

1.  Spanを選択する
2.  Spanを削除する
3.  右のSpanが選択されること

### Entity

1.  Entityを選択する
2.  Entityを削除する
3.  右のEntityが選択されること

### Spanを縮めて消した時に、次のSpanを選択

#### 背景

1.  4.4.1で対応
2.  ボタンか`d`キーでSpanを削除した時は、右のSpanを選択していたが、Spanを縮めて削除した時は選択していなかった

#### Boundary Detection有効時

##### Spanの耳をひっぱて縮める

1.  Termモードにする
2.  `Boundary Detection`ボタンを押下状態にする
3.  Spanを選択せずに右から縮めてSpanを消す
4.  右のSpanが選択されること
5.  Spanを選択せずに左から縮めてSpanを消す
6.  右のSpanが選択されること
7.  Spanを選択して右から縮めてSpanを消す
8.  右のSpanが選択されること
9.  Spanを選択して左から縮めてSpanを消す
10. 右のSpanが選択されること

#### Boundary Detection無効時

##### Spanの耳をひっぱて縮める

1.  Termモードにする
2.  `Boundary Detection`ボタンを押上状態にする
3.  Spanを選択せずに右から縮めてSpanを消す
4.  右のSpanが選択されること
5.  Spanを選択せずに左から縮めてSpanを消す
6.  右のSpanが選択されること
7.  Spanを選択して右から縮めてSpanを消す
8.  右のSpanが選択されること
9.  Spanを選択して左から縮めてSpanを消す
10. 右のSpanが選択されること

### Relationは選択解除

1.  Relationを選択する
2.  Relationを削除する
3.  選択解除されること

## Editorの自動選択

### 背景

1.  1画面に複数のエディタを組み込めるように、エディタの選択は外部スクリプトで行っています
2.  5.2.4まではsetTimeoutを使って、選択時間を遅らせて自動選択していました
3.  textaeのfocusイベントリスナーはloadイベントでバインドしています
4.  htmlの読み込みに時間がかかった場合、textae側がlistenする前に、外部スクリプトがfocusし自動選択に失敗していました
5.  5.2.5で、外部スクリプトをloadイベントで実行することで確実にエディタが自動選択されるようになりました

### -- 手段 --

1.  Editor0が自動選択されること

## 行の高さを変更してannotationを読み直すと行が再計算されること

### 背景

1.  ファイルを読み直したときに行の高さを再計算していませんでした
2.  4.4.3で再計算することにしました

### -- 手段 --

1.  Settingダイアログで行の高さを変更する
2.  行の高さが変わること
3.  Gridの位置が変わること
4.  読込みダイアログを表示
5.  URLからannotationを読み込む
6.  行の高さが再計算されること

## Entity選択

### 背景

1.  5.0.0でラベルの下にAttributeを表示するようになりました。
2.  Attributeをクリックした際もラベルをクリックしたのと同様に、すべてのEntityを選択します。
3.  6.1.1で一つのdenotationを一つのエンティティに表示することしました。

### -- 手段 --

1.  Termモードにする
2.  EntityをクリックするとEntityが選択される
3.  ラベルをクリックするとEntityが選択される
4.  AttributeをクリックするとEntityが選択される

## 左右キーで選択Entityを変更

### 背景

1.  左右キーで移動するEntityの順序をDOMの順序から取得します
2.  Gridを作るときは右のSpanのGridの前に挿入します
3.  6.1.26 で右のSpanのGridの取得に失敗して、作成したGridを、常に最後尾に追加していました
4.  左右キーで移動するEntityの順序が、見た目上のGridの順序ではなく、追加した順になっていました
5.  6.1.29で対応しました。

### -- 手段 --

1.  既存のSpanより左にSpanを追加する
2.  追加したSpanのEntityを選択する
3.  `右キー`を押す
4.  右隣のEntityが選択されること
5.  `左キー`を押す
6.  左隣のEntityが選択されること

### 左右キーで端っこより先に選択を変更できない

#### Termモード

1.  先頭のEntityを選択する
2.  `左キー`を押す
3.  選択するEntityが変わらないこと
4.  最後のEntityを選択する
5.  `右キー`を押す
6.  選択するEntityが変わらないこと

#### Simpleモード

1.  先頭のEntity labelを選択する
2.  `左キー`を押す
3.  選択するEntity labelが変わらないこと
4.  最後のEntity labelを選択する
5.  `右キー`を押す
6.  選択するEntityが変わらないこと

#### Relationモード

1.  先頭のEntityを選択する
2.  `左キー`を押す
3.  選択するEntityが変わらないこと
4.  最後のEntityを選択する
5.  `右キー`を押す
6.  選択するEntityが変わらないこと

## EntityとRelationを同時に選択した時のLabel編集はRelationのLabelを表示

### 背景

1.  selectionModelはidだけを保持しています
2.  idは外部（anntation.js）から指定されることがあります
3.  idだけでは何を選択しているかわかりません
4.  selectionModelはEntityとRelationに分かれています
5.  編集モードに応じて参照するselectionModelを切り替えます

### -- 手段 --

1.  Relationモードにする
2.  Entityを選択する
3.  Ctrlを押しながらRelationを選択する
4.  Labelを編集する
5.  Relationの元の文字列が表示されること

## 新しく作ったRelationをラベルを使って複数選択

1.  新規にRelationを作る
2.  他のRelationを選択
3.  Ctrlを押しながら新しく作ったRelationのラベルをクリック
4.  両方のRelationが選択されること

## Ctrl/Cmdを押して複数選択 Termモード

1.  Termモードにする
2.  要素を複数選択する
    1.  Span
    2.  Entity
    3.  Relation
3.  SpanとEntityは同時に選択できる

## Ctrl/Cmdを押して複数選択 Relationモード

### 背景

1.  5.0.5でEntity -> Relationの順で選択した際に、Ctrl/Cmdを押していなくても、両方選択されるバグが発生
2.  6.1.28で対応

### -- 手段 --

1.  Relationモードにする
2.  Entityを選択する
3.  Relationをクリックする
4.  Entityの選択が解除され、Relationが選択されること
5.  Entityをクリックする
6.  Relationの選択が解除され、Entityが選択されること
7.  Ctrl/Cmdを押してRelationをクリックする
8.  EntityとRelationが両方選択されること

## 自動レプリケーション機能

### Boundary Detection有効時の動作

1.  `Auto Replicate`ボタンを押下状態にする
2.  単語の一部を選択する
3.  単語単位でレプリカが作られること

### Boundary Detection無効時の動作

1.  `Auto Replicate`ボタンを押下状態にする
2.  単語の一部を選択する
3.  文字単位でレプリカが作られること

## 手動レプリケーション機能

### Boundary Detection有効時の動作

1.  Spanを選択する
2.  `Replicate`ボタンを押下する
3.  単語単位でレプリカが作られること

### Boundary Detection無効時の動作

1.  Spanを選択する
2.  `Replicate`ボタンを押下する
3.  文字単位でレプリカが作られること

### 元SpanのTypeのAttributeをコピーすること

#### 背景

1.  4.4.1でSpanをレプリケーションする際につけるTypeをdefaultから、元SpanについているTypeに変更しました
2.  5.0.0でEntityのTypeにAttributeが追加されました
3.  Attributeもレプリケーションできるようになりました

#### -- 手段 --

1.  Termモードにする
2.  レプリケーション可能な文字列のSpanにTypeを二種類以上、いずれかのTypeに複数のEntity、1つ以上のAttributeを作る
3.  上記Spanだけを選択する
4.  `Replicate Span annotation [R]`ボタンを押下する
5.  レプリカが作られること
6.  レプリカに、選択していたSpanのType（1つのラベルとすべてのAttribute）のEntityが一つずつ作られること

## ステータスバーの表示非表示

### 背景

1.  4.1.6でステータスバーのデフォルト非表示になりました
2.  status_barオプションで切り替えます
3.  値はonとoffの２つです

### -- 手段 --

1.  属性のstatus_barにonを指定するとステータスバーが表示されること（editor1）
2.  属性のstatus_barを指定しないとステータスバーが表示されないこと（editor2）

## Numeric AttributeのObjectを編集した後も、objの型がNumber型であること

### 背景

1.  5.0.4 からNumeric AttributeのObjectを専用のダイアログで編集出来るようになりました。
2.  Numeric AttributeをObjectを編集した際に、input要素の入力値をNumber型に変換せずに設定していたため、objの型が文字列型に変わっていました。
3.  5.2.7で、Number型への変換を追加して、対応しました。

### -- 手段 --

1.  Editor1を選択
2.  Termモードにする
3.  AttributeのないEntityを選択する
4.  `4`キーを押してNumeric Attributeを追加する
5.  `4`キーを押してNumeric Attributeの編集ダイアログを開く
6.  Objectの値を変更して、OKボタンが押す
7.  Save Annotationダイアログを開く
8.  `Click to see the json source in a new window.`リンクをクリックする
9.  表示されたAnnotation内のattributes配列の最後のattributeのobjがNumber型である(ダブルクォートされていない)こと

## 削除してUndoしてもキーボードショートカットが有効

### 背景

1.  4.3.4からキーボードイベントをbody全体からeditor単位でとるように変更
2.  editorかその子要素（SpanかEntity Type）がフォーカスを持っていないとキーイベントが拾えない
3.  通常の作成時は新要素を自動選択する
4.  削除のUndo時は、作成を実行するが、自動選択しない
5.  Undoの時は自動でeditorを選択するようにした

### -- 手段 --

#### Termモード

1.  Termモードにする
2.  Spanを削除する
3.  右のSpanが選択されること
4.  Undoする
5.  Spanが作成されること
6.  `Hキー`を押してキーボードヘルプが表示されること

#### Relationモード

1.  Relationモードにする
2.  Relationを削除する
3.  Undoする
4.  Relationが作成されること
5.  `Hキー`を押してキーボードヘルプが表示されること

## ダイアログを閉じたときにEditorが選択されている

### 背景

1.  jQueryダイアログの閉じるボタンをクリックしたときに、Editor外をクリックしたと判定してEditorの選択を解除していました
2.  4.5.0でjQueryダイアログ上のクリックイベントを無視するようにしました

### -- 手段 --

1.  Editor1を選択
2.  `Hキー`を押す
3.  キーボードヘルプが表示されること
4.  右上のXボタンをクリックする
5.  Editor1を選択されたままであること（背景色がベージュ）

## inline annotationを読み込んだときにコントロールが初期化されること

1.  Editor5を選択する
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
2.  現状では、保存ダイアログのURL欄に、`source`パラメーターで指定したannotation.jsonのURLを初期表示します。
3.  `save_to`パラメーターが指定されている場合は、`save_to`パラメーターのURLを表示します。

### -- 手段 --

1.  editor6を選択
2.  アノテーション読込みダイアログを表示する
3.  URL欄に`../../dev/3_annotations.json`が表示されること
4.  アノテーション保存ダイアログを表示する
5.  URL欄に`http://pubannotation.org/projects/penguin-fly/docs/sourcedb/PubMed/sourceid/10089213/annotations.json`が表示されること

### コンフィグレーション保存ダイアログには影響を与えない

1.  editor6を選択
2.  `Select Label [Q]`ボタンをクリックする
3.  コンフィグレーション保存ダイアログを開く
4.  URL欄が空であること

## multi tracks

### Editモード

#### 背景

1.  multi tracksでもjson上のannotation.textの位置は変わりません。
2.  JSON validatorの導入時にannotation.textをtrack内から取ろうとするバグがありました。
3.  4.1.10でalertからトーストに表示方法を変更しました
4.  5.0.0で`Upload`ボタンの制御を有効無効から、星マークの有無に変更しました

#### -- 手段 --

1.  multi_tracks.jsonが読み込めること
2.  読み込んだ時にトーストが表示されること
3.  文面は`track annotations have been merged to root annotations.`
4.  Relationにtrack idが表示されること
5.  `Upload`ボタンに星マークがつくこと

### Viewモード

#### 背景

1.  4.1.13からViewモードでは、トーストを表示しません
2.  4.1.13からViewモードでは、`Upload`ボタンを有効にしません
3.  4.5.6からViewモードでも、トーストを表示します
4.  5.0.0で`Upload`ボタンの制御を有効無効から、星マークの有無に変更しました

#### -- 手段 --

1.  Editor2を開く
2.  Viewモードにする（View-SimpleモードでないとTermモードに自動遷移します）
3.  `multi_tracks.json`を開く
4.  読み込んだ時にトーストが表示されること
5.  文面は`track annotations have been merged to root annotations.`
6.  `Upload`ボタンに星マークがつくこと

## TypeGap

### TypeGapのデフォルト値

1.  Settingダイアログを開く
2.  Simpleモードが0（変更不可）
3.  Termモードが2
4.  Relationモードが2

### TypeGapを変更したらLineHeightを自動計算する

1.  TypeGapを変更したらLineHeightを自動計算する
2.  Setting DialogのLineHeightの値が更新されること
3.  Gridが正しい位置に表示されること

### 一回Simpleモードにしてから元のモードに戻したときにTypeGapの値が保存されている

#### 背景

1.  TypeGapの値を保存しなくなっていた。
2.  4.1.8で修正

#### -- 手段 --

1.  Relationモードにする
2.  TypeGapを3にする
3.  Simpleモードにする
4.  TypeGapが0になること
5.  Relationモードにする
6.  TypeGapが3になること

## ショートカットキー

### 全体的な動作確認

#### 背景

1.  ショートカットキーを見直したので動作確認

#### -- 手段 --

1.  図が正しくでること
2.  図の通りに動作すること

## ラベル編集時にオートコンプリートを表示して、ダイアログをクリックすると、次からオートコンプリートがダイアログの下に表示される

#### 背景

1.  ラベル編集時にオートコンプリートの候補を表示して、ダイアログをクリックしたとき、ダイアログのz-indexがインクリメントされ、オートコンプリートの候補のz-indexより大きくなります。以降、オートコンプリートの候補を表示した際にダイアログの裏に表示されます。4.4.2で対応
2.  5.0.0の開発中に、ダイアログ内のinput要素をクリックしたときに再現することを発見。5.0.5で対応しました

#### -- 手段 --

1.  Editor1を選択
2.  Termモードにする
3.  Entityを選択する
4.  `Change Label[W]`ボタンを押す
5.  既存のidを消す
6.  `par`を入力
7.  候補に`parent@http://dbpedia.org/ontology/parent`が表示されること
8.  編集ダイアログのinput要素をクリックする
9.  `par`を入力しなおす
10. 候補に`parent@http://dbpedia.org/ontology/parent`が表示されること

## Spanの全Entityを消したときにSpanも一緒に削除する

### 背景

1.  EntityのないSpanを削除する機能があります
2.  Entityを一つずつ消して行く場合は正常に動いていました
3.  Entityを複数選択してまとめて消してSpanのEntityがなくなったときに、Spanが残るバグがありました
4.  4.1.8で対応しました
5.  4.2.1の開発中に、Span削除時にunfocusするためのDOM要素が取得できずにエラーが起きました

### -- 手段 --

1.  Spanに複数のEntityを作る
2.  Spanを選択解除する
3.  すべてのEntityを選択し、削除
4.  Spanが削除されること

## Spanを選択して削除

### 背景

1.  4.2.1の開発中に、Span削除時にunfocusするためのDOM要素が取得できずにエラーが起きました

### -- 手段 --

1.  Spanを選択する
2.  `Dキー`を押す
3.  選択したSpanが削除されること
4.  Spanを選択する
5.  `Deleteボタン`（ゴミ箱アイコン）を押す
6.  選択したSpanが削除されること

## Setting Dialog

### タイトル

#### 背景

1.  タイトルを変更しました。

#### -- 手段 --

1.  Setting Dialogを開く
2.  Setting Dialogのタイトルが`Setting`であること

### 設定項目

#### 背景

1.  4.1.16で、instance/Simpleモードの切り替えチェックボックスを消しました
2.  5.3.2で、バージョン番号の表示を追加しました

#### -- 手段 --

1.  Setting Dialogを開く
2.  Type Gapがあること
3.  Line Heightがあること
4.  Versionがあること

### Line Heightをpxで指定

#### 背景

1.  4.1.12でLine Heightの単位をpxに変えました
2.  4.1.11までは指定値x16pxを行の高さに設定していました
3.  4.2.1で、LineHeightを変更してもGridが移動しなくなっていました

#### -- 手段 --

1.  Setting Dialogを開く
2.  Line Heightを増やす
3.  行の高さがpx単位で変更できること
4.  最大500pxまで選べること
5.  設定した値に応じて行の高さが変わること
6.  行の高さに合わせてGridが移動すること

## パスに日本語を含むURLからannotationsファイルを読み込んだときにステータスバーにデコードしたURLを表示する

### 背景

1.  5.0.0の開発中にステータスバーにパスが表示されないURLを発見しました。
2.  パスに日本語を含むURLをURLエンコードしたままステータスバーに表示すると、URLが長くなりすぎます
3.  Firefoxでは一定長で切られ、ChromeとSafariでは改行されて、見えなくなります
4.  長過ぎるURLを省略して表示するで統一してもいいのですが、人間が見たいのはデコードしたURLなので、ステータスバーに表示する
    URLをデコードします

### -- 手段 --

1.  <http://pubannotation.org/projects/%E6%96%B0%E7%9D%80%E8%AB%96%E6%96%87%E3%83%AC%E3%83%93%E3%83%A5%E3%83%BC/docs/sourcedb/FirstAuthor/sourceid/10005/divs/0/annotations.json> を読み込む（現在このファイルはありません。）
2.  ステータスバーに表示されるURLがデコードされていて、日本語になっていること

## pubannotation認証

### 背景

1.  6.1.14 からPubAnnotationの認証に対応しました。
2.  textaeはPubAnnotationのエディタとして利用可能です。
3.  PubAnnotationでは、ログインしていないユーザからの保存リクエストにはログインを促します。
4.  PubAnnotationでは、ダイジェスト認証とGoogle OAuth2認証を選択可能にするためにログインページを開きます。
5.  PubAnnotationは、401レスポンスに独自のヘッダー（WWW-AuthenticateにServerPageを指定し、Locationヘッダーでログイン画面の場所を指示）を返却します。

### 手段

1.  保存ダイアログを開く
2.  URLに`/dev/server_auth`を入力して、Saveボタンを押す
3.  ポップアップウインドウが開き`This is a dummy atuth page!`と表示されること
4.  ポップアップウインドウをとじる
5.  右上に`could not save`と赤色のトースト表示がされること

## 選択してアノテーションを読み込んでエラーが起きない

### 背景

1.  6.1.39で発生
2.  SelectionModel中で選択解除された、モデルからSpanモデルインスタンスを取得し、表示上の選択状態を選択解除にする
3.  アノテーションファイルを読み直したときは、モデル上のSpanモデルインスタンスが取得できずに、エラーになっていました
4.  6.2.25で対応。Spanモデルインスタンスが取得できないときは、表示上の選択状態を選択解除しなくしました
5.  さらにSelectionModelでSpanモデルインスタンスの参照を保持し、選択解除のときに、モデルからインスタンスを取得するのをやめました

### -- 手段 --

1.  Spanを選択する
2.  別のアノテーションファイルを読み込む
3.  エラーが起きないこと
