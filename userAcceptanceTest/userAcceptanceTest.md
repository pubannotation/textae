# 受け入れテスト

共通確認項目

1.  `npm run dist`を実行します
2.  `npm run dev:server`を実行します
3.  <http://localhost:8000/dist/demo/development.html> を開きます
4.  ブラウザの開発ツールを起動します。
5.  以下のテストを実行して、エラーが出ないこと

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

## 保存ファイル名は、読み込んだコンフィグレーションのファイル名

### 背景

1.  コンフィグレーション保存ダイアログの保存ファイルの初期値は、最後に読み込んだコンフィグレーションのファイル名です
2.  6.1.4 で対応しました

### -- 手段 --

1.  Editor0 を選択
2.  `Show label list editor [Q]`ボタンをクリックする
3.  コンフィグレーション読込ダイアログを開く
4.  ローカルファイルから`1_config.json`を読み込む
5.  `Show label list editor [Q]`ボタンをクリックする
6.  コンフィグレーション保存ダイアログを開く
7.  Local 欄に`1_config.json`が表示されていること

## コンフィグレーション保存

### 背景

1.  5.0.0 でコンフィグレーションの保存機能を追加しました

### URL を指定して保存

1.  Editor1 を選択
2.  `Show label list editor [Q]`ボタンをクリックする
3.  コンフィグレーション保存ダイアログを開く
4.  URL に保存する
5.  指定したファイル名`.dev_data.json`のファイルができていること
6.  指定したファイル名`.dev_data.json`のファイルに変更内容が反映されていること

### Local ファイルに保存

1.  Editor1 を選択
2.  `Show label list editor [Q]`ボタンをクリックする
3.  コンフィグレーション保存ダイアログを開く
4.  Local に保存する
5.  指定したファイル名のファイルがダウンロードできること
6.  ダウンロードしたファイルに変更内容が反映されていること

### URL が指定されていなければ save ボタンを押せない

1.  Editor1 を選択
2.  `Show label list editor [Q]`ボタンをクリックする
3.  コンフィグレーション保存ダイアログを開く
4.  URL 欄を空にする
5.  保存ダイアログ上の Save ボタンが無効になること

### コンフィグレーション保存時にメッセージを alertify.js で表示

#### 背景

1.  5.0.0 開発中にサーバーに保存するときの、トーストメッセージが間違っていました

#### -- 手段 --

1.  Editor1 を選択
2.  `Show label list editor [Q]`ボタンをクリックする
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
6. `Configuration differences`欄の`attribute types`に、新しい Attirbute 定義が追加されていないこと
7. Editor1 を選択
8. `i`キーを押してアノテーション読込ダイアログを開く
9. ローカルファイルから`private.json`を読み込む
10. `q`キーを押してパレットを開く
11. `Uplaod`ボタンをクリック
12. `Configuration differences`欄の`attribute types`の 1 番目の`pred`の変更前の値が`denote`でないこと

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

## URL からはテキストファイルのアノテーションは読み込めない

### 背景

1.  読み込み失敗時のメッセージが素っ気なかった
2.  4.1.12 から優しくなりました
3.  6.4.127 で不正なアノテーションを読み込んだ際に、不正なコンフィグレーションを読み込んだときのメッセージも表示されるようになりました
4.  6.4.142 で対応しました
5.  5.0.0 でローカルファイルからのテストファイル読み込み機能を追加しました。

### -- 手段 --

1.  アノテーション読込ダイアログを表示
2.  URL 欄に`http://localhost:8000/dev/target.txt`を入力し、`Open`ボタンを押して、サーバーから読み込む
3.  右上に`http://localhost:8000/dev/target.txt is not a annotation file or its format is invalid.`と赤色のトースト表示がされること

## Selection Attribute 定義の Value が唯一のときは、削除不可

### 背景

1.  Selection Attribute の Value をすべて消そうとするとエラーが起きます
2.  6.1.57 で対応しました。

### -- 手段 --

1.  Editor1 を選択
2.  Term モードにする
3.  `Show label list editor [Q]`ボタンをクリックする
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

## パレットはドラッグできる

1.  Term モードにする
2.  Entity を選択する
3.  `Q`キーを押す
4.  パレットがドラッグアンドドロップで移動できること

## パレットはマウスカーソルの近くに開く

1.  Term モードにする
2.  `Show label list editor [Q]`ボタンをクリックする
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
3.  `Show label list editor [Q]`ボタンをクリックする
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
3.  `Show label list editor [Q]`ボタンをクリックする
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
3.  `Show label list editor [Q]`ボタンをクリックする
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
3.  `Show label list editor [Q]`ボタンをクリックする
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
7.  6.2.79 で Block モードで、ショートカットキー 1~9 で Attribute の追加ができるようになりました
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

1.  `Show label list editor [Q]`ボタンをクリックする
2.  コンフィグレーション読込ダイアログを開く
3.  `invalid_attributes_config.json`を読み込む
4.  右上に`Invalid configuration: The attribute type whose predicate is 'category' misses a mandatory property, 'default'.`と赤色のトースト表示がされること

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
