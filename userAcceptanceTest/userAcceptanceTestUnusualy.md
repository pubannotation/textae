# たまにやるテスト

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

### DenotationEntity

1.  Editor1 を選択
2.  Term モードにする
3.  DenotationEntity `E1:a:b` を選択する
4.  `Change Label[W]`ボタンを押す
5.  編集ダイアログが開くこと
6.  ダイアログのタイトルが`Please edit type and attributes`であること
7.  1 行目の`Predicate`カラムに`type`、`Value`カラムに`null`が表示されること
8.  2 行目の最初のカラムに`1`、`Predicate`カラムに`denote`、`Value`カラムに`equivalentTo`が表示されること
9.  2 行目の`Predicate`カラムと`Value`カラムがテキストであること
10. 2 行目の編集ボタンと削除ボタンにアイコンが表示されていること
11. 3 行目の`Predicate`カラムに空文字、`Value`カラムに`http://www.yahoo.co.jp/eeeeeeeeeeeeeeeeeoaoeuaoeuaoue`、`Label`カラムに`Regulation`が表示されること
12. 4 行目の最初のカラムに`4`、`Predicate`カラムに`score`、`Value`カラムに`0.1`、`Label`カラムに`Low`が表示されること
13. 5 行目の最初のカラムに`5`、`Predicate`カラムに`flee_text_predicate`、`Value`カラムに`1`、`Label`カラムに`High`が表示されること
14. 6 行目の最初のカラムに`7`、`Predicate`カラムに`Speculation`、`Value`カラムに`ture`、`Label`カラムに`?`が表示されること
15. テーブルの下に Attribute 追加ボタンがあること
16. Attribute 追加ボタンは 2 行表示されそれ以降を見るためにスクロールできること
17. Attribute 追加ボタンのラベルが Attribute の predicate であること
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
6.  6.4.66 で、リレーションモードのときに、常にカーソルが指になっていたのを、DenotationEntity と Relation だけに変更しました。

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

## Selection Attribute を編集ダイアログからパレットを開いて編集

### 背景

1.  5.0.0 で、Attribute を追加するためにのショートカットキー T を追加しました
2.  5.2.3 で編集ダイアログの編集機能は廃止され、パレットを開くボタンに代わりました

### DenotationEntity

1.  Editor1 を選択
2.  Term モードにする
3.  Attribute を持たない DenotationEntity を選択する
4.  `1` キーを押す
5.  Attribute が追加されること
6.  `W` キーを押す
7.  `Edit`ボタンを押す
8.  パレットが開くこと
9.  denote タブが選ばれていること

### BlockEntity

1.  Editor1 を選択
2.  Block モードにする
3.  Attribute を持たない BlockEntity を選択する
4.  `1` キーを押す
5.  Attribute が追加されること
6.  `W` キーを押す
7.  `Edit`ボタンを押す
8.  パレットが開くこと
9.  denote タブが選ばれていること

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
2.  コンフィグレーション読み込みダイアログを開く
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
4.  赤いトーストが表示されること
5.  右上に`Invalid configuration: '<span style='color:red'>Invalid color format</span>' is invalid color format.`と赤色のトースト表示がされること

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
3.  6.1.1 で上下キーがによる Span と Entity の選択切り替えをリレーションモードで動かなくしようとして、一緒にシンプルもーおでも動かなくしていました
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

## Term モード

### 背景

1.  4.1.18 で text を Relation より前に表示するようにしました。
2.  6.0.0 で text が Relation のラベルの後ろに隠れていて、背後のテキストを選択して Span がつくることができませんでした
3.  6.1.46 で対応しました

### -- 手段 --

1.  Term モードにする
2.  text が Relation と Relation のラベルの手前に表示されること
3.  Relation を持つ Entity をホバーする
4.  Relation と Relation のラベルが text の手前に表示されること
5.  Relation モードにする
6.  Relation と Relation のラベルが text の手前に表示されること
7.  View モードにする
8.  Relation と Relation のラベルが text の手前に表示されること

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

### スクロールしたときに Editor の表示領域上部に張り付く

#### 背景

1.  5.0.0 のコンテキストメニュー追加時に、コントロールバーのみ sticky して、コンテキストメニューは sticky しないことにしました。

#### -- 手段 --

1.  Editor を選択する
2.  ブラウザをスクロールする
3.  Editor がスクロールしても、コントロールバーがスクロールアウトせず、Editor の最上部にいつづけること
4.  ブラウザをもっとスクロールする
5.  Editor がスクロールアウトするときに、コントロールバーも一緒にスクロールアウトすること

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

## Relation をホバーする

1.  Relation モードにする
2.  Relation のラベルをホバーする
3.  Relation のラベルが濃くなること
4.  Relation の線が太くなること
5.  Relation の矢印が大きくなること

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

1.  Save Annotations ダイアログを開く
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
2.  6.1.6 で Save Configurations ダイアログの高さ制限をなくして、Diff の表示領域の縦スクロールバーの表示をやめました
3.  6.1.6 で Diff から変更のない項目を非表示にしました
4.  6.1.6 でリストの順序を変更したときに、移動を検知して Diff の量を小さくしました。

### -- 手段 --

1.  editor1 を選択
2.  `Select Label [Q]`ボタンをクリックする
3.  Type 定義を編集する
4.  Save Configurations ダイアログを開く
5.  `Configuration differences`に diff が表示されること
6.  diff 表示領域に縦スクロールバーが表示されないこと
7.  変更のない Entity の定義が Diff に表示されていないこと
8.  Download ボタンを押して保存する
9.  DenotationEntity の Protein の id を変更する
10. Save Configurations ダイアログを開く
11. diff に Entity Protein の変更のみ表示されていること

## 連続した BlockSpan の間に空行が挟まらない

### 背景

1.  6.2.0 で Block モードを追加しました
2.  BlockSpan を div で表現しているため、div 間に改行が挟まれ、1 行余計に隙間が空いていました
3.  6.2.114 で、BlockSpan に`display: inline-block`と`width: 100px`を指定して、改行しつつ、余計な空行は挟まらないようにしました

### -- 手段 --

1.  Editor1 を選択
2.  `block1`と`block2`の間に隙間がないこと

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

### 保存先 URL は、読み込んだコンフィグレーションの URL

#### 背景

1.  Save Configurations ダイアログの保存先 URL の初期値は、最後に読み込んだコンフィグレーションの URL です
2.  読み込んだアノテーションファイルにコンフィグレーションが含まれず、textae の HTML 属性でコンフィグレーションの URL が指定されているときは、指定 URL からコンフィグレーションを読み込みます。このときは読み込んだ URL を保存していませんでした。
3.  コンフィグレーション読込ダイアログから、不正なコンフィグレーションを読み込んだときに、コンフィグレーションを適用しません。その URL を保存していました。
4.  6.1.3 で対応しました

#### -- 手段 --

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
6.  5.0.0 の開発中、span の移動時に Grid の位置をキャッシュから削除したら、キャッシュ削除とリレーション移動が入れ違い、Grid の位置が取れずにエラーが発生しました

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
2.  アノテーションファイルに BlockEntity 間のリレーションを記述しても、リレーションの参照先として BlockEntity が見つからにためバリデーションエラーになっていました
3.  6.2.97 で対応しました。

### -- 手段 --

1.  Editor1 を選択
2.  BlockEntity の間にリレーションがあること

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

## 読み込んだアノテーションの typesettings に不正データが含まれていたら Validation Dialog に表示すること

### 背景

1.  6.2.17 で不正な範囲の typesettings 検出機能を追加しました
2.  6.2.19 でテキスト外の typesettings 検出機能を追加しました

### -- 手段 --

1.  invalid.json を読み込む
2.  Validation Dialog を表示すること
3.  `Wrong range typesettings.`に `begin` が `10` で `end` が `5` の typesetting が表示されること
4.  `Out of text typesettings.`に `begin` が `0` で `end` が `1786` の typesetting が表示されること

