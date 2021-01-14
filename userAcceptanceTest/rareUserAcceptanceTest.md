# 極めて稀にやるテスト

## 親子 Span を作る

### 背景

1.  5.0.0 の開発中に Attribute を含めた Grid の位置計算が上手く行かず、Grid が重なりあうことがありました。

### -- 手段 --

1.  Term モードにする
2.  Span を作る
3.  親 Span を作る
4.  Grid が重なりあわないこと
5.  Simple モードにする
6.  Grid が重なりあわないこと

## Simple モードので左右キーで Entity の選択を変更したら、連動してスクロールすること

### 背景

1.  Simple モードでは Entity が非表示のため focus が当たらない
2.  Entity を選んだ時は label を focus を当てて対応した
3.  6.2.28 で Entity のエンドポイントの表示をやめました。

### -- 手段 --

1.  Simple モードにする
2.  Entity を選択する
3.  `左キー`を何回も押して、表示領域外の Entity を選択する
4.  選択した Entity が表示される位置に表示されること
5.  `右キー`を何回も押して、表示領域外の Entity を選択する
6.  選択した Entity が表示される位置に表示されること

## 作って Undo してもキーボードショートカットが有効

### 背景

1.  4.3.4 からキーボードイベントを body 全体から editor 単位でとるように変更
2.  editor かその子要素（Span か Entity Type）がフォーカスを持っていないとキーイベントが拾えない
3.  通常の削除時は右要素を自動選択する
4.  作成の Undo 時は、削除を実行するが、自動選択しない
5.  Focus 対象がなくなった時に自動で editor を選択するようにした

### -- 手段 --

#### Term モード

1.  Term モードにする
2.  Span を作成する
3.  Span が選択されること
4.  Undo する
5.  Span が削除されること
6.  `Hキー`を押してキーボードヘルプが表示されること

#### Relation モード

1.  Relation モードにする
2.  Relation を作成する
3.  Undo する
4.  Relation が削除されること
5.  `Hキー`を押してキーボードヘルプが表示されること

## Attribute のある Entity と Attribute のない Entity を選択しして、Attribute を編集、削除する

### 背景

1.  5.0.0 の開発中に、Entity から削除対象の Attribute が取れなかった時にエラーが起きていました。

### -- 手動 --

1.  Attribute がない DenotationEntity を選択
2.  Attribute がある DenotationEntity も選択
3.  Attribute を編集する
4.  エラーが発生せずに更新されること
5.  Attribute を削除する
6.  エラーが発生せずに削除されること

## Span をのばす/縮めたときに Grid の DOM 要素が重複しない

### 背景

1.  5.0.0 の開発中に、Attribute の描画に対応するために、Span を伸ばす/縮めるロジックを変えました。
2.  それまで、モデル上で Span,Entity,Modification を消して作り直していました。
3.  モデル上の Span のみを削除して追加しなおし、Entity は Span への参照を新しい Span に変更するロジックに変更しました。
4.  DOM 上では、Span の削除に連動して Span と Grid を削除し、Span の追加に連動して Span と Grid を追加するロジックに変更しました。
5.  モデル上の Span 追加時に、Span が Entity を持っていて、Entity の DOM がレンダリングされていない場合に、Entity の DOM をレンダリングします。
6.  Span のレンダリングの前に、モデル上の Entity の Span ID 更新を行うと、DOM 上の Grid は古い Span ID を持つため、Grid の DOM が既にあるかの判定に失敗し、Span に対する Grid の DOM 要素を追加して作成していました。
7.  `span.move`イベントのタイミングで、Grid と Entity の DOM の id を旧 Span ID から、新 Span ID に書き換えて、Grid の幅を Span
    に合わせて調整する処理をしていたため、重複した両方の Grid が更新されて、正しく動いているように見えていました。
8.  Span の削除に連動した Grid を削除処理を追加して、旧 Grid の DOM を削除、Grid の DOM が重複しないようにしました。
9.  6.1.1 で一つの denotation を一つのエンティティに表示することしました。

### -- 手段 --

1.  Span を作る
2.  のばす
3.  戻す
4.  戻す
5.  Redo
6.  Redo
7.  戻す
8.  Grid が 2 つ表示されないこと

## id が 100 を跨いぐ Span を含む範囲を shift を押して後ろからを選択

### 背景

1.  Span の id を文字列順ソートして、正しい並び順を取得できなかったことがあります

### -- 手段 --

1.  id が 100 を跨いぐ Span を含む範囲を、後ろから選択する
2.  範囲内の Span を全て選択できること

## Span 作成、Relation 作成を Redo してもキーボードショートカットが有効

### 背景

1.  Span 作成時、Span を選択して Span を focus する
2.  Relation 作成時は、Span を選択解除して、Span を blur する
3.  手動で Relation を作る時は editor を focus していた
4.  Redo で Relation を作る時は、editor を focus しておらず、focus が body に移った
5.  キーボードイベントが取得できなくなった
6.  4.5.6 で Redo で Relation を作成時も editor を focus するようにした

### -- 手段 --

1.  Span を２つ作る
2.  Relation モードにする
3.  Relation を作る
4.  `z`キーを 3 回押して、1-3 の操作を Undo する
5.  `y`キーを 3 回押して、1−3 の操作を Redo する
6.  `Hキー`を押してキーボードヘルプが表示されること

## 対象 Denotation の削除して戻すと、連動して Attribute も戻ること

### Attribute を持つ Span を消して戻したら、Attribute が表示されること

#### 背景

1.  5.0.0 の開発中に、Span を消して戻したときに、元あった Attribute が表示されないことがありました。

#### -- 手段 --

