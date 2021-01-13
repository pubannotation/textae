# 受け入れテスト

共通確認項目

1.  `npm run dist`を実行します
2.  `npm run dev:server`を実行します
3.  <http://localhost:8000/dist/demo/development.html> を開きます
4.  ブラウザの開発ツールを起動します。
5.  以下のテストを実行して、エラーが出ないこと

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

## Selection Attribute の編集

### 背景

1.  5.0.0 で、Attribute を追加するためにのショートカットキー T を追加しました
2.  5.0.2 で、1~5 のキーで選択中の Entity へ、Attribute を追加、shift と同時押しで削除するようにしました
3.  5.0.5 で、Attribute のショートカットキーを 1~9 までに増やしました
4.  5.2.0 で、Attribute のショートカットキー T を廃止しました
5.  5.2.3 で編集ダイアログの編集機能は廃止され、パレットを開くボタンに代わりました
6.  6.2.71 で Block モードでパレットが開けるようになりました
7.  6.2.79 で で Block モードで、ショートカットキー 1~9 で Attribute の追加ができるようになりました

### BlockEntity の Attribute を編集ダイアログから変更

1.  Editor1 を選択
2.  Block モードにする
3.  BlockEntity を選択する
4.  1 キーを押す
5.  Attribute が追加されること
6.  W キーを押す
7.  `Edit`ボタンを押す
8.  パレットが開くこと
9.  denote タブが選ばれていること

### DenotationEntity の Attribute を編集ダイアログから変更

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

### DenotationEntity の Attribute をショートカットキー操作で変更

1.  Editor1 を選択
2.  Term モードにする
3.  DenotationEntity を選択する
4.  1 キーを押す、Attribute を追加されること
5.  1 キーをもう一度押すと、Value 選択用のパレットが表示されること
6.  パレットの Value を押すと、選択中の DenotationEntity の該当 predicate の Attribute の Value が変更できること

## パレットから Selection Attribute の Value を連続的に変更できる

### 背景

1. jQueryUI Draggable Widget を使ってパレットをドラッグアンドドロップで移動できるようにしています
2. パレットでラベルをクリックして Entity と Relation のタイプを変えるとき、セレクションアトリビュートの Value を変えることができます
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

### -- 手段 --

#### Type 定義編集ダイアログ

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

#### DenotationEntity

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

#### BlocknEntity

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

#### Relation

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

## 親 Span を選択してのばす

### 背景

1.  6.0.0 で、意図せずに、アンカーノードの親が選択されているときだけ、Span を伸ばすように変更していた
2.  6.1.35 で、アンカーノードの先祖ノードが選択されていれば、Span を伸ばすように修正して、対応した

### -- 手段 --

1.  親の Span を選択
2.  子の上で mousedown して、親 Span の外で mouseup して、親 Span をのばす
3.  戻す

## 親子 Span 編集

### 子 Span を選択して縮める

1.  子の Span を選択
2.  親の範囲外で mousedown して、子 Span の中で mouseup して、子 span を縮める
3.  戻す

### 親子 Span を作る

#### 背景

1.  5.0.0 の開発中に Attribute を含めた Grid の位置計算が上手く行かず、Grid が重なりあうことがありました。

#### -- 手段 --

1.  Term モードにする
2.  Span を作る
3.  親 Span を作る
4.  Grid が重なりあわないこと
5.  Simple モードにする
6.  Grid が重なりあわないこと

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

## 兄弟 Span を親 Span にする

### 背景

1.  5.2.1, 5.2.2 で並んだ兄弟 Span の片方を伸ばすして、端を共有する親子 Span にする操作を便利にしました
2.  以前は、一度両側がはみ出た大きな親 Span にしてから、はみ出た部分を縮める操作が必要でした
3.  5.2.1 で、親にしたい Span を選択して、伸ばして子にしたい Span の上で mouse up して、端を共有する親 Span にできるようになりました
4.  5.2.2 で、親にしたい Span を選択して、伸ばして子にしたい Span の上にブラウザのセレクションが有る状態で、テキスト間の空白領域で mouse up して、端を共有する親 Span にできるようになりました

#### -- 手段 --

##### 兄弟 Span を親 Span にする