## Entity の見た目

### 背景

1.  6.2.28 で Entity のエンドポイントの表示をやめました。

### -- 手段 --

1.  Entity の上に丸が表示されないこと

## typesettings

### 背景

1.  6.0.0 で Typeset の表示に対応
2.  6.0.5 でアノテーションファイル上の Typeset のプロパティ名を`type stes`から`typesettings`に変更
3.  6.1.0 で、アノテーションファイルを読み直したときに、typesettings の情報をリセットしていないバグに対応
4.  6.1.9 で、ObjectSpan と完全一致する StyleSpan が表示されないバグがおきた
5.  6.1.11 で対応
6.  6.1.16 で、StyleSpan と完全一致する ObjectSpan を作れないバグに対応

### -- 手段 --

#### StyleSpan と完全一致する ObjectSpan を作成

1.  Editor1 を選択
2.  太字で斜体の`CpG`を Span にできること

#### リセット

1.  Editor1 を選択
2.  `1_annotations.json`以外のアノテーションファイルを読み込む
3.  太字、字下げ、字上げが表示されないこと

#### レンダリング

1.  Editor1 を選択
2.  1 行目の`Down-regulation`が斜体で表示されていること
3.  1 行目の`regulatory fact`が太字で表示されていること
4.  2 行目の`gene`が字下げして表示されていること
5.  2 行目の`euk`が字上げして表示されていること

#### Span 作成

1.  Editor1 を選択
2.  Style Span を子とする親 Span が作れること
3.  Style Span を親とする子 Span が作れること
4.  Style Span とクロスした Span が作れないこと

## エンティティを選択中かつ Shift キーを押している間に、Span をマウスクリックするとエラーが起きないこと

### 背景

1.  エンティティを選択中かつ Shift キーを押している間に、Span をマウスクリックするとエラーが起きます
2.  6.0.0 で対応しました。

### -- 手段 --

1.  エンティティを選択する
2.  Shift キーを押しながら、Span をマウスクリック
3.  エラーが起きないこと

## DenotationEntity 編集後も選択状態を保持

1.  Term-Simple モードにする
2.  Type を選択する
3.  Type を編集する
4.  Type 編集後もラベルが選択されていること

## オートコンプリートから Type 定義を追加更新したときの Undo

### 背景

1.  オートコンプリートで選択した Type を config に保存します
2.  Undo/Redo が可能です

### DenotationEntity の Type を追加

1.  Editor1 を選択
2.  Term モードにする
3.  `Select Label [Q]`ボタンをクリックする
4.  パレットに`http://dbpedia.org/ontology/parent`があること
5.  `http://dbpedia.org/ontology/parent`のラベルが空であること
6.  DenotationEntity を選択する
7.  `Change Label[W]`ボタンを押す
8.  `par`を入力
9.  `parent@http://dbpedia.org/ontology/parent`を選択する
10. `OK`ボタンを押す
11. `Select Label [Q]`ボタンをクリックする
12. パレットに`http://dbpedia.org/ontology/parent`があること
13. `http://dbpedia.org/ontology/parent`のラベルが`parent`であること
14. `Undo [Z]`ボタンをクリックする
15. DenotationEntity のラベルが変更前に戻ること
16. `Select Label [Q]`ボタンをクリックする
17. パレットに`http://dbpedia.org/ontology/parent`があること
18. `http://dbpedia.org/ontology/parent`のラベルが空であること

### BlockEntity の Type を追加

1.  Editor1 を選択
2.  Block モードにする
3.  `Select Label [Q]`ボタンをクリックする
4.  パレットに`http://dbpedia.org/ontology/parent`がないこと
5.  BlockEntity を選択する
6.  `Change Label[W]`ボタンを押す
7.  `par`を入力
8.  `parent@http://dbpedia.org/ontology/parent`を選択する
9.  `OK`ボタンを押す
10. `Select Label [Q]`ボタンをクリックする
11. パレットに`http://dbpedia.org/ontology/parent`があること
12. `http://dbpedia.org/ontology/parent`のラベルが`parent`であること
13. `Undo [Z]`ボタンをクリックする
14. BlockEntity のラベルが変更前に戻ること
15. `Select Label [Q]`ボタンをクリックする
16. パレットに`http://dbpedia.org/ontology/parent`がないこと

### Relation の Type を追加

1.  Editor1 を選択
2.  Relation モードにする
3.  `Select Label [Q]`ボタンをクリックする
4.  パレットに`http://dbpedia.org/ontology/parent`がないこと
5.  Relation を選択する
6.  `Change Label[W]`ボタンを押す
7.  `par`を入力
8.  `parent@http://dbpedia.org/ontology/parent`を選択する
9.  `OK`ボタンを押す
10. `Select Label [Q]`ボタンをクリックする
11. パレットに`http://dbpedia.org/ontology/parent`があること
12. `http://dbpedia.org/ontology/parent`のラベルが`parent`であること
13. `Undo [Z]`ボタンをクリックする
14. Relation のラベルが変更前に戻ること
15. `Select Label [Q]`ボタンをクリックする
16. パレットに`http://dbpedia.org/ontology/parent`がないこと

## Numeric Attribute 定義の`default`, `min`, `max`, `step`が Number 型であること

### 背景

1.  5.1.0 で、パレットから、Numeric Attribute の定義を追加する機能を追加しました。
2.  新規の Numeric Attribute の定義を追加する際に、input 要素の入力値を Number 型に変換せずに設定していたため、文字列型で作成していました。
3.  5.2.7 で、Number 型への変換を追加して、対応しました。

### -- 手順 --

1.  Editor1 を選択
2.  Term モードにする
3.  `Q`キーを押してパレットを開く
4.  `Add new attribute`タブをクリックする
5.  Attribute type を`numeric`に変更
6.  `Predicate`を入力する
7.  ,`Default`, `Min`, `Max`, `Step`に数値を入力する
8.  `OK`ボタンをクリックする
9.  パレットの`Upload`アイコンをクリック
10. Configuration differences に表示される、追加した Attribute 定義の`default`, `min`, `max`, `step`が Number 型である(ダブルクォートされていない)こと

## Configuration の自動更新

### 背景

1.  5.3.0 で、Configuration に Attribute 定義がないときに Attribute をふくむ Annotation ファイルを開けるように、Annotation ファイルの Attribute の情報から Attribute 定義を生成する機能を、導入しました
2.  5.3.5 から、config 中の SelectionAttribute 定義の values プロパティに default 値が無いときに、自動生成するようになりました。

### -- 手段 --

1.  Editor1 を選択
2.  パレットを開く
3.  `denote`のデフォルト値が`Cell`（annotaion 中で最も使われている値）であること
4.  `selection with empty values`のデフォルト値が`default`であること
5.  `selection with null values`のデフォルト値が`default`であること
6.  `selection without values`のデフォルト値が`default`であること
7.  自動生成された Attribute 定義`success`があること
8.  `success`が flag attribute であること
9.  自動生成された Attribute 定義`precision`があること
10. `precision`が numeric attribute であること
11. `precision`の min が 1.1 であること
12. `precision`の max が 100.002 であること
13. `precision`の step が 0.001 であること
14. `precision`の default が 10 であること
15. `remark`が string attribute であること
16. `remark`の default が suspicious であること

## config 指定

### 属性より annotation ファイル内を優先

#### 背景

1.  config 属性が指定されている場合、初期化時に config を読み込みます
2.  config 読み込みの完了がアノテーションよりあとになることがあるため、初期表示では config が優先されることがあります
3.  手動でアノテーションを読み込んだ際は、属性より annotation ファイル内をを優先します
4.  5.0.2 で annotation 属性と config 属性を同時に指定した時は、annotation ファイル内に config がないときだけ、config を読み込むことにしました。

#### -- 手段 --