1.  Term モードにする
2.  Span を作る
3.  Attribute を追加する
4.  Span を削除する
5.  戻す
6.  Attribute が表示されること

### Attribute を持つ Entity を消して戻したら、Attribute が表示されること

#### 背景

1.  5.0.0 の開発中に、Entity を消して戻したときに、元あった Attribute が表示されないことがありました。

#### -- 手段 --

1.  Term モードにする
2.  Span を作る
3.  Type の異なる Entity を追加する
4.  どちらかの Entity に Attribute を追加する
5.  Attribute を持つ Entity を削除する
6.  戻す
7.  Attribute が表示されること

## モード変更時に選択を解除

### 背景

1.  4.1.16 の開発中に Relation モードに切り替えた際にラベルのシャドウがクリアされなくなるバグが出ました。

### -- 手段 --

1.  Term モードにする
2.  Entity を選択する
3.  ラベルに赤いシャドウがつくこと
4.  Relation モードにする
5.  ラベルの赤いシャドウが消えること

## Firefox 用

### Grid の位置

#### 背景

1.  Firefox では大量の Span から offsetTop/offsetLeft を取得すると意図しない値が取れることがあります
2.  代わりに getBoundingClientRect()を使います

#### -- 手段 --

1.  <http://pubannotation.org/docs/sourcedb/PMC/sourceid/1315279/divs/10/annotations.json> を開く（いまはこのドキュメントがありません）
2.  Grid の位置がずれないこと

## Attribute のついた Span を Replicate して Undo/Redo できること

### 背景

1.  5.0.0.で Attribute を追加しました。Replicate の対象にしました。
2.  Attribute を作成するためには対象となる Entity の id が必要です。
3.  コマンド実行時に Entity を作成してから Attribute を作成するコマンドを生成していました。
4.  Redo でコマンドを実行するときに、前回実行時に作成した Attribute を作るコマンドを破棄せずに追加するバグがありました。
5.  Redo 後に Undo した際に、同じ Attribute を 2 回消そうとしてエラーが起きていました。
6.  subCommands をオブジェクトのプロパティとして持つのをやめ、コマンド実行時に生成したコマンドだけを`revert`関数に埋め込むようにしました。

### -- 手段 --

1.  Term モードにする
2.  文字列`suppressor`の Span に Type を作る
3.  Attribute を追加する
4.  上記 Span だけを選択する
5.  `Replicate Span annotation [R]`ボタンを押下する
6.  レプリカが作られること
7.  レプリカに、選択していた Span の Type の Attribute が作られること
8.  Undo する
9.  Redo する
10. もう一度 Undo する

## 最後の Span を耳をひっぱて縮めて消す

### 背景

1.  4.4.1 の開発中
2.  Span を耳をひっぱて縮めたときに、右の Span を選択する機能を追加
3.  最後の Span は右に Span がいない。しかし選択しようとしてエラーを起こした

### -- 手段 --

1.  一番最後の Span を耳をひっぱって縮めて消す
2.  エラーが起きないこと

## Span を作成して戻す

### 背景

1.  Undo 時の revert 処理を factory（モジュール外に公開する参照用オブジェクト）から取得していました
2.  削除処理を変更すると revert 処理にまで影響が出ていました
3.  revert 処理は個々の command の情報だけで作れる
4.  4.1.8 で factory を参照せずにロジカルに生成するようにしました
5.  4.2.1 の開発中に、Span 削除時に unfocus するための DOM 要素が取得できずにエラーが起きました

### -- 手段 --

1.  Span を作る
2.  戻す

## 1 つの attribute を複数回レンダリングしないこと

### 背景

1.  5.0.0 の開発中に attributes を二重表示するバグがありました

### -- 手段 --

1.  Span を作る
2.  attributes を追加する
3.  包含 Span を作る
4.  最初に作った Span の Attribute が 2 個表示されないこと

## Relation モードから Term モードに切り替えたときに Relation がつくれないこと

### 背景

1.  5.2.3 で、EditRelation をリファクタリングしたときに、バインドしたイベントハンドラーのリストを return する処理が抜けて、モード切り替え時に、Relation モード用の尾イベントハンドラーが解放されませんでした。その結果、Relation モードから Term モードに切り替えても、Relation がつくれました。
2.  5.3.2 で、修正しました

### -- 手段 --

1.  Relation モードにする
2.  Term モードにする
3.  Span を 2 つ作る
4.  選択中でない Entity をクリックする
5.  Relation が作られずに、クリックした Entity が選択されること

## Span の Entity が一つの時、Entity の Type を変えても Entity が消えない

### 背景

1.  4.2.1 で、Span に Entity が一つの時、Entity の Type を変えると消えました
2.  Entity 変更時の処理順が古い Entity 削除、新しい Entity 追加でした
3.  Entity を削除して、Entity が 0 個になると Grid を削除します
4.  （折返し可能な Block Span 選択時の上キー押下時に上レイヤーが選択可能か判定を簡単にするため）
5.  新しい Entity を追加する時に、Grid を追加します。
6.  Grid の位置を設定しないため Grid が表示領域外にあり、Entity が消えたように見えます
7.  処理順を新しい Entity 追加、古い Entity 削除に変え、Entity 数が 0 にならないようにしました

### -- 手段 --

1.  Editor1 を選択
2.  `T1.a.b`の Type を変更
3.  表示されていること

## Relation 付きの Span を伸ばす/縮める

1.  Term モードにする
2.  Relation 付きの Span を伸ばす/縮める
3.  Relation が選択されないこと

## Span を削除して左右キー選択を変更

### 背景

1.  4.2.1 の開発中に判明。Span 削除時に SpanTree を更新しておらず、
2.  左右 Span が削除後の Span を参照していた。

### -- 手段 --