1.  Term モードにする
2.  Span を作る
3.  兄弟になる Span を作る
4.  片方の Span をもう片方の Span を覆う範囲に広げる
5.  親子 Span になること

##### 兄弟 Span を端を共有する親 Span にする（Span 上で mouse up）

1.  Term モードにする
2.  Span を作る
3.  兄弟になる Span を作る
4.  片方の Span を選択する
5.  選択した Span をもう片方の Span の反対側の端と同じ範囲まで広げる（span 上で mouse up すること）
6.  親子 Span になること

##### 兄弟 Span を端を共有する親 Span にする（行間上で mouse up）

1.  Term モードにする
2.  Span を作る
3.  兄弟になる Span を作る
4.  片方の Span を選択する
5.  選択した Span をもう片方の Span の反対側の端と同じ範囲まで広げる（テキストとテキストの行間の空白領域で mouse up すること）
6.  親子 Span になること

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

## Editor の自動選択

### 背景

1.  1 画面に複数のエディタを組み込めるように、エディタの選択は外部スクリプトで行っています
2.  5.2.4 までは setTimeout を使って、選択時間を遅らせて自動選択していました
3.  textae の focus イベントリスナーは load イベントでバインドしています
4.  html の読み込みに時間がかかった場合、textae 側が listen する前に、外部スクリプトが focus し自動選択に失敗していました
5.  5.2.5 で、外部スクリプトを load イベントで実行することで確実にエディタが自動選択されるようになりました

### -- 手段 --

1.  Editor0 が自動選択されること

## 行の高さを変更して annotation を読み直すと行が再計算されること

### 背景

1.  ファイルを読み直したときに行の高さを再計算していませんでした
2.  4.4.3 で再計算することにしました

### -- 手段 --

1.  Setting ダイアログで行の高さを変更する
2.  行の高さが変わること
3.  Grid の位置が変わること
4.  アノテーション読込ダイアログを表示
5.  URL から annotation を読み込む
6.  行の高さが再計算されること

## Entity 選択

### 背景

1.  5.0.0 でラベルの下に Attribute を表示するようになりました。
2.  Attribute をクリックした際もラベルをクリックしたのと同様に、すべての Entity を選択します。
3.  6.1.1 で一つの denotation を一つのエンティティに表示することしました。

### -- 手段 --

1.  Term モードにする
2.  Entity をクリックすると Entity が選択される
3.  ラベルをクリックすると Entity が選択される
4.  Attribute をクリックすると Entity が選択される

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

## Entity と Relation を同時に選択した時の Label 編集は Relation の Label を表示

### 背景

1.  selectionModel は id だけを保持しています
2.  id は外部（anntation.js）から指定されることがあります
3.  id だけでは何を選択しているかわかりません
4.  selectionModel は Entity と Relation に分かれています
5.  編集モードに応じて参照する selectionModel を切り替えます

### -- 手段 --

1.  Relation モードにする
2.  Entity を選択する
3.  Ctrl を押しながら Relation を選択する
4.  Label を編集する
5.  Relation の元の文字列が表示されること

## 新しく作った Relation をラベルを使って複数選択

1.  新規に Relation を作る
2.  他の Relation を選択
3.  Ctrl を押しながら新しく作った Relation のラベルをクリック
4.  両方の Relation が選択されること

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

## TypeGap

### TypeGap のデフォルト値

1.  Setting ダイアログを開く
2.  Simple モードが 0（変更不可）
3.  Term モードが 2
4.  Relation モードが 2

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

## ショートカットキー

### 全体的な動作確認

#### 背景

1.  ショートカットキーを見直したので動作確認

#### -- 手段 --

1.  図が正しくでること
2.  図の通りに動作すること

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
2.  4.1.11 までは指定値 x16px を行の高さに設定していました
3.  4.2.1 で、LineHeight を変更しても Grid が移動しなくなっていました

#### -- 手段 --

1.  Setting Dialog を開く
2.  Line Height を増やす
3.  行の高さが px 単位で変更できること
4.  最大 500px まで選べること
5.  設定した値に応じて行の高さが変わること
6.  行の高さに合わせて Grid が移動すること

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