1.  Editor1 を開く
2.  annotation 内の config が使用され、Protein がピンクであること
3.  config なし annotation を指定して Editor をひらく(2_annotations.json)
4.  config 属性の config が使用され、Protein が青であること

### config のない annotation を読み込んだら default タイプをリセットする

#### 背景

1.  5.0.0 の開発中に、config のない annotation を読み込んでも default タイプをリセットしないバグが起きました

#### -- 手段 --

1.  Editor0 を開く
2.  config ありの annotation を開く(1_annotation.json)
3.  config なしの annotation を開く(2_annotation.json)
4.  Term モードにする
5.  Span を作る
6.  Type が`something`であること
7.  パレットを開く
8.  Type が`something`だけであること

## BlockSpan をつくったときに TextBox の高さを調整する

### 背景

1.  6.2.0 からブロック機能を追加
2.  BlockSpan をつくるとテキストが折り返されるため、テキストの高さが変わります。
3.  変わったテキストの高さに合わせて TextBox の高さを調整する必要があります。
4.  6.2.29 で対応しました。

### -- 手段 --

1.  Editor4 を選択
2.  Block モードにする
3.  BlockSpan を追加する
4.  テキストがエディタの下にはみ出ていかないこと
5.  追加した BlockSpan を削除する
6.  テキストの下に余白ができないこと

## BlockEntity は TypeGap を表示しない

### 背景

1.  6.2.0 からブロック機能を追加
2.  BlockEntity は横に並ばないため、リレーションも横方向にのびません
3.  リレーションの出元を BlockEntity の上にする必要がなく、見やすくするために TypeGap をあける必要もありません
4.  6.2.81 で、BlockEntity の TypeGap をなくしました

### -- 手段 --

1.  Editor1 を選択
2.  `block1`に TypeGap（ラベルの上の空間）がないこと
3.  `block1`に Attribute を追加する
4.  `block1`に TypeGap（ラベルの上の空間）がないこと

## BlockEntity の色とラベル

### 背景

1.  6.2.0 からブロック機能を追加
2.  6.2.78 からブロックの Type 定義の色とラベルを BlockEntity に反映します

### -- 手段 --

1.  Editor1 を選択
2.  `block1`のラベルの背景色が赤系であること
3.  `block1`のラベルの文言が`Label of block1`であること

## エンティティパレットの左右キーで Attribute タブを切り替える

### Block モード

#### 背景

1.  6.2.77 で Block モードに対応しました

#### -- 手段 --

1.  Editor1 を選択
2.  Block モードにする
3.  パレットを開く
4.  右キーを押す
5.  Attribute タブが切り替わること

### Attribute がないとき

#### 背景

1.  5.2.0 から左右キーでタブを切り替えられるようにしました
2.  Attribute 定義がないときに、エンティティパレットを開いて右キーを押すとエラーが起きました
3.  6.2.70 で対応しました

#### -- 手段 --

1.  Editor0 を選択
2.  パレットを開く
3.  右キーを押す
4.  エラーが起きないこと

## ダイアログを開いているときに Editor をクリックしてもパレットを閉じない

### 背景

1.  jQueryUI ダイアログを開いた時に表示されるベールをクリックすると、Editor 外を選択したと判定して Editor の選択を解除していました
2.  jQueryUI ダイアログは閉じた時に、ダイアログを開いたときに選択していた要素を選択し直す機能があります。このため一見わかりません
3.  パレットはエディタの選択が解除された時点で、閉じます。
4.  ベールが表示されているのに、その下にあるものが操作できるように見えます。これに違和感があります
5.  5.0.0 で、jQueryUI ダイアログのベールをクリックイベントを無視する対応しました

### -- 手段 --

1.  `Select Label [Q]`ボタンをクリックする
2.  パレットが開くこと
3.  アノテーション読込ダイアログを開く
4.  ベールをクリックする
5.  パレットが閉じないこと

## パレットを開いて、Editor を選択解除するとパレットが閉じる

1.  Editor をクリックする
2.  Editor が選択されていること（背景色がベージュ）
3.  Term モードにする
4.  Entity を選択する
5.  `Select Label [Q]`ボタンをクリックする
6.  パレットがボタンの近くに開くこと
7.  一番上の input をクリックする
8.  Editor が選択解除されること（背景色が白）
9.  パレットが閉じること

## パレットを開きながらモードを変更したときに選択解除

### 背景

1.  Body クリック時は選択解除するときにパレットが開いていると選択解除しません。
2.  モード変更時も、パレットが開いていると選択解除していませんでした。
3.  モード変更時は、パレットを閉じるのと、選択解除を両方実行するようにしました。
4.  6.1.61 で対応しました。

### -- 手段 --

1.  Entity を選択する
2.  パレットを開く
3.  モードを変更する
4.  Entity が選択解除されること
5.  パレットが閉じること

## A キーを押してエラーが起きない

### 背景

1.  6.1.5 で、Commander をオブジェクトからクラスに変更したときに、メソッド呼び出しの修正もれで、メソッドにレシバーが渡せず、エラーが起きるようになりました
2.  6.2.73 で対応しました

### -- 手段 --

1.  `A`キーを押す
2.  エラーが起きないこと

## DenotationEntity の Type 定義の編集

### 背景

1.  5.0.0 で Type の編集機能にラベル変更とカラー変更を追加しました

### DenotationEntity の Type 定義を追加

1.  Term モードにする
2.  `Select Label [Q]`ボタンをクリックする
3.  `Add new type`ボタンをクリックする
4.  `Id`欄を入力する
5.  `Label`欄を入力する
6.  `Color`欄を変更する
7.  `Default Type`を選択する
8.  `OK`ボタンを押す
9.  パレットに追加した Type が表示されること
10. Type の使用数が 0 であること
11. 削除ボタンが有効であること
12. 新しく Span を作る
13. DenotationEntity のラベルが`Label`欄の文字列になること
14. すべてもどす
15. 追加した Type が消えること

### DenotationEntity の Type 定義を変更

1.  Term モードにする
2.  `Select Label [Q]`ボタンをクリックする
3.  `Edit this type`ボタンをクリックする
4.  `Id`欄を変更する
5.  `Label`欄を変更する
6.  `Color`欄を変更する
7.  `Default Type`を選択する
8.  `OK`ボタンを押す
9.  DenotationEntity のラベルが`Label`欄の文字列になること
10. 新しく Span を作る
11. Entity のラベルが`Label`欄の文字列になること
12. すべてもどす
13. 変更した Type がもとにもどること

### DenotationEntity の Type 定義を削除

1.  Term モードにする
2.  `Select Label [Q]`ボタンをクリックする
3.  `Remove this type`ボタンをクリックする
4.  Type が行ごと消えること
5.  すべてもどす
6.  変更した Type がもとにもどること

## BlockEntity の Type 定義の編集

### 背景

1.  6.2.71 で Block モードでパレットが開けるようになりました

### BlockEntity の Type 定義を追加

1.  Block モードにする
2.  `Select Label [Q]`ボタンをクリックする
3.  `Add new type`ボタンをクリックする
4.  `Id`欄を入力する
5.  `Label`欄を入力する
6.  `Color`欄を変更する
7.  `Default Type`を選択する
8.  `OK`ボタンを押す
9.  パレットに追加した Type が表示されること
10. Type の使用数が 0 であること
11. 削除ボタンが有効であること
12. 新しく Span を作る
13. BlockEntity のラベルが`Label`欄の文字列になること
14. すべてもどす
15. 追加した Type が消えること

### BlockEntity の Type 定義を変更

1.  Block モードにする
2.  `Select Label [Q]`ボタンをクリックする
3.  `Edit this type`ボタンをクリックする
4.  `Id`欄を変更する
5.  `Label`欄を変更する
6.  `Color`欄を変更する
7.  `Default Type`を選択する
8.  `OK`ボタンを押す
9.  BlockEntity のラベルが`Label`欄の文字列になること
10. 新しく Span を作る
11. Entity のラベルが`Label`欄の文字列になること
12. すべてもどす
13. 変更した Type がもとにもどること