1.  Span を選択する
2.  `Dキー`を押す
3.  選択した Span が削除されること
4.  削除した Span の左隣の Span を選択する
5.  `右キー`を押す
6.  右隣の Span が選択されること

## Rock な annotation を開く

### 一般的な

1.  Multi tracks（レンダリングに時間がかかる） <http://pubannotation.org/docs/sourcedb/PMC/sourceid/1315279/divs/10/annotations.json>
2.  行がたくさん(不正データあり) <http://pubannotation.org/projects/BLAH2015_Annotations_test_5/docs/sourcedb/PMC/sourceid/4300004/divs/16/annotations.json>
3.  cross Span がたくさん <http://pubannotation.org/projects/BLAH2015_Annotations_test_5/docs/sourcedb/PMC/sourceid/4300004/divs/1/annotations.json>

## アノテーション保存時の Relation のフォーマット

### 背景

1.  5.0.0 で、Attribute を扱う様になった時に内部的に型の名前と Attribute をあわせて管理する TypeModel を導入しました
2.  Relation の保存時にフォーマットを修正する処理が抜けていました
3.  5.0.1 で対応

### -- 手段 --

1.  アノテーション保存ダイアログを開く(editor0)
2.  `Click to see the json source in a new window`をクリックする
3.  Relation のフォーマットの pred が`"pred":{"_name":"associated_with","_entity":null}`の形式にならずに、 `"relations":[{"id":"R1","pred":"associated_with","subj":"T0","obj":"T1"},{"id":"R2","pred":"associated_with","subj":"T2","obj":"T3"},{"id":"R3","pred":"associated_with","subj":"T4","obj":"T5"},{"id":"R4","pred":"associated_with","subj":"T6","obj":"T7"}]`であること

## Span を伸ばす/縮めるたときに折り返さないこと

### 背景

1.  5.0.0 の開発中に、Span を伸ばす/縮めるロジックを変えました。
2.  Entity を消して作り直すのをやめ、モデル上の Span のみを作り直し Entity の Span への参照を新しい Span に変更するロジックに変更しました。
3.  画面上の Span 作成時に`textae-editor__span--wrap`（テキスト折り返し用のクラス）を一度追加し、Entity を作り直した際に、`textae-editor__span--wrap`を消していたロジックが露見しました。
4.  `textae-editor__span--wrap`追加判定ロジックを、Block Span のときのみ追加するように修正しました。
5.  6.1.0 で折返し可能な Block Span を廃止しました。

### -- 手段 --

1.  Term モードにする
2.  行を越える Span を作る
3.  折り返さないこと
4.  Span を伸ばす
5.  折り返さないこと

## 親 Span を消したあとも Grid が移動する

### 背景

1.  Grid の位置変更は Span の親子をたどって計算しています
2.  親 Span を消した時に子から親の参照を消しを忘れるバグがありました
3.  親を持つ Span は位置変更が掛からなくなっていました

### -- 手段 --

1.  Span を覆う Span を作る
2.  作った Span を削除する
3.  リサイズすると Grid が移動すること

## Span の Entity を同じものに変更しても Entity が消えない

### 背景

1.  4.2.2 で Span の Entity を同じものに変えると消えました
2.  Type を同じものに変更した場合は、実行しません

### -- 手段 --

1.  Entity を一つ選択する
2.  `w`キーを押す
3.  変更せずに`OK`ボタンを押す
4.  Entity が消えないこと

## annotations validator 表示内容の更新

### 背景

1.  4.1.8 に一度不正内容を表示すると、別の不正ファイルを読んでも内容が変わらないバグがありました。
2.  4.1.10 で修正しました。

### -- 手段 --

1.  invalid.json を読み込む
2.  invalid_multi.json を読む
3.  invalid_multi の不正内容(Track 1 annotations.以下)が表示されること

## Attribute を持つ Span を消したら、Attribute も消えること

### 背景

1.  5.0.0 の開発中に、Span を消しても、その Entity の Attribute がデータ上から消えずのこることがありました。

### -- 手段 --

1.  Term モードにする
2.  Span を作る
3.  Entity を 2 つ作る
4.  Attribute を追加する
5.  Span を削除する
6.  新しい Span を作る。Attribute が勝手につかないこと

## 非 multi track ファイル読み込み

### 背景

1.  非 multi tracks でも track id を表示しようとして、取得できず undefined を表示していました。

### -- 手段 --

1.  Edit モードにする
2.  通常の json を読み込む(1_annotations.json)
3.  トーストが表示されないこと
4.  Relation に`undefined`が表示されないこと(id と Type を表示)

## 境界検出の無限ループ

### 背景

1.  前の文字が無い場合の境界判定に失敗して無限ループになるバグがありました。
2.  4.1.8 で対応しました。

### 端っこの単語の Boundary Detection

1.  `Boundary Detection`ボタンを押下状態にする
2.  最初の単語を Span にする
3.  最後の単語を Span にする
4.  最後の単語（ピリオドなどがあれば含む）を Span にする
5.  全て戻す

### Boundary Detection 有効時に先頭の文字を含み区切り文字を含まない Span を縮める

1.  一番先頭の単語を区切り文字（空白やハイフン）を含めずに Span にする
2.  後ろから前に縮める
3.  無限ループになって固まらないこと
4.  Span が削除されること

## Simple モードで上の Type に Attribute があるときに Attribute が下の Type の背後に隠れないこと

### 背景

