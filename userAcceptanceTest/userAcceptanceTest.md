# 受け入れテスト

共通確認項目

1.  `npm run dist`を実行します
2.  `npm run dev:server`を実行します
3.  <http://localhost:8000/dist/demo/development.html> を開きます
4.  ブラウザの開発ツールを起動します。
5.  以下のテストを実行して、エラーが出ないこと

## Entity 編集ダイアログに Entity と Attribute の情報を表示

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
14. 6.4.90 　で、ショートカットキーを表示した際、編集後の保存用の pred と表示用の pred を分けていなかったため、編集ダイアログを開いて閉じるだけで、エラーが起きていました
15. 6.4.92 で、対応しました

### DenotationEntity

1.  Editor1 を選択
2.  Term モードにする
3.  DenotationEntity `E1:a:b` を選択する
4.  `Change Label[W]`ボタンを押す
5.  編集ダイアログが開くこと
6.  ダイアログのタイトルが`Please edit type and attributes`であること
7.  1 行目の`Predicate`カラムに`type`、`Value`カラムに`null`が表示されること
8.  2 行目の`Predicate`カラムに`1:denote`、`Value`カラムに`equivalentTo`が表示されること
9.  2 行目の`Predicate`カラムと`Value`カラムがテキストであること
10. 2 行目の編集ボタンと削除ボタンにアイコンが表示されていること
11. 3 行目の`Predicate`カラムに空文字、`Value`カラムに`http://www.yahoo.co.jp/eeeeeeeeeeeeeeeeeoaoeuaoeuaoue`が表示されること
12. `OK`ボタンをクリック
13. エラーが起きないこと

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

## パレットの Attribute タブの Attribute 情報フォーマット

1. 6.4.48 で、文言を変更しました。
2. 6.4.49 で、文言に選択中のアイテムの数を追加し、ボタンの文言を短くしました。
3. 6.4.50 で、アイテムを選択していないときは、ボタンを表示しなくしました。
4. 6.4.51 で、value type の説明をアイコンに変更しました。
5. 6.4.55 で、Attribute 追加変更削除ボタンの表示・非表示切り替えを、有効・無効切り替えに変更しました
6. 6.4.88 で、6.4.53 で選択アイテム数が表示されなくなっていたのを、直しました
7. 6.4.91 で、6.4.88 でアトリビュート定義がないときにパレットを開くとエラーが起きていたのを直しました。

### Attribute 定義がないとき

1. Editor を選択
2. Term モードにする
3. `q` キーを押してパレットを開く
4. エラーが起きないこと

### Attribute 定義があるとき

1. Editor1 を選択
2. Term モードにする
3. Attribute のない Entity を一つ選択する
4. `q` キーを押してパレットを開く
5. `denote` タブを選ぶ
6. `Attribute "denote" ([list icon]) type) [add to] [remove from] the 1 item selected`が表示されること
7. `add to`ボタンが有効であること
8. `remove from`ボタンが無効であること
9. `error` タブを選ぶ
10. `Attribute "score" ([checkbox icon] type) [add to] [edit object of] [remove from]the 1 item selected` が表示されること
11. `add to`ボタンが有効であること
12. `edit object of`ボタンが無効であること
13. `remove from`ボタンが無効であること
14. Entity の選択を解除する
15. `q` キーを押してパレットを開く
16. `denote` タブを選ぶ
17. `Attribute "denote" ([list icon]) type)`が表示されること
18. `error` タブを選ぶ
19. `Attribute "error" ([checkbox icon] type)` が表示されること

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

#### DenotationEntity 編集ダイアログ

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

#### BlocknEntity 編集ダイアログ

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

#### Relation 編集ダイアログ

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

## Selection Attribute の編集

### 背景

1.  5.0.0 で、Attribute を追加するためにのショートカットキー T を追加しました
2.  5.0.2 で、1~5 のキーで選択中の Entity へ、Attribute を追加、shift と同時押しで削除するようにしました
3.  5.0.5 で、Attribute のショートカットキーを 1~9 までに増やしました
4.  5.2.0 で、Attribute のショートカットキー T を廃止しました
5.  5.2.3 で編集ダイアログの編集機能は廃止され、パレットを開くボタンに代わりました
6.  6.2.71 で Block モードでパレットが開けるようになりました
7.  6.2.79 で で Block モードで、ショートカットキー 1~9 で Attribute の追加ができるようになりました

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