### BlockEntity の Type 定義を削除

1.  Block モードにする
2.  `Select Label [Q]`ボタンをクリックする
3.  `Remove this type`ボタンをクリックする
4.  Type が行ごと消えること
5.  すべてもどす
6.  変更した Type がもとにもどること

## Relation の Type 定義の編集

### Relation の Type 定義を追加

1.  Relation モードにする
2.  `Select Label [Q]`ボタンをクリックする
3.  `Add new type`ボタンをクリックする
4.  `Id`欄を入力する
5.  `Label`欄を入力する
6.  `Color`欄を変更する
7.  `Default Type`を選択する
8.  `OK`ボタンを押す
9.  パレットに追加した Type が表示されること
10. Type の使用数が 0 であること
11. 削除ボタンが有効であること
12. 新しく Relation を作る
13. Relation のラベルが Relation ID と`Id`欄の文字列になること
14. すべてもどす
15. 追加した Type が消えること

### Relation の Type 定義を変更

1.  Relation モードにする
2.  `Select Label [Q]`ボタンをクリックする
3.  `Edit this type`ボタンをクリックする
4.  `Id`欄を変更する
5.  `Label`欄を変更する
6.  `Color`欄を変更する
7.  `Default Type`を選択する
8.  `OK`ボタンを押す
9.  コントロールバーの`Upload`ボタンに星マークがつくこと
10. Relation のラベルが Relation ID と`Id`欄の文字列になること
11. 新しく Relation を作る
12. Relation のラベルが Relation ID と`Id`欄の文字列になること
13. すべてもどす
14. 変更した Type がもとにもどること

### Relation の Type 定義を削除

1.  Relation モードにする
2.  `Select Label [Q]`ボタンをクリックする
3.  `Add new type`ボタンをクリックする
4.  `Id`欄を入力する
5.  `Label`欄を入力する
6.  `Color`欄を変更する
7.  `Default Type`を選択する
8.  `OK`ボタンを押す
9.  追加した Type の`Remove this type`ボタンをクリックする
10. Type が行ごと消えること
11. すべてもどす

## String Attribute の Value の編集

### 背景

1.  5.2.0 から Entity パレットで String Attribute の Value が編集出来るようになりました。

### String Attribute の Value の追加、編集、削除

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

## Firefox 用

### Span を縮めて消したときに右の Span を選択

#### 背景

1.  span の mouseup イベントで、Span を縮める、Span を消した際は右の Span を選択しています。
2.  Firefox では、span の mouseup イベントの後で、text-box の click イベントを発火します。
3.  パラグラフで span の mouseup イベントに起因する、click イベントを止めて、パラグラフマージンで、行間へのクリックを別々に拾っていまいさ t。
4.  6.0.0 でパラグラフのレンダリングを消した際に、click イベントを text-box だけで拾うことにしました。
5.  これによって、テキスト上をクリックした際に、選択を解除できるようになりました。
6.  一方で Filefox では、Span を縮めて消したときに、選択した右の Span を、選択解除するようになっていました。
7.  6.1.30 で、span の mouseup イベント発生時に一瞬だけフラグを立てて、text-box の click イベントをフィルターして、対応しました。

#### -- 手段 --

1.  Editor0 を選択
2.  最初の Span を縮めて消す
3.  右の Span が選択されること

### パレットのアイコンボタン

#### 背景

1.  5.0.0 で Type 定義の編集機能を追加しました
2.  編集機能用のアイコンのボタンのデフォルトスタイルが、Firefox で異なるため、パレットのレイアウトが崩れていました。

#### -- 手段 --

1.  Editor1 を選択
2.  Term モードにする
3.  `Select Label [Q]`ボタンをクリックする
4.  パレットの操作アイコンボタンが 1 行で表示されること

### コンテキストメニュー

#### 背景

1.  5.0.0 の開発中に Firefox で、マウスの右ボタンを押下するとコンテキストメニューが開き、放すと閉じるバグがありました。
2.  Firefox ではマウスの右クリックで click イベントが発火します。
3.  MouseEvent の Firefox の独自プロパティ`which`を使って、クリックしたボタンを判別し、右クリックの時はコンテキストメニューを閉じません。

#### -- 手段 --

1.  Firefox で Editor を開く
2.  マウスの右ボタンを押下する
3.  コンテキストメニューが表示されること
4.  マウスの右ボタンを放す
5.  コンテキストメニューが表示されたままであること

## Numeric Attribute の Value の編集

### 背景

1.  5.2.0 から Entity パレットで Numeric Attribute の Value が編集出来るようになりました。
2.  6.1.62 で Attribute の Value 編集でエラー発生
3.  6.2.69 で対応

### Numeric Attribute の Value の追加、編集、削除

1.  Editor1 を選択
2.  Term モードにする
3.  `Select Label [Q]`ボタンをクリックする
4.  `score`タブを選択
5.  `Add new value`ボタンをクリックする
6.  `range`欄に`[0.6`を入力する
7.  `label`欄を入力する
8.  `color`欄を入力する
9.  `OK`ボタンを押す
10. パレットに追加した Value が表示されること
11. 削除ボタンが有効であること
12. 新しく score attribute を作る
13. ラベルが Middle であること
14. 背景色が緑であること
15. Object を 0.6 にする
16. ラベルが入力した値であること
17. 背景色が入力した値であること
18. 追加した Value の`Edit this value`ボタンをクリックする
19. `range`欄に`[0.7`を入力する
20. パレットの Value の値が更新されるここと
21. score attribute のラベルが Middle に更新されること
22. score attribute の背景色が緑に更新されること
23. 追加した Value の`Remove this value.`ボタンがクリックする
24. 追加した Value が削除されること
25. すべてもどす
26. すべてやり直す

## コンフィグレーションを UNDO/REDO したときにトーストを表示

### 背景

1.  5.2.0 からコンフィグレーションの UNDO/REDO 実行時にトーストを表示します

### -- 手段 --

1.  Type 定義を変更する
2.  UNDO する
3.  緑色のトーストが表示されること
4.  REDO する
5.  緑色のトーストが表示されること

## コンフィグレーションに変更があるときは保存ボタンに星マークを表示

### 背景

1.  5.0.0 でコンフィグレーションの保存機能を追加しました

### -- 手段 --

1.  editor0 を選択
2.  Setting ダイアログで`Lock Edit Config`のチェックを外す
3.  `Select Label [Q]`ボタンをクリックする
4.  コンフィグレーション保存ボタンに星マークがついていること
5.  Local に保存する
6.  コンフィグレーション保存ボタンに星マークが消えること
7.  Type 定義を変更する
8.  コンフィグレーション保存ボタンに星マークがついていること
9.  UNDO する
10. コンフィグレーション保存ボタンに星マークが消えること
11. REDO する
12. コンフィグレーション保存ボタンに星マークがついていること
13. Local に保存する
14. コンフィグレーション保存ボタンに星マークが消えること

## 実用的な annotation を開く

1.  <http://pubannotation.org/projects/genia-medco-coref/docs/sourcedb/PubMed/sourceid/10022882/annotations.json>

## ビューモードでリレーションのラベルが URL だったときリンクになる

### 背景

1.  以前から対応していました
2.  6.2.0 でブロック機能を追加
3.  6.2.65 でブロックモードでリレーションのラベルが URL のときにクリックしてもリンク先を開かなくしました。

### -- 手段 --

1.  Editor1 を選択
2.  View モードにする
3.  `[R13] SPARQL`をクリック
4.  新しいタブで <https://en.wikipedia.org/wiki/SPARQL> が開くこと
5.  Term モードにする
6.  `[R13] SPARQL`をクリック
7.  新しいタブで <https://en.wikipedia.org/wiki/SPARQL> が開かないこと
8.  Block モードにする
9.  `[R13] SPARQL`をクリック
10. 新しいタブで <https://en.wikipedia.org/wiki/SPARQL> が開かないこと
11. Relation モードにする
12. `[R13] SPARQL`をクリック
13. 新しいタブで <https://en.wikipedia.org/wiki/SPARQL> が開かないこと