1.  5.0.0 から Attribute を追加しました
2.  Simple モードでは、Attribute が下の Type に隠れてしまいました。
3.  いままでは TypeGap を含めた高さを TypeDom に固定値で設定していました。Simple モードでは Label の高さの固定値でした。
4.  Attribute の数に応じて TypeDom の高さを自動調整するために、TypeDom 内の Dom のレイアウトを修正しました。
5.  TypeDom の中に、TypeGap の高さを設定するための TypeGap 用の DOM 要素を追加し、TypeGap に応じた高さの設定を TypeDom から分離しました。
6.  Label と Attribute を表示する DOM 要素 TypeValues を追加しました。この高さを auto にし Attribute の数に応じて可変にしました。
7.  Grid の位置は、TypeGap + EntityPane + Label + Attribute の高さの和を、Span 座標から引いた位置に絶対指定で配置します。

### -- 手段 --

1.  Term モードにする
2.  Span を作る
3.  Type を 2 つ以上作る
4.  最下段以外の Type に Attribute を追加する
5.  Simple モードでにする
6.  最下段以外の Type の Attribute が、その下の Type の背後に隠れないこと

## Relation の選択状態

### Relation を選択解除したときに矢印だけだ大きくなったままにならない

1.  Relation モードにする
2.  Relation をホーバーしながら選択
3.  選択を解除
4.  大きい矢印が残らないこと

### Relation を選択して Term モードに切り替える

1.  Relation を選択
2.  Term モードにする
3.  Relation モードにする
4.  同じ Relation を選択できること

## コントロールバーのアイコンの tooltip

### 背景

1.  4.1.8 で`Edit Relation`を`Relation Edit Mode`に修正しました
2.  4.1.12 で高さ調整アイコンを追加しました
3.  4.1.17 で`Simple Mode`を`Simple View`に修正しました
4.  4.1.17 で`Auto Adjust LineHeight`を`Adjust LineHeight`に修正しました
5.  5.0.0 で`Add Attributes [T]`を追加しました
6.  5.3.0 で`Add Attributes [T]`を廃止しました

### -- 手段 --

1.  Relation Edit Mode をホバーする
2.  tooltip が`Relation Edit Mode`であること
3.  Simple View をホバーする
4.  tooltip が`Simple View`であること
5.  リフレッシュアイコンをホバーする
6.  tooltip が`Adjust LineHeight`であること

## Block Span を通常の Span に戻したら、折り返しをやめる

### 背景

1.  5.0.0 の開発中に発生
2.  `textae-editor__span--wrap`追加判定ロジックを、Block Span のときのみ追加するように修正しました。
3.  `textae-editor__span--wrap`削除判定ロジックも、Block Span のときのみ実行していました。
4.  Block Span 出なかったときも、`textae-editor__span--wrap`削除します。
5.  6.1.0 で折返し可能な Block Span を廃止しました。

### -- 手段 --

1.  Term モードにする
2.  通常の Span を作る
3.  Type を Sentence に変える
4.  Block Span に変わる
5.  通常の Span に戻す
6.  Span が改行されること

## Block Span

### 背景

1.  6.1.0 で折返し可能な Block Span を廃止しました。

### 作る

1.  Editor1 を選択
2.  Term モードにする
3.  通常の Span を作る
4.  Type を Sentence に変える
5.  Block Span に変わる

### 表示

1.  Block Span がピンク色の Span で表示されること
2.  Block Span が改行されること（一語は改行しない）

### 編集

1.  のびる
2.  ちぢむ
3.  コピーできる
4.  貼付けできる
5.  削除できる
6.  Type を変えられる

### 選択

1.  ctrl（Mac の場合は Cmd）を押して Span を複数選択できる
2.  shift を押して Span を範囲選択できる

### Block Span を通常の Span に戻したら、Entity が表示されること

#### 背景

1.  4.2.1 から発生
2.  上キーの移動可能チェックに Grid の DOM の有無を使うことにした
3.  Entity がなくなった pane と Grid を消す
4.  Entity の Type を変更時に、新しい Entity を作って、古い Entity を消す順に変更
5.  Entity の削除で、同じ title の DOM の一つ目だけが取れていたため、通常 Span では上手く動いた
6.  Block Span は古い Entity がないため、新しい Entity を削除した
7.  処理順を、古い Entity を削除、新しい Entity を作成、Entity がなくなった pane と Grid を消すの 3 段階に変更して、対応

#### -- 手段 --

1.  Term モードにする
2.  通常の Span を作る
3.  Type を Sentence に変える
4.  Block Span に変わる
5.  Type を Protein に変える
6.  Span に Type と Entity が表示されること

### Block Span に他の Type をつけたら折り返しをやめる

#### 背景

Block Span に Sentence 以外の Type を作ると上手く表示できない。

1.  Grid は div なので折り返せない。位置がズレる
2.  Block Span でなくなった時に Grid 位置が再計算しないとズレたままになる
3.  Block Span に Sentence 以外の Type をつけたら、通常 Span になって正しい位置に表示されることを確認

#### -- 手段 --

1.  行を越える Span を作る
2.  折り返さないこと
3.  Type を Sentence に変える
4.  Block Span に変わる
5.  折り返すこと
6.  他の Type を追加する
7.  折り返しをやめること
8.  追加した Type の高さが Block Span の真上であること
9.  追加した Type の幅が Block Span と同じであること
10. 追加した Type の左端が Block Span と同じであること
11. 色はピンクのままであること

## 左右キーで選択 Entity を変更するとき Block Span（の DOM 上に表示されていない Entity）を飛ばす

### 背景

1.  データモデル上では BlockSpan も Entity を持っています
2.  データモデル上で Entity を探すと、DOM 上に存在しない Entity も検出していまいます。
3.  左右の要素は DOM 要素上で検索しています。
4.  6.1.0 で折返し可能な Block Span を廃止しました。

### -- 手段 --