### DenotationEntity の Attribute をショートカットキー操作で変更

1.  Editor1 を選択
2.  Term モードにする
3.  DenotationEntity を選択する
4.  1 キーを押す、Attribute を追加されること
5.  1 キーをもう一度押すと、Value 選択用のパレットが表示されること
6.  パレットの Value を押すと、選択中の DenotationEntity の該当 predicate の Attribute の Value が変更できること

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

## DenotationEntity 編集ダイアログの編集確定

### OK ボタン

1.  Term モードにする
2.  DenotationEntity を選択する
3.  `W`キーを押す
4.  編集ダイアログが開くこと
5.  文字を変更する
6.  `OK`ボタンを押す
7.  DenotationEntity の id が変わること

### Enter キー

1.  Term モードにする
2.  DenotationEntity を選択する
3.  `W`キーを押す
4.  編集ダイアログが開くこと
5.  文字を変更する
6.  `Enter`キーを押す
7.  DenotationEntity の id が変わること

## BlockEntity 編集ダイアログの編集確定

### OK ボタン

1.  Block モードにする
2.  BlockEntity を選択する
3.  `W`キーを押す
4.  編集ダイアログが開くこと
5.  文字を変更する
6.  `OK`ボタンを押す
7.  BlockEntity の id が変わること

### Enter キー

1.  Block モードにする
2.  BlockEntity を選択する
3.  `W`キーを押す
4.  編集ダイアログが開くこと
5.  文字を変更する
6.  `Enter`キーを押す
7.  BlockEntity の id が変わること

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

## 行の高さ調整アイコン

### 背景

1.  4.1.12 で行の高さ調整アイコンを追加しました
2.  4.1.16 の開発中にモジュール読み込み構文の修正漏れでエラーを起こしていました
3.  6.4.80 で、行の高さの計算に、BlockEntity の高さを含めることにしました

### -- 手段 --

1.  もっとも高い Grid を削除する
2.  `Adjust LineHeight`アイコンをクリックする
3.  高さが調整されること
4.  もっとも高い Grid より高い Grid を作る
5.  `Adjust LineHeight`アイコンをクリックする
6.  高さが調整されること
7.  Editor1 を選択
8.  Term モードにする
9.  すべての DenotationEntity を削除する
10. Block モードにする
11. BlockEntity に Attribute を追加する
12. 高さが調整されること

## line-height 変更

### 背景

1.  4.1.8 で text−box の下の隙間を小さくした
2.  4.1.16 の開発中にモジュール読み込み構文の修正漏れでエラーを起こしていました。

### -- 手段 --

1.  Seting ダイアログを開く
2.  line-height を変更する
3.  高さが再計算されること
4.  下側の隙間が狭いこと

## 行の高さ自動調整

### 背景

1.  6.0.0 から行の高さ自動調整機能を追加しました。
2.  6.0.3 から、エンティティをすべて消したときに、行の高さ指定を初期値にもどします。

### -- 手段 --

1.  Editor2 を選択
2.  `Auto Adjust LineHeight`アイコンを押下する
3.  Entity を追加する
4.  高さが調整されること
5.  Entity を削除する
6.  line-height が 14px になること

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

## パレットは画面からはみ出ない

### 背景

1. 6.4.78 でパレットをエディターの右端からはみ出ないようにしました

### 右

1.  Term モードにする
2.  右端ギリギリの Entity を選択する
3.  `Q`キーを押す
4.  パレットがエディターからはみ出ないこと

### 下

1.  Term モードにする
2.  一番下の行の Entity を選択する
3.  `Q`キーを押す
4.  パレットが画面からはみ出ないこと

## パレットはマウスカーソルの近くに開く

1.  Term モードにする
2.  `Select Label [Q]`ボタンをクリックする
3.  パレットがボタンの近くに開くこと
4.  `Q`キーを押す
5.  パレットがマウスカーソルの近くに開くこと

## パレットは画面サイズに合わせて縮小する

### 背景