## コンフィグレーション読み込み

### URL が指定されていなければ Open ボタンを押せない

1.  editor1 を選択
2.  `Select Label [Q]`ボタンをクリックする
3.  コンフィグレーション読み込みダイアログを開く
4.  URL が空の時は`Open`ボタンは無効
5.  Local のファイルが選択されていない時は`Open`ボタンは無効

### JSON でないファイルをサーバーから読み込んだらエラーを alertify.js で表示

#### 背景

1.  5.0.0 の開発中にエラーが起きていました
2.  5.0.0 で対応
3.  5.3.0 で再びエラーになりました
4.  5.3.4 で対応

#### -- 手段 --

1.  editor1 を選択
2.  `Select Label [Q]`ボタンをクリックする
3.  コンフィグレーション読み込みダイアログを開く
4.  URL 欄に`development.html`を入力し、`Open`ボタンを押して、サーバーから読み込む
5.  右上に`http://localhost:8000/dist/demo/development.html is not a configuration file or its format is invalid.`と赤色のトースト表示がされること

### JSON でないファイルをファイルから読み込んだらエラーを alertify.js で表示

#### 背景

1.  editor1 を選択
2.  `Select Label [Q]`ボタンをクリックする
3.  コンフィグレーション読み込みダイアログを開く
4.  エラーが起きていました
5.  5.0.0 で対応
6.  5.3.0 でアラートを表示せずに、config を初期化するようになりました
7.  5.3.4 で対応

#### -- 手段 --

1.  適当な json でも text でもないファイルを読み込む
2.  右上に`ファイル名(local file) is not a configuration file or its format is invalid.`と赤色のトースト表示がされること

## BlockSpan を選択したときに自動的に BlockEntity を選択

### 背景

1.  6.2.0 からブロック機能を追加
2.  BlockSpan は BlockEntity をただひとつ持つので、別々に選択する必要がありません
3.  6.2.59 で導入

### −− 手段 --

1.  Block モードにする
2.  BlockSpan を選択する
3.  BlockEntity が選択されること
4.  BlockEntity を選択する
5.  BlockSpan が選択されること

## 作成して自動選択した Span と他の Span を shift を押して範囲選択

### 背景

1.  作成して自動選択した Span と他の Span を shift を押して範囲選択すると、Selection.type が`None`になります
2.  `Caret`のみ対応していたため、作成して自動選択した Span と他の Span を shift を押して範囲選択できませんでした
3.  作成して自動選択した Span を一度選択解除して、選択しなおせば、他の Span を shift を押して範囲選択可能です
4.  6.2.57 で BlockSpan に対応しました
5.  6.2.58 で DenotationSpan に対応しました

### -- 手段 --

1.  Term モードにする
2.  DenotationSpan を作成する
3.  Shift を押しながら他の DenotationSpan を選択する
4.  両端を含む、間の DenotationSpan が選択されること
5.  Block モードにする
6.  BlockSpan を作成する
7.  Shift を押しながら他の BlockSpan を選択する
8.  両端を含む、間の BlockSpan が選択されること

## shift を押して Span を範囲選択

### 背景

1.  6.0.0 でテキスト中の改行のレンダリングをパラグラフから、css の`white-space: pre-wrap;`に変更しました
2.  6.1.0 で折返し可能な Block Span を廃止しました。

### -- 手段 --

1.  Term モードにする
2.  Span を 1 つ選ぶ
3.  2 つ以上の Span を選んでいると、最後に選んだ Span だけが選択される
4.  shift を押しながら２つ以上離れた Span を選ぶ
5.  両端を含む、間の Span が選択される
6.  Span の他に Entity を選択していても選ばれること

## 必須プロパティのない Attributes 定義をふくむ Annotation ファイルを読み込んだらエラーを alertify.js で表示

### 背景

1.  5.3.3 から、config 中の Attribute 定義に必須プロパティが無いときに、アラートに pred とプロパティ名を表示します。

### -- 手段 --

1.  アノテーション読込ダイアログを表示
2.  URL 欄に`invalid_attributes_annotation.json`を入力
3.  `Open`ボタンをクリック
4.  赤いトーストが表示されること
5.  右上に`Invalid configuration: The attribute type whose predicate is 'rate' misses a mandatory property, 'default'.`と赤色のトースト表示がされること

## BlockEntity を選択する

### 背景

1.  6.2.0 からブロック機能を追加
2.  BlockEntity を Term モードで選択できていましたが、Block モードでは選択できませんでした。
3.  6.2.54 で対応しました。

### -- 手段 --

1.  Term モードにする
2.  BlockEntity のラベルをクリックする
3.  BlockEntity が選択されないこと
4.  Block モードにする
5.  BlockEntity のラベルをクリックする
6.  BlockEntity が選択されること

## BlockEntity の TypeGap 部分をクリックしたらエディタを選択する

### 背景

1.  6.2.0 からブロック機能を追加
2.  Term モードにするでは対応していましたが、Block モードでは対応していませんでした。
3.  6.2.53 で対応しました。

### -- 手段 --

1.  Block モードにする
2.  Editor の選択を解除する（背景色が白くなること）
3.  BlockEntity の TypeGap 部分（ラベルの上の空間）をクリックする
4.  Editor が選択され、背景色が紫色になること

## Relation を選択する

### 背景

1.  5.0.0 の開発中に初期表示されている Google Chrome では初期表示し Relation を選択しても太くならないことに気が付きました。
2.  6.0.0 で Modification を廃止しました。
3.  Relation の太さは、jsPlumb で path 要素の stroke-width 属性を設定していました。上手く反映されないことがあります。
4.  6.0.1 で、外部スタイルシートで stroke-width スタイルを指定して Relation を太くするようにしました。

### 初期表示されている Relation

1.  Relation モードにする
2.  初期表示されている Relation を選択する
3.  Relation は線が太くなる、矢印が大きくなる、ラベルが太字になること
4.  コントロールバーの`Change label [W]`ボタンが有効になること
5.  コントロールバーの`Delete [D]`ボタンが有効になること

### 作成した Relation

1.  Relation モードにする
2.  Relation を作成する
3.  作成した Relation を選択する
4.  Relation は線が太くなる、矢印が大きくなる、ラベルが太字になること
5.  コントロールバーの`Change label [W]`ボタンが有効になること
6.  コントロールバーの`Delete [D]`ボタンが有効になること

## Block モードで StyleSpan でマウスダウンして、BlockSpan を作る

### 背景

1.  6.2.48 で対応

### -- 手段 --

1.  Editor1 を選択
2.  Block モードにする
3.  StyleSpan でマウスダウン、テキストでマウスアップ
4.  BlockSpan ができること
5.  StyleSpan でマウスダウン、DenotationSpan でマウスアップ
6.  BlockSpan ができること
7.  StyleSpan でマウスダウン、StyleSpan でマウスアップ
8.  BlockSpan ができること

## Block モードで DenotationSpan でマウスダウンして、BlockSpan を作る

### 背景

1.  6.2.45 で、テキストでのマウスアップに対応
2.  6.2.46 で、DenotationSpan でのマウスアップに対応
3.  6.2.47 で、StyleSpan でのマウスアップに対応

### -- 手段 --

1.  Editor1 を選択
2.  Block モードにする
3.  DenotationSpan でマウスダウン、テキストでマウスアップ
4.  BlockSpan ができること
5.  DenotationSpan でマウスダウン、DenotationSpan でマウスアップ
6.  BlockSpan ができること
7.  DenotationSpan でマウスダウン、StyleSpan でマウスアップ
8.  BlockSpan ができること

## Block モードでテキストでマウスダウンして、BlockSpan を作る

### 背景