1.  Block Span の右隣の Span の Entity を選択する
2.  `左キー`を押す
3.  左隣の Entity が選択されること
4.  Block Span の左隣の Span の Entity を選択する
5.  `右キー`を押す
6.  右隣の Entity が選択されること

### Block Span の左に作った Entity に左右キーで移動できる

#### 背景

1.  4.2.1 から発生
2.  左右キーで移動する Entity の順序を DOM の順序から取得します
3.  Grid を作るときは右の Span の Grid の前に挿入します
4.  Block Span は Grid が無いので、新規 Grid の挿入に失敗し最後に追加していました
5.  4.4.2 で修正
6.  すぐ右の Span に Grid がなかったときは次の Span の Grid を辿ります。

#### -- 手段 --

1.  Block Span を作る
2.  Block Span のすぐ左に新しい Span を作る
3.  新しく作った Span の Entity を選択する
4.  `右キー`を押す
5.  右隣の Entity が選択されること
6.  `左キー`を押す
7.  左隣の Entity が選択されること

## Block Span を選択して、上下キーを押しても選択が切り替わらない

### 背景

1.  4.2.1 の開発中
2.  selectionModel 中では、Type 編集等の対象とするために、Block Span の Entity も選択する
3.  選択 Entity を selectionModel から取得したら、選択できていることになった
4.  選択 Entity を DOM から取得することにした
5.  6.1.0 で折返し可能な Block Span を廃止しました。

### -- 手段 --

1.  Block Span を選択する
2.  `上キー`を押す
3.  Block Span が選択されたままであること
4.  Block Span を選択する
5.  `下キー`を押す
6.  Block Span が選択されたままであること

## Block Span をのばす/縮めたときに通常 Span にならないこと

### 背景

1.  Span の DOM をレンダリングする時に、Span が Block Span かどうかはモデル上の entity をなめて対象の span を参照する Block Entity があるかどうかで判定しています。
2.  モデル上の Entity の Span ID 更新を Span のレンダリングのあとに行ったため、Span が Block Span かどうかの判定に失敗しました。
3.  モデル上の Entity の Span ID 更新を Span のレンダリングの前に行って対応しました。
4.  6.1.0 で折返し可能な Block Span を廃止しました。

### -- 手段 --

1.  Block Span をのばす
2.  ピンク色のままであること

## 重たい操作にカーソルがぐるぐるになる

1.  次のときリレーションの配置完了までカーソルがぐるぐるになり要素がクリック不能になること
    1.  初回読み込み
    2.  annotation データ<http://pubannotation.org/docs/sourcedb/PMC/sourceid/1315279/divs/10/annotations.json>読込み時
    3.  リサイズ時
    4.  Simple モードとその他のモード切り替え時

## Modification

### 背景

1.  6.0.0 で Modification を廃止しました。

### 見た目

1.  Entity に negation だけなら、Entity の上に x を表示
2.  Entity に speculation だけなら、Entity の上に?を表示
3.  Entity に negation と speculation がついたら、x の上に?を表示

### ボタン

1.  選択した Entity/Relation が全て negation/speculation を持つと押下状態になる

### 編集

1.  Entity/Relation を選択し
2.  negation/speculation ボタンを押下状態にすると x/?がつく
3.  negation/speculation ボタンを押下状態を解除すると x/?が外れる

### Undo/Redo

1.  Relation モードで Entity の Modification 編集を戻す、やりなおす
2.  Relation モードで Relation の Modification 編集を戻す、やりなおす

## Modification 付きの Span を伸ばす/縮める

### 背景

1.  5.0.0 の開発中まで気づかなかった
2.  6.0.0 で Modification を廃止しました。

### -- 手段 --

1.  Term モードにする
2.  Span を作る
3.  Modification を追加する
4.  Modification 付きの Span を伸ばす
5.  Modification が消えないこと
6.  Modification 付きの Span を縮める
7.  Modification が消えないこと

## Modification のあるオブジェクトを削除

### 背景

1.  Modification のあるオブジェクトを削除するとエラーが起きるバグがありました
2.  renderModification を抽出する際に、buttonStateHelper の  渡し漏れです
3.  4.1.8 の開発中に発生して修正しました
4.  6.0.0 で Modification を廃止しました。

### -- 手段 --

1.  1_annotations.json を開く
2.  Modification を持つ Entity を削除します
3.  Modification を持つ Relation を削除します

## モデルから Modification を削除

### 背景

1.  Modification の表示だけ消してモデルから消さないバグがありました
2.  同じ ID の Entity を作った時に最初から Modification がついて表示されていました
3.  同じ ID の Relation を作った時に最初から Modification がついて表示されていました
4.  4.4.1 で Entity => Relation => Modification の連鎖削除時に、モデルから消さないバグを修正しました
5.  6.0.0 で Modification を廃止しました。

### Entity

1.  Entity を作る
2.  作った Entity に Modification をつける
3.  作った Entity を消す
4.  Entity を作る
5.  作った Entity に Modification がつかないこと

### Relation

1.  Relation を作る
2.  作った Relation に Modification をつける
3.  作った Relation を消す
4.  Relation を作る
5.  作った Relation に Modification がつかないこと

### Relation を Entity から消す

1.  Relation を作る
2.  作った Relation に Modification をつける
3.  作った Relation を親 Entity を選択して消す
4.  Relation を作る
5.  作った Relation に Modification がつかないこと

## 高速に Relation を作って Modification を作る

### 背景

1.  Modification の描画は Relation 描画後に行います
2.  Relation 描画は非同期です
3.  Relation に Modification を追加後、Modification 描画開始前にデータを削除するとエラーが起きます
4.  Undo/Redo 時は一連の処理が終わるまで Relation の Modification のレンダリングをスキップしています
5.  6.0.0 で Modification を廃止しました。