1. 6.4.76 でパレットの幅の基準をブラウザのウインドウ幅からエディターの幅に変えました

### 上下

1.  Editor1 を選択
2.  Term モードにする
3.  ブラウザの上下のサイズ 350px 以下にする
4.  `Q`キーを押す
5.  パレットが画面からはみ出ないこと
6.  パレットの上下に 1px ずつ隙間ができること

### 左右

1.  Editor1 を選択
2.  Term モードにする
3.  ブラウザの左右のサイズをパレットより小さくする
4.  `Q`キーを押す
5.  パレットがエディターからはみ出ないこと
6.  パレットの左右に 1px ずつ隙間ができること

## パレットはドラッグできる

1.  Term モードにする
2.  Entity を選択する
3.  `Q`キーを押す
4.  パレットがドラッグアンドドロップで移動できること

## パレットのスクロールバー

### 背景

1.  パレットに、スクロールが必要ない場合も、横スクロールバーが表示されていました
2.  6.4.75 で横スクロールバーの常時表示をやめました

### -- 手段 --

1.  パレットを開く
2.  パレットの下部に横スクロールバーが表示されないこと

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

## モードに応じてパレットに表示する Type を変更

### Term モード

1.  Term モードにする
2.  パレットを開く
3.  Entity の Type が表示されること

### Term-Simple モード

1.  Term-Simple モードにする
2.  パレットを開く
3.  Entity の Type が表示されること

### Block モード

1.  Block モードにする
2.  パレットを開く
3.  Entity の Type が表示されること

### Block-Simple モード

1.  Block-Simple モードにする
2.  パレットを開く
3.  Entity の Type が表示されること

### Relation モード

1.  Relation モードにする
2.  パレットを開く
3.  Relation の Type が表示されること

### View モード

1.  View モードにする
2.  パレットが開けないこと

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

## Entity をホバーしたときの見た目

### 背景

1.  6.2.75 で Block モードに対応しました
2.  DenotationEntity はどのモードでもホバーするとシャドウがついていました
3.  BlockEntity のヒットエリアはホバー時にシャドウはついていませんでした
4.  6.4.64 で、この動作を統一し、選択できるモードのとき Entity をホバーするとシャドウをつける対応をしました。
5.  6.4.65 で、シャドウのほかに、カーソルを指にしました。
6.  6.4.66 で、リレーションモードのときに、常にカーソルが指になっていたのを、DenotationEntity と Relation だけに変更しました。

### -- 手段 --

1. Editor1 を選択
2. Term モードにする
3. DenotationEntity をホバーする
4. マウスカーソルが指になること
5. シャドウがつくこと
6. BlockEntity をホバーする
7. シャドウがつかないこと
8. Block モードにする
9. DenotationEntity をホバーする
10. シャドウがつかないこと
11. BlockEntity をホバーする
12. マウスカーソルが指になること
13. シャドウがつくこと
14. Relation モードにする
15. DenotationEntity をホバーする
16. マウスカーソルが指になること
17. シャドウがつくこと
18. BlockEntity をホバーする
19. シャドウがつかないこと
20. View モードにする
21. DenotationEntity をホバーする
22. シャドウがつかないこと
23. BlockEntity をホバーする
24. シャドウがつかないこと

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

## 該当アトリビュートをひとつ持つアイテムだけを選択しているときに、パレットの Attribute 編集ボタンを有効にする

### 背景

1. 6.4.59 で、Attribute 編集ボタンを有効にする条件を、選択アイテムが「一つでも該当アトリビュートを持つ」から「すべてが該当アトリビュートをひとつだけ持つ」に変えました
1. 6.4.60 で無効理由を title タグで記述します

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

## 該当アトリビュートを持つアイテムを選択しているときに、パレットの Attribute 削除ボタンを有効にする

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

## 該当アトリビュートを持たないアイテムを選択しているときに、パレットの Attribute 追加ボタンを有効にする

### 背景

1. 6.4.56 で Attribute 追加ボタンを有効にする条件を、選択アイテムが「一つでも該当アトリビュートを持つ」から「一つでも該当アトリビュートを持たない」に変えました
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
10. `score` タブを選ぶ
11. `Delete this predicate.`ボタンが有効であること

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