1.  6.2.0 で、テキストでのマウスアップに対応
2.  6.2.43 で、StyleSpan でのマウスアップに対応
3.  6.2.44 で、DenotationSpan でのマウスアップに対応

### -- 手段 --

1.  Editor1 を選択
2.  Block モードにする
3.  テキストでマウスダウン、テキストでマウスアップ
4.  BlockSpan ができること
5.  テキストでマウスダウン、DenotationSpan でマウスアップ
6.  BlockSpan ができること
7.  テキストでマウスダウン、StyleSpan でマウスアップ
8.  BlockSpan ができること

## Block モードで StyleSpan をクリックしたら選択解除する

### 背景

1.  6.2.41 で対応しました

### -- 手段 --

1.  Block モードにする
2.  BlockSpan を選択
3.  StyleSpan をクリック
4.  BlockSpan が選択解除されること

## Block モードで DenotationSpan をクリックしたら選択解除する

### 背景

1.  6.2.42 で対応しました

### -- 手段 --

1.  Block モードにする
2.  BlockSpan を選択
3.  DenotationSpan をクリック
4.  BlockSpan が選択解除されること

## Relation モードで Span をクリックしたら選択解除する

### 背景

1.  Relation モードでは、text-box そのもののマウスクリックイベントのみをハンドリングし、text-box 内の Span のマウスクリックイベントをハンドリングしていませんでした
2.  Span をクリックしたときに選択解除をしていませんでした
3.  6.2.0 で Block を導入してこの動作が目立つようになりました
4.  6.2.33 で、text-box の内の要素をマウスクリックイベントもハンドリングするようにしました

### -- 手段 --

1.  Relation モードにする
2.  Relation を選択
3.  DenotationSpan をクリック
4.  Relation が選択解除されること
5.  Relation を選択
6.  StyleSpan をクリック
7.  Relation が選択解除されること
8.  Entity を選択
9.  BlockSpan をクリック
10. Entity が選択解除されること

## コンテキストメニュー

### 背景

1.  5.0.0 でコンテキストメニューを追加しました。

### Entity を選択してコンテキストメニューを開いたときに Entity を選択したままであること

#### 背景

1.  5.0.0 の開発中に、右クリックで`mouseup`イベントは発火するため、エディタの body をクリックしたと判断して Entity の選択を解除したことがありました。
2.  エディタの body がリッスンするイベントを`click`イベント（右クリックでは発火しない、代わりに`contextmenu`イベントが発火する）に変更して対応しました。

#### -- 手段 ---

1.  Entity を選択する
2.  Editor 上の何も無いところでマウスの右ボタンを押下する
3.  コンテキストメニューが表示されること
4.  Entity を選択されたままであること

### コンテキストメニュー常に右クリックした座標にひらく

#### 背景

1.  5.0.0 の開発中に、コンテキストメニューの開く位置が右クリックしたオブジェクトによって、変わっていました。

#### -- 手段 ---

1.  Editor 上の何も無いところでマウスの右ボタンを押下する
2.  ポインターの座標を左上として、コンテキストメニューが表示されること
3.  Editor の文字を上でマウスの右ボタンを押下する
4.  ポインターの座標を左上として、コンテキストメニューが表示されること
5.  Span の上でマウスの右ボタンを押下する
6.  ポインターの座標を左上として、コンテキストメニューが表示されること
7.  Entity の上でマウスの右ボタンを押下する
8.  ポインターの座標を左上として、コンテキストメニューが表示されること
9.  relation の上でマウスの右ボタンを押下する
10. ポインターの座標を左上として、コンテキストメニューが表示されること
11. コントロールバーの上でマウスの右ボタンを押下する
12. ポインターの座標を左上として、コンテキストメニューが表示されること
13. ステータスバーの上でマウスの右ボタンを押下する
14. ポインターの座標を左上として、コンテキストメニューが表示されること

### コンテキストメニュー上を右クリックすると、クリックした右下にコンテキストメニューがひらく

#### 背景

1.  5.0.0 の開発中に、コンテキストメニュー上を右クリックしたときに、クリックした位置ではなく Editor からの相対位置でコンテキストメニューが開いていました。

#### -- 手段 ---

1.  マウスの右ボタンを押下する
2.  コンテキストメニューが表示されること
3.  コンテキストメニュー上を右クリックする
4.  ポインターの座標を左上として、コンテキストメニューが表示されること

### 別 Editor をクリックしたらコンテキストメニューを閉じる

#### 背景

1.  5.0.0 の開発中に、コンテキストメニューを開いているときに、別の Editor をクリックしたときにコンテキストメニューを閉じる挙動を追加しました。

#### -- 手段 ---

1.  マウスの右ボタンを押下する
2.  コンテキストメニューが表示されること
3.  別の Editor を左クリックする
4.  コンテキストメニューが閉じること
5.  マウスの右ボタンを押下する
6.  コンテキストメニューが表示されること
7.  別の Editor を右クリックする
8.  コンテキストメニューが閉じること

### 左クリックでコンテキストメニューを閉じる

#### 背景

1.  5.0.0 の開発中に、コンテキストメニューを開いているときに、コンテキストメニュー以外の場所を左クリックされたしてもコンテキストメニューが閉じないバグがありました。

#### -- 手段 ---

1.  マウスの右ボタンを押下する
2.  コンテキストメニューが表示されること
3.  コンテキストメニュー以外の場所を左クリックする
4.  コンテキストメニューが閉じること

### macOS でコンテキストメニューを開ける

#### 背景

1.  5.0.0 の開発中に macOS で、マウスの右ボタンを押下するとコンテキストメニューが開き、放すと閉じるバグがありました。

#### -- 手段 ---

1.  マウスの右ボタンを押下する
2.  コンテキストメニューが表示されること
3.  マウスの右ボタンを放す
4.  コンテキストメニューが表示されたままであること

## 親子 Span の親子とも左端が画面の左端にある親 Span を選択して、左から縮めたときに、親 Span が縮まること

### 背景

1.  anchorNode が子 Span で、focusNode が親 Span のときは必ず anchorNode の Span（子 Span）を広げる処理をしていました
2.  5.3.2 で、focusNode（親 Span）が選択されているときは、親 Span を縮める処理にする判定を追加しました

### -- 手段 --

1.  Term モードにする
2.  画面左端から複数の単語を Span にする
3.  作った Span 内の左端の単語を Span にする
4.  親 Span を選択して、左から、子 Span を超えて、縮める
5.  親 Span が縮まること

## Attribute 付きの Span を伸ばす/縮める

### 画面上の Attribute が増えないこと

#### 背景

1.  5.0.0 の開発中に Attribute のある Span を伸ばしたり縮めると、画面上の Attribute が増えることがありました。
2.  Entity の場合は既に DOM がある場合に二重に描かないチェックを指定していました。
3.  Attribute では同様のチェックが抜けていました。

#### -- 手段 --

1.  Term モードにする
2.  Span を作る
3.  Attribute を追加する
4.  Attribute 付きの Span を伸ばす
5.  画面上の Attribute の数が増えないこと
6.  Attribute 付きの Span を縮める
7.  画面上の Attribute の数が増えないこと

### 戻したときに Attribute の表示が消えないこと

#### 背景

1.  5.0.0 の開発中に新規追加した Attribute のある Span を伸ばしたり縮めたあとに戻すと、Attribute が消えることがありました。

#### -- 手段 --

1.  Term モードにする
2.  Span を作る
3.  Attribute を追加する
4.  Attribute 付きの Span を伸ばす
5.  戻す
6.  Attribute が消えないこと
7.  Attribute 付きの Span を縮める
8.  戻す
9.  Attribute が消えないこと

## BlockEntity を表示する領域をクリックしたら選択解除する

### 背景

1.  6.2.0 では text-box の幅を縮小して、BlockEntity を表示する領域を確保していました
2.  annotation-box には選択解除用のイベントハンドラーを入れていないため、BlockEntity を表示する領域をクリックしても、選択解除されませんでした
3.  6.2.36 で、BlockEntity を表示する領域を text-box の padding-right で確保するように修正しました。