### -- 手段 --

1.  Relation を作る
2.  Modification を足す
3.  z, z, y, y を 10 回なるべく高速に繰り返す

## 対象 Denotation の削除に連動して Modification が消えること

### Modification を持つ Span を消したら、Modification も消えること

#### 背景

1.  5.0.0 の開発中に、Span を消しても、その Entity の Modification がデータ上から消えずのこることがありました。
2.  6.0.0 で Modification を廃止しました。

#### -- 手段 --

1.  Term モードにする
2.  Span を作る
3.  Entity を作る
4.  Modification を追加する
5.  Span を削除する
6.  Modification が削除されること。保存したデータから Modification が消えていること

## Relation のラベルからテキストを選択してエラーが起きないこと

### 背景

1.  4.4.0 の開発中
2.  同一パラグラフ内にしか Span を作成できません
3.  Span 作成、編集時に同一パラグラフ内の操作かチェックします
4.  Relation のラベルから選択した場合、Relation のラベルは`textae-editor__body__annotation-box`の子孫です
5.  `textae-editor__body__text-box__パラグラフ`の子孫ではないため、パラグラフが取得できません
6.  パラグラフの比較を`id`で行っていたので、パラグラフが取得できなかった時に、`id`が取得できずエラーが起きていました
7.  取得した要素は直接比較可能なので、`id`での比較をやめました

### -- 手段 --

1.  Relation のラベル上でマウスダウン
2.  text 上でマウスアップ
3.  `It is ambiguous for which Span you want to adjust the boundary. Select the Span, and try again.`がアラート表示されること
4.  エラーが起きないこと

## Windows の Chrome で最大化ボタンを押した時に Grid の位置がズレる

### 背景

1.  4.4.3 で発見
2.  リサイズに合わせて Grid が移動したあとに Span が移動しているようにみえる
3.  リサイズ時の Grid の移動を二回行うことで解消
4.  本当はキューとかで管理して、最後の Grid 移動の後に一回だけ追加したい
5.  5.0.0 の開発中に 3 の処理が不要になっていることを確認して削除した

### -- 手段 --

1.  development.html を編集して editor を一つにする
2.  <http://pubannotation.org/projects/ICD10/docs/sourcedb/PubMed/sourceid/10024669/annotations.json> を開く
3.  最大化ボタンを何度か押す
4.  Grid と Span の位置がずれないこと

## ダイアログの二重表示禁止

### 背景

1.  ショートカットキーでダイアログが開けます
2.  ダイアログ表示中にショートカットキーの動作を止めないとダイアログが多重に開きます
3.  ダイアログ開いた時に、ダイアログ中の要素にフォーカスを移すことで、エディタへのキー入力を無効化します
4.  5.0.0 でラベル編集、Attribute 編集、Type 編集のダイアログの対応を追加しました

### -- 手段 --

#### Entity Type and Attribute 編集ダイアログ

1.  Term モードにする
2.  Entity を選択する
3.  `Change Label[W]`ボタンを押す
4.  Type and Attribute 編集ダイアログを開く
5.  `i`,`u`,`h`を入力する
6.  `×`ボタンを一回だけ押してダイアログが閉じれること

#### Relation ラベル編集ダイアログ

1.  Relation モードにする
2.  Relation を選択する
3.  `Change Label[W]`ボタンを押す
4.  ラベル編集ダイアログを開く
5.  `i`,`u`,`h`を入力する
6.  `×`ボタンを一回だけ押してダイアログが閉じれること

#### アノテーション読込ダイアログ

1.  アノテーション読込ダイアログを開く
2.  `i`,`u`,`h`を入力する
3.  `×`ボタンを一回だけ押してダイアログが閉じれること

#### アノテーション保存ダイアログ

1.  アノテーション保存ダイアログを開く
2.  `i`,`u`,`h`を入力する
3.  `×`ボタンを一回だけ押してダイアログが閉じれること

#### 設定ダイアログ

1.  設定ダイアログを開く
2.  `i`,`u`,`h`を入力する
3.  `×`ボタンを一回だけ押してダイアログが閉じれること

#### ヘルプダイアログ

1.  ヘルプダイアログを開く
2.  `i`,`u`,`h`を入力する
3.  `×`ボタンを一回だけ押してダイアログが閉じれること

#### Type 定義編集ダイアログ

1.  `Select Label [Q]`ボタンをクリックする
2.  Type 定義編集ダイアログを開く
3.  `i`,`u`,`h`を入力する
4.  `×`ボタンを一回だけ押してダイアログが閉じれること

#### コンフィグレーション読込ダイアログ

1.  `Select Label [Q]`ボタンをクリックする
2.  コンフィグレーション読込ダイアログを開く
3.  `i`,`u`,`h`を入力する
4.  `×`ボタンを一回だけ押してダイアログが閉じれること

#### コンフィグレーション保存ダイアログ

1.  `Select Label [Q]`ボタンをクリックする
2.  コンフィグレーション保存ダイアログを開く
3.  `i`,`u`,`h`を入力する
4.  `×`ボタンを一回だけ押してダイアログが閉じれること

## ヘルプダイアログのショートカットキーの説明

### New Entity

#### 背景

1.  Entity を Entry と間違えて書いた

#### -- 手段 --

1.  ショートカットキー図を表示する
2.  `E`の説明が`New Entity`であること

### Switch edit mode

#### 背景

1.  `Switch View mode` を `Switch edit mode` に変えた
2.  4.1.16 でアイコンを変更した

#### -- 手段 --

1.  ショートカットキー図を表示する
2.  `F`と`M`の説明が`Switch edit mode`であること
3.  `F`と`M`のアイコンが`T/R`アイコンであること