### -- 手段 --

1.  Term モードにする
2.  Span を選択する
3.  右端の BlockEntity を表示する領域をクリック
4.  Span が選択解除されること
5.  Block モードにする
6.  BlockSpan を選択する
7.  右端の BlockEntity を表示する領域をクリック
8.  BlockSpan が選択解除されること
9.  Relation モードにする
10. Relation を選択する
11. 右端の BlockEntity を表示する領域をクリック
12. Relation が選択解除されること

## リサイズ後もリレーションのラベルクリックでリレーションを選択できる

### 背景

1.  jsPlumb は、リレーションを描画した直後はラベルのクリックイベントをリレーションのクリックイベントとして通知します
2.  リサイズなどでリレーションを書き直したとき、リレーションを描画する SVG 要素を作り直したときに、ラベルのクリックイベントを通知しなくなります。
3.  6.1.43 で、描画直後の状態だけで、jsPlumb が常にラベルのクリックイベントを通知すると判断して、ラベルへのイベントハンドラー設定をなくしました
4.  6.2.38 で、再度ラベルにもイベントハンドラーを設定しました

### -- 手段 --

1.  リレーションモードにする
2.  ブラウザをリサイズして、リレーションを移動する
3.  リレーションのラベルをクリックする
4.  リレーションが選択されること

## Body クリックで選択解除

### 背景

1.  6.0.0 から Span になっていないテキストをクリックしたときに選択を解除します
2.  6.2.0 からブロック機能を追加
3.  6.2.35 で typesettings が設定されていて、Span になっていないテキストのクリックに対応しました

### -- 手段 --

### Term モード

1.  Editor1 を選択
2.  Term モードにする
3.  Span を選択する
4.  行間をクリックする
5.  Span の選択が解除されること
6.  Entity を選択する
7.  Span になっていないテキストをクリックする
8.  Entity の選択が解除されること
9.  Entity を選択する
10. Span になっていない Style が設定されているテキストをクリックする
11. Entity の選択が解除されること

### Block モード

1.  Editor1 を選択
2.  Block モードにする
3.  BlockSpan を選択する
4.  行間をクリックする
5.  BlockSpan の選択が解除されること
6.  BlockSpan を選択する
7.  Span になっていないテキストをクリックする
8.  BlockSpan の選択が解除されること
9.  BlockSpan を選択する

### Relation モード

1.  Relation モードにする
2.  Entity を選択する
3.  行間をクリックする
4.  Entity の選択が解除されること
5.  Relation を選択する
6.  Span になっていないテキストをクリックする
7.  Relation の選択が解除されること

## editor を選択して、editor 外をクリックすると、editor が選択解除される

1.  フォーカスされない要素を click しても、Editor を選択解除していませんでした
2.  4.4.2 から Editor 外を click 時に、Editor を選択解除します

### -- 手段 --

1.  Editor をクリックする
2.  Editor が選択されていること（背景色がベージュ）
3.  一番上の input の横の`Wellcome!`をクリックする
4.  Editor が選択解除されること（背景色が白）

## Editor を選択解除しても Span と Entity と Relation は選択解除しない

### 背景

1.  4.4.0 の開発中に、Editor の focus out 時に、要素の選択解除をしたら、Entity クリック時に Entity が選択できなくなりました
2.  イベントの発生順序が mouse up, focus out, focus in のため、Entity 選択後に、選択解除されます
3.  6.2.0 からブロック機能を追加

### -- 手段 --

#### Span

1.  Editor をクリックする
2.  Editor が選択されていること（背景色がベージュ）
3.  Term モードにする
4.  Span を選択する
5.  一番上の input をクリックする
6.  Editor が選択解除されること（背景色が白）
7.  Span が選択されたままであることこと

#### BlockSpan

1.  Editor をクリックする
2.  Editor が選択されていること（背景色がベージュ）
3.  Block モードにする
4.  BlockSpan を選択する
5.  一番上の input をクリックする
6.  Editor が選択解除されること（背景色が白）
7.  BlockSpan が選択されたままであることこと

#### Entity

1.  Editor をクリックする
2.  Editor が選択されていること（背景色がベージュ）
3.  Term モードにする
4.  Entity を選択する
5.  一番上の input をクリックする
6.  Editor が選択解除されること（背景色が白）
7.  Entity が選択されたままであることこと

#### Relation

1.  Editor をクリックする
2.  Editor が選択されていること（背景色がベージュ）
3.  Relation モードにする
4.  Relation を選択する
5.  一番上の input をクリックする
6.  Editor が選択解除されること（背景色が白）
7.  Entity が選択されたままであることこと

## Relation を複数個作った直後のマウスホバーアウト

### 背景

1.  リレーションのレンダリングが非同期なため、ホバー等のリレーションの HTML 要素の操作は、レンダリング完了後に行う必要があります
2.  ctrl（Mac の場合は Cmd）を押しながら Relation を作成すると、手動でも高速に Relation が作成できます
3.  この時、ホバーアウトで、レンダリング前に、Relation の強調、強調解除で HTML 要素を操作が起き、エラーが発生します
4.  6.1.21 で、Relation モデルのインスタンスをレンダリング前のダミーとして使ったいたのをやめたときに、レンダリング済みのチェックが同時に抜け、エラーが起きるようになりました
5.  6.1.49 で、Entity のラベルをホバーしたときに Relation を強調するようにしたため、比較的よく発生するようになりました
6.  6.2.11 で対応

### -- 手段 --

1.  Editor0 を選択
2.  Relation モードにする
3.  Entity を選択する
4.  ctrl（Mac の場合は Cmd）を押しながら、他の Entity を連打し複数のリレーションを作った直後にマウスアウトする
5.  エラーが起きないこと

## Relation の作成

### ctrl

1.  Relation モードにする
2.  ctrl（Mac の場合は Cmd）を押しながら Relation を作る
3.  選んでいた Entity と作った Relation が選択される

### shift

1.  Relation モードにする
2.  shift を押しながら Relation を作る
3.  あとに選んだ Entity と作った Relation が選択される

## Relation モードの背景色

1.  Relation モードにする
2.  背景が薄ピンク色になること

## Ctrl/Cmd を押して複数選択した要素を編集できる

### 背景

1.  6.0.0 で Modification を廃止しました。

### -- 手段 --

1.  Span を複数選択して Entity をコピー
2.  Span を複数選択して貼付け
3.  Span を複数選択して削除
4.  Entity を複数選択してコピーして、Span に貼りけ
5.  Entity を複数選択して Type 変更
6.  Entity を複数選択して Attribute 追加
7.  Entity を複数選択して Attribute 編集
8.  Entity を複数選択して Attribute 削除
9.  Entity を複数選択して削除
10. Relation を複数選択して Type 変更
11. Relation を複数選択して削除

## `F`と`M`キーでの切り替え

### 背景

1.  Span と Entity は選択解除時に、対応する html 要素を blur していた
2.  Editor、Span、Entity の全てからフォーカスが外れるため、キーボードショートカットが効かなくなった
3.  4.5.6 で、blur は不要な処理なので削除した
4.  4.5.6 で Simple モードから Relation モードに遷移するように変更
5.  6.0.0 でショートカットキーによるモード切替に View モードを含めました
6.  6.2.30 でショートカットキーによるモード切替に Block モードを含めました

### -- 手段 --

#### F キー

1.  Editor2 を開く
2.  F キーを押す
3.  Block モードになること
4.  F キーを押す
5.  Relation モードになること
6.  F キーを押す
7.  View モードになること
8.  F キーを押す
9.  Term モードになること
10. F キーを押す
11. Relation モードになること

#### M キー

1.  Editor2 を開く
2.  F キーを押す
3.  Block モードになること
4.  F キーを押す
5.  Relation モードになること
6.  F キーを押す
7.  View モードになること
8.  F キーを押す
9.  Term モードになること
10. F キーを押す
11. Relation モードになること