## ファイル読み込み時の Grid を再配置

### 背景

ファイル読み込み時の Grid を再配置の契機が不自然だったので変更しました。

1.  前：TypeGap を-1 以外に設定した時
2.  今：annotationData が`all.change`イベントを出した時

### -- 手段 --

1.  アノテーション読込ダイアログを表示
2.  URL から annotation を読み込む
3.  Grid が正しい位置に表示されること
4.  ローカルファイルから annotation を読み込む
5.  Grid が正しい位置に表示されること

## Span の Entity に Attribute がある時、Entity の Type を変えても Attribute が消えない

### 背景

1.  5.0.0 の開発中に、Attribute のある Entity の Type を変えると、Attribute が消えました

### -- 手段 --

1.  Term モードにする
2.  Span を作る
3.  Type を作る
4.  Attribute を作る
5.  Type を変更
6.  Attribute が表示されていること

## 複数 Editor を切り替えた時に、オートコンプリートの source が切り替わる

1.  <http://localhost:8000/dist/demo/bionlp-st-ge/demo-multi.html> を開く
2.  HTML の autocompletion_ws 属性で URL を指定してある Editor を選択する（1 つめの Editor）
3.  Entity を選択する
4.  `Change Label[W]`ボタンを押す
5.  既存の Value を消す
6.  `pro`を入力
7.  `productionCompany@http://dbpedia.org/ontology/productionCompany`を選択
8.  Entity のラベルが`productionCompany`になること
9.  autocompletion_ws 属性を指定していないエディタを選択する（二つ目の Editor）
10. 1_annotations.json を読み込む
11. Entity を選択する
12. `Change Label[W]`ボタンを押す
13. 既存の Value を消す
14. `pro`を入力
15. `production coompany@http://dbpedia.org/ontology/productionCompany`を選択
16. Entity のラベルが`production coompany`になること

## text-box の下側の空白が狭い

### 背景

1.  line-height で行の高さを設定すると上下に伸びる
2.  上だけに伸びているように見せたい
3.  上は padding-top で隙間を開けることができる
4.  下の隙間を減らしたい
5.  4.1.8 で padding-top を無視して高さを設定しなおす事で実現
6.  4.5.6 で inline アノテーションに含まれる連続した空白を読み取るために`textae-editor`に`white-space:pre`スタイルを設定しました
7.  このとき HTML タグの改行も表示に反映され、text-box の下の幅が広くなっていました
8.  5.0.0 で`textae-editor__body`と`textae-editor__footer`から改行を取り除いて、text-box の下を狭くしました

### -- 手段 --

#### 初期表示

1.  annotation を開く
2.  下側の隙間が狭いこと

#### TypeGap 変更

1.  Seting ダイアログを開く
2.  TypeGap を変更する
3.  高さが再計算されること
4.  下側の隙間が狭いこと

### リサイズ時に高さが再計算されること

#### 背景

1.  リサイズすると行数が変わるので、高さを再計算します。
2.  4.1.11 で対応しました。

#### -- 手段 --

1.  1_annotations.json を開く
2.  リサイズする
3.  下側の隙間が狭いこと

## ステータスバーの表示

### URL をデコードして表示する

#### 背景

1.  URL が長い場合に、 `Source:` の後ろで改行され、URL がフッターの範囲外に出てしまい表示されていませんでした
2.  日本語 URL は長いため、上記の現象がおきやすかったです
3.  5.0.0 からステータスバーに表示する URL を URL デコードします
4.  テストに使える日本語 URL がなくなりました

#### -- 手段 --

1.  <http://pubannotation.org/projects/%E6%96%B0%E7%9D%80%E8%AB%96%E6%96%87%E3%83%AC%E3%83%93%E3%83%A5%E3%83%BC/docs/sourcedb/FirstAuthor/sourceid/10005/divs/0/annotations.json> を読み込みます
2.  `http://pubannotation.org/projects/新着論文レビュー/docs/sourcedb/FirstAuthor/sourceid/10005/divs/0/annotations.json` と表示されること

## ブラウザをリサイズして、カーソルがぐるぐる中に Editor をクリックした

### 背景

1.  4.3.4 開発中のできごと
2.  ぐるぐる表示中は、操作禁止にするため Editor の before 擬似要素を z−index 最大で表示しています
3.  before 擬似要素の表示位置は window サイズ 100%です
4.  before 擬似要素の focus イベントも親要素の focus イベントとして発火します
5.  z−index が同じ要素 html 上後の要素の方が上に描画されます
6.  ぐるぐる表示中はどの Editor をクリックしても、一番したの Editor の focus イベントが発火します
7.  ぐるぐる表示を before 擬似要素から、div に変更します。また、div は tool が管理して一つだけ持ちます。

### -- 手段 --

1.  Term モードにする
2.  ブラウザをリサイズする
3.  ぐるぐるが出ている間に Editor をクリックする
4.  一番下の Editor が選択されずに、クリックした Editor が選択されること

## editor を選択して、Entity をクリックすると、Entity が選択される

### 背景

1.  4.4.0 の開発中に、Editor の focus out 時に、要素の選択解除をしたら、Entity クリック時に Entity が選択できなくなりました
2.  イベントの発生順序が mouse up, focus out, focus in のため、Entity 選択後に、選択解除されます

### -- 手段 --

1.  Term モードにする
2.  Editor をクリックする
3.  Entity をクリックする
4.  Entity の真ん中が赤くなること

## ダイアログが jQuery UI ダイアログで統一されていること

1.  Load ダイアログ
2.  Save ダイアログ
3.  Change label ダイアログ
4.  Setting ダイアログ
5.  Keyboard help ダイアログ