## View モード

### 背景

1.  4.1.6 開発中に url に mode パラメーターをつけると View モードにならなくなりました
2.  4.5.0 で url パラメーターを廃止し、必要な場合は外部の JavaScript で属性に設定することにしました
3.  5.0.0 で`Upload`ボタンの制御を有効無効から、星マークの有無に変更しました
4.  5.0.0 の開発中に TypeDom の DOM 要素の構成を変更したときに、TypeValues へのイベントハンドラー無効化処理をいれわすれたため、Type ラベルのリンクがクリックできないバグがありました
5.  5.0.5 から、Attribute のラベルも、URL だったら View モードでリンクとして表示することにしました

### 期待する振る舞い

#### -- 手段 --

1.  View モードにする
2.  View ボタンが押下状態であること
3.  要素を選択できないこと
    1.  Span
    2.  Entity
    3.  Relation
4.  Enity ラベルがリンクになる
5.  Attribute ラベルがリンクになる
6.  save できる
7.  load できる
8.  TypeGap を変更できる
9.  LineHeight を変更できる
10. Entity をホバーすると Relation も強調される
11. Term モードに変更できる
12. Relation モードに変更できる
13. Block モードに変更できる

### annotation ファイルの自動修正時に`Upload`ボタンに星マークがつく

#### -- 手段 --

1.  View モードで開く
2.  invalid.json を読み込む
3.  `Upload`ボタンに星マークがつくこと
4.  Term モードに変更する
5.  `Upload`ボタンに星マークがついたままであること

## モード切り替え

### 背景

1.  モード切り替えが分かりずらい
2.  4.1.16 でモード切り替え用のボタンを追加しました
3.  6.2.0 で Block モードを追加しました

### -- 手段 --

1.  Editor1 を選択
2.  Term モードであること
3.  Term ボタンを押す
4.  Term モードに既になっていて、変わらないこと
5.  View ボタンを押す
6.  View モードになること
7.  Term ボタンを押す
8.  Term モードになること
9.  Relation ボタンを押す
10. Relation モードになること
11. Simple ボタンが無効になること
12. View ボタンを押す
13. View モードになること
14. Relation ボタンを押す
15. Relation モードになること
16. Term ボタンを押す
17. Term モードになること
18. Simple ボタンを押す
19. Simple モードになること
20. View ボタンを押す
21. View モードになること
22. Simple ボタンが押下されたままであること
23. Term ボタンを押す
24. Simple モードになること
25. Relation ボタンを押す
26. Relation モードになること
27. View ボタンを押す
28. View モードになること
29. Simple ボタンを押す
30. View-Simple モードになること
31. Block ボタンを押す
32. Block-Simple モードになること
33. Simple ボタンを押す
34. Block モードになること
35. Term ボタンを押す
36. Term モードになること

## annotation ファイル内の begin, end を整数に自動変換する

### 背景

1.  annotation ファイル内の begin, end が文字列の場合、クロススパンの検出時にエラーが出ます
2.  annotation ファイル内の begin, end が小数点を含む場合、生成する span の DOM の ID に`.`が含まれ、DOM の ID として不正な形式になります
3.  5.3.1 から、begin, end の値を自動的に整数に変換します

### -- 手段 --

1.  invalid.json を読み込む
2.  トーストが表示されること
3.  annotation をソース表示する
4.  `T2`の begin が、ダブルクォートされた文字列ではなく、数値であること
5.  `T2`の end が、少数ではなく、整であること

## id なし denotation への id 自動採番

### id なし denotation の読み込み

#### 背景

1.  annotation.json に記載する denotation は id が必須でした
2.  id がない場合に、自動で id を振る機能を 4.1.8 で追加しました
3.  6.0.0 で Modification を廃止しました。

#### -- 手段 --

1.  Editor1 を開く
2.  `no id`エンティティをホバーしたら id `T18` が表示されること
3.  id `R13` が表示される Relation に id があること
4.  annotation をソース表示する

### id なし denotation 入りの multitrack 読み込み

#### 背景

1.  multitrack の annotation.json でも id を自動採番します
2.  multitrack では読み込み時に ID の重複を避けるために`trackX_`なプレフィックスをつけて読み込みます
3.  Entity 追加時には`Txx`形式で、track を無視した連番で自動採番します
4.  id なし denotation は後者と同じ方式で`Txx`形式で自動採番します

#### -- 手段 --

1.  id がない denotiation を持つ multitrack な annotation.json を開く(multi_track.json)
2.  `no id t2`エンティティをホバーしたら`T2`が表示されること
3.  `no id t1`エンティティをホバーしたら`T1`が表示されること
4.  id がない Relation に id`R1`が表示されること
5.  annotation をソース表示する

## Editor の下の要素をクリックできる

### 背景

1.  テキストの余白が上に大きく、下は少ないように見せています
2.  実際のテキストはパラグラフの中央にあります
3.  Editor の下に透明のパラグラフがはみ出しています
4.  はみ出たパラグラフの下の要素がクリックできません
5.  4.4.0 で Editor の`over-flow`スタイルに`hidden`属性を設定。はみ出たパラグラフを非表示にしました
6.  5.0.0 でコンテキストメニューを追加したときに、コンテキストメニューを Editor からはみ出させたくなりました
7.  `over-flow`スタイルを設定する要素を、`.textae-editor`から、パラグラフのすぐ親の要素`.textae-editor__body__text-box`に変更しました
8.  6.0.0 でテキスト中の改行のレンダリングをパラグラフから、css の`white-space: pre-wrap;`に変更しました

### -- 手段 --

1.  Editor1 の下の input をクリックする
2.  input にフォーカスがうつること
3.  input に文字が入力できること

## Span の耳をひっぱて縮める

### 背景

1.  パラグラフの端にある Span をパラグラフの外から縮められません
2.  v4.4.0 から、Span の端から Span の内側へテキストを選択した時に、Span を縮める
3.  6.0.0 でテキスト中の改行のレンダリングをパラグラフから、css の`white-space: pre-wrap;`に変更しました

### -- 手段 --

#### 一番先頭の Span を左から縮める

1.  Term モードにする
2.  一番先頭の単語を含む複数語を Span にする
3.  作った Span を左から縮める

#### 一番最後の Span を右から縮める

1.  Term モードにする
2.  一番最後のピリオドを含む複数語を Span にする
3.  作った Span を右から縮める

#### Span 選択時は選択している Span を縮める

1.  Term モードにする
2.  子が一語の親子 Span を作る
3.  親 Span を選択する
4.  子 Span の端をマウスダウン、子 Span の途中でマウスアップ
5.  親 Span が縮まること

#### 左端の単語をダブルクリックすると Span が縮まる

1.  Term モードにする
2.  複数語を Span にする
3.  左端の単語をダブルクリックする
4.  ダブルクリックした単語分、Span が短くなること

## Term/Simple 自動切り替え

1.  6.1.1 で一つの denotation を一つのエンティティに表示することしました。
2.  同時に複数の dennotation を一つのエンティティに表示しているときに初期モードを Term モードにする機能を削除しました。

### Term モードになる annotation の初期表示

1.  Editor1 を選択
2.  Term ボタンが押下状態であること
3.  Simple ボタンが押下状態でないこと

### Simple モードになる annotaion の初期表示

1.  Editor2 を選択
2.  Term ボタンが押下状態であること
3.  Simple ボタンが押下状態であること

### Relation モードから Term/Simple への自動切り替え

#### Term モードになる場合

1.  Editor1 を選択
2.  Relation ボタンを押す
3.  Relation モードになること
4.  Term ボタンを押す
5.  Term モードになること

#### Simple モードになる場合

1.  Editor2 を選択
2.  Relation ボタンを押す
3.  Relation モードになること
4.  Term ボタンを押す
5.  Simple モードになること