## 起動パラメータ source

### 背景

1.  annotation.json を指定するパラメータを target から source に変えました
2.  後方互換性を考慮して target も使えます
3.  両方指定された場合は source を優先します
4.  厳密な優先順位は
5.  html の属性の source
6.  html の属性の target

### -- 手段 --

1.  `target`を使って annotation が読み込めること(editor1)
2.  html の属性で、`source`と`target`を両方指定したら`source`に指定した annotation.json が読み込まれること(editor2)

## Editor 未選択時にショートカットキーを押した時にエラーが出ない

### 背景

1.  5.0.0 の開発時に、Editor の初期化前に Editor の DOM 要素をフォーカスすると、ショートカットキー入力時にエラーが起きていました。
2.  開発用の development.html に、Editor の初期化前に Editor の DOM 要素をフォーカスするスクリプトを追加しました。

### -- 手段 --

1.  <http://localhost:8000/dev/development.html> を開きます
2.  Editor を選択する前にショートカットキーを押す
3.  開発ツールのコンソールにエラーが表示されないこと

## 最後から 2 番目の Entity と最後の Entity を消したときに削除ボタンが有効にならない

### 背景

- Entity 削除時の自動選択で選択モデル内にゴミデータが入っていました
- 最後の Entity を消しても、選択モデルないのゴミがあるため、ボタンの有効無効が Entity 選択時と同じになっていました
- 4.4.0 でゴミデータが入らないよう修正しました

### -- 手段 --

1.  Term モードにする
2.  最後から 2 番目の Entity を選択する
3.  削除ボタンを押す
4.  最後の Entity が選択されること
5.  削除ボタンを押す
6.  削除ボタンが無効になること

## 削除ボタンが有効になる

### 背景

1.  4.4.1 開発中のバグ
2.  選択モデル中のリファクタリング中に、関数を呼ぶべきところを()をつけずに呼んでいました

### Term モード

1.  Term モードにする
2.  Entity を選択する
3.  削除ボタンが有効になること
4.  Span を選択する
5.  削除ボタンが有効になること
6.  選択解除する
7.  削除ボタンが無効になること

### Relation モード

1.  Relation モードにする
2.  Relation を選択する
3.  削除ボタンが有効になること
4.  選択解除する
5.  削除ボタンが無効になること

## Element.closest()の Safari 対応

### 背景

- Safari には Element.protoType.closest がない。エラーが起きていた
- 4.3.0 で polyfill を入れて対応
- Safari 6 移行で対応済み。palyfill を削除しました。

### −− 手段 --

1.  Span を選択
2.  上キーで Entity を選択
3.  下キーで Span を  選択

## ブラウザ対応

1.  Safari で <http://localhost:8000/dev/development.html> を開く
2.  Firefox で <http://localhost:8000/dev/development.html> を開く

## Term になる annotation を初期表示するときに行の高さが自動調整されること

### 背景

1.  4.4.2 で、annotations を読み込み時に Edit モードにするか View にするかを、現在のモードで判断していたのを mode パラメータから判断することにした
2.  初期化時にも mode パラメータに応じて term か term-view かにモード遷移することで、1 を実現していた
3.  Term になる annotations を読み込んだときに、モードが遷移せず行が再計算されなかった
4.  4.4.3 で、初期化時は Init モードのままにし、読み込み時に mode パラメータを元に判断するように修正

### -- 手段 --

1.  [http://localhost:8000/dev/development.html?config=1_config.json%3Faaa⌖=http://pubannotation.org/projects/ICD10/docs/sourcedb/PubMed/sourceid/10024669/annotations.json](http://localhost:8000/dev/development.html?config=1_config.json%3Faaa&target=http://pubannotation.org/projects/ICD10/docs/sourcedb/PubMed/sourceid/10024669/annotations.json) を開く
2.  type が上の行にかぶらないこと

## 行の高さのスタイル指定 grunt dist 用

### 他の div に影響を与えない

1.  `open "http://localhost:8000/dist/demo/bionlp-st-ge/demo-cdn.html?mode=edit"`
2.  `2_annotation.json`を開く
3.  新しい Entity を追加する
4.  Term モードに切り替える
5.  Span を選択できること

### line-height を指定しない時の最低値は 41px

1.  `open "http://localhost:8000/dist/demo/bionlp-st-ge/demo-empty.html"`
2.  `2_annotation.json`を開く
3.  `textae-editor__body__text-box`の`line-height`が 41px であること

## ダイアログ表示時のベールが欠けない

### 背景

1.  jQuery UI 1.10.4 の css を使うとベールが欠けていました。

### -- 手段 --

1.  `open 'http://localhost:8000/dist/demo/bionlp-st-ge/demo-cdn.html'`
2.  Setting ダイアログを開く
3.  ベールが欠けないこと

## grunt dev

### 背景

1.  ubuntu で grunt-browserify の一部のバージョンでモジュールを解決できないエラーが出ました

### -- 手段 --

1.  ubuntu で`grunt dev`できること

## アイコンの並び順

### 背景

1.  以前は`i`がありました。削除しました
2.  4.1.12 で高さ調整アイコンを追加しました
3.  4.1.13 で`setting`アイコンをギアに変更しました
4.  4.1.17 でアイコンの並び順を変更しました

### -- 手段 --

1.  一番右に`i`アイコンが表示されないこと
2.  左から次の順でアイコンが並ぶこと
3.  Import
4.  Upload
5.  View Mode
6.  Term Edit Mode
7.  Relation Edit Mode
8.  Simple View
9.  Adjust LineHeight
10. 一番右にキーボードヘルプアイコンが表示されること
11. 右から 2 番目にギアのアイコンが表示されること
