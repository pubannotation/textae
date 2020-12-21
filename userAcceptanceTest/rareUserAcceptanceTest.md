# 極めて稀にやるテスト

## AttributeのあるEntityとAttributeのないEntityを選択しして、Attributeを編集、削除する

### 背景

1.  5.0.0 の開発中に、Entityから削除対象のAttributeが取れなかった時にエラーが起きていました。

### -- 手動 --

1.  AttributeがないDenotationEntityを選択
2.  AttributeがあるDenotationEntityも選択
3.  Attributeを編集する
4.  エラーが発生せずに更新されること
5.  Attributeを削除する
6.  エラーが発生せずに削除されること

## Spanをのばす/縮めたときにGridのDOM要素が重複しない

### 背景

1.  5.0.0の開発中に、Attributeの描画に対応するために、Spanを伸ばす/縮めるロジックを変えました。
2.  それまで、モデル上でSpan,Entity,Modificationを消して作り直していました。
3.  モデル上のSpanのみを削除して追加しなおし、EntityはSpanへの参照を新しいSpanに変更するロジックに変更しました。
4.  DOM上では、Spanの削除に連動してSpanとGridを削除し、Spanの追加に連動してSpanとGridを追加するロジックに変更しました。
5.  モデル上のSpan追加時に、SpanがEntityを持っていて、EntityのDOMがレンダリングされていない場合に、EntityのDOMをレンダリングします。
6.  Spanのレンダリングの前に、モデル上のEntityのSpan ID更新を行うと、DOM上のGridは古いSpan IDを持つため、GridのDOMが既にあるかの判定に失敗し、Spanに対するGridのDOM要素を追加して作成していました。
7.  `span.move`イベントのタイミングで、GridとEntityのDOMのidを旧Span IDから、新Span IDに書き換えて、Gridの幅をSpan
    に合わせて調整する処理をしていたため、重複した両方のGridが更新されて、正しく動いているように見えていました。
8.  Spanの削除に連動したGridを削除処理を追加して、旧GridのDOMを削除、GridのDOMが重複しないようにしました。
9.  6.1.1で一つのdenotationを一つのエンティティに表示することしました。

### -- 手段 --

1.  Spanを作る
2.  のばす
3.  戻す
4.  戻す
5.  Redo
6.  Redo
7.  戻す
8.  Gridが2つ表示されないこと

## idが100を跨いぐSpanを含む範囲をshiftを押して後ろからを選択

### 背景

1.  Spanのidを文字列順ソートして、正しい並び順を取得できなかったことがあります

### -- 手段 --

1.  idが100を跨いぐSpanを含む範囲を、後ろから選択する
2.  範囲内のSpanを全て選択できること

## Span作成、Relation作成をRedoしてもキーボードショートカットが有効

### 背景

1.  Span作成時、Spanを選択してSpanをfocusする
2.  Relation作成時は、Spanを選択解除して、Spanをblurする
3.  手動でRelationを作る時はeditorをfocusしていた
4.  RedoでRelationを作る時は、editorをfocusしておらず、focusがbodyに移った
5.  キーボードイベントが取得できなくなった
6.  4.5.6でRedoでRelationを作成時もeditorをfocusするようにした

### -- 手段 --

1.  Spanを２つ作る
2.  Relationモードにする
3.  Relationを作る
4.  `z`キーを3回押して、1-3の操作をUndoする
5.  `y`キーを3回押して、1−3の操作をRedoする
6.  `Hキー`を押してキーボードヘルプが表示されること

## 対象Denotationの削除して戻すと、連動してAttributeも戻ること

### Attributeを持つSpanを消して戻したら、Attributeが表示されること

#### 背景

1.  5.0.0の開発中に、Spanを消して戻したときに、元あったAttributeが表示されないことがありました。

#### -- 手段 --

1.  Termモードにする
2.  Spanを作る
3.  Attributeを追加する
4.  Spanを削除する
5.  戻す
6.  Attributeが表示されること

### Attributeを持つEntityを消して戻したら、Attributeが表示されること

#### 背景

1.  5.0.0の開発中に、Entityを消して戻したときに、元あったAttributeが表示されないことがありました。

#### -- 手段 --

1.  Termモードにする
2.  Spanを作る
3.  Typeの異なるEntityを追加する
4.  どちらかのEntityにAttributeを追加する
5.  Attributeを持つEntityを削除する
6.  戻す
7.  Attributeが表示されること

## モード変更時に選択を解除

### 背景

1.  4.1.16の開発中にRelationモードに切り替えた際にラベルのシャドウがクリアされなくなるバグが出ました。

### -- 手段 --

1.  Termモードにする
2.  Entityを選択する
3.  ラベルに赤いシャドウがつくこと
4.  Relationモードにする
5.  ラベルの赤いシャドウが消えること

## Firefox用

### Gridの位置

#### 背景

1.  Firefoxでは大量のSpanからoffsetTop/offsetLeftを取得すると意図しない値が取れることがあります
2.  代わりにgetBoundingClientRect()を使います

#### -- 手段 --

1.  <http://pubannotation.org/docs/sourcedb/PMC/sourceid/1315279/divs/10/annotations.json> を開く（いまはこのドキュメントがありません）
2.  Gridの位置がずれないこと

## AttributeのついたSpanをReplicateしてUndo/Redoできること

### 背景

1.  5.0.0.でAttributeを追加しました。Replicateの対象にしました。
2.  Attributeを作成するためには対象となるEntityのidが必要です。
3.  コマンド実行時にEntityを作成してからAttributeを作成するコマンドを生成していました。
4.  Redoでコマンドを実行するときに、前回実行時に作成したAttributeを作るコマンドを破棄せずに追加するバグがありました。
5.  Redo後にUndoした際に、同じAttributeを2回消そうとしてエラーが起きていました。
6.  subCommandsをオブジェクトのプロパティとして持つのをやめ、コマンド実行時に生成したコマンドだけを`revert`関数に埋め込むようにしました。

### -- 手段 --

1.  Termモードにする
2.  文字列`suppressor`のSpanにTypeを作る
3.  Attributeを追加する
4.  上記Spanだけを選択する
5.  `Replicate Span annotation [R]`ボタンを押下する
6.  レプリカが作られること
7.  レプリカに、選択していたSpanのTypeのAttributeが作られること
8.  Undoする
9.  Redoする
10. もう一度Undoする

## 最後のSpanを耳をひっぱて縮めて消す

### 背景

1.  4.4.1 の開発中
2.  Spanを耳をひっぱて縮めたときに、右のSpanを選択する機能を追加
3.  最後のSpanは右にSpanがいない。しかし選択しようとしてエラーを起こした

### -- 手段 --

1.  一番最後のSpanを耳をひっぱって縮めて消す
2.  エラーが起きないこと

## Spanを作成して戻す

### 背景

1.  Undo時のrevert処理をfactory（モジュール外に公開する参照用オブジェクト）から取得していました
2.  削除処理を変更するとrevert処理にまで影響が出ていました
3.  revert処理は個々のcommandの情報だけで作れる
4.  4.1.8でfactoryを参照せずにロジカルに生成するようにしました
5.  4.2.1の開発中に、Span削除時にunfocusするためのDOM要素が取得できずにエラーが起きました

### -- 手段 --

1.  Spanを作る
2.  戻す

## 1つのattributeを複数回レンダリングしないこと

### 背景

1.  5.0.0の開発中にattributesを二重表示するバグがありました

### -- 手段 --

1.  Spanを作る
2.  attributesを追加する
3.  包含Spanを作る
4.  最初に作ったSpanのAttributeが2個表示されないこと

## RelationモードからTermモードに切り替えたときにRelationがつくれないこと

### 背景

1.  5.2.3で、EditRelationをリファクタリングしたときに、バインドしたイベントハンドラーのリストをreturnする処理が抜けて、モード切り替え時に、Relationモード用の尾イベントハンドラーが解放されませんでした。その結果、RelationモードからTermモードに切り替えても、Relationがつくれました。
2.  5.3.2で、修正しました

### -- 手段 --

1.  Relationモードにする
2.  Termモードにする
3.  Spanを2つ作る
4.  選択中でないEntityをクリックする
5.  Relationが作られずに、クリックしたEntityが選択されること

## SpanのEntityが一つの時、EntityのTypeを変えてもEntityが消えない

### 背景

1.  4.2.1で、SpanにEntityが一つの時、EntityのTypeを変えると消えました
2.  Entity変更時の処理順が古いEntity削除、新しいEntity追加でした
3.  Entityを削除して、Entityが0個になるとGridを削除します
4.  （折返し可能なBlock Span選択時の上キー押下時に上レイヤーが選択可能か判定を簡単にするため）
5.  新しいEntityを追加する時に、Gridを追加します。
6.  Gridの位置を設定しないためGridが表示領域外にあり、Entityが消えたように見えます
7.  処理順を新しいEntity追加、古いEntity削除に変え、Entity数が0にならないようにしました

### -- 手段 --

1.  Editor1を選択
2.  `T1.a.b`のTypeを変更
3.  表示されていること

## Relation付きのSpanを伸ばす/縮める

1.  Termモードにする
2.  Relation付きのSpanを伸ばす/縮める
3.  Relationが選択されないこと

## Spanを削除して左右キー選択を変更

### 背景

1.  4.2.1の開発中に判明。Span削除時にSpanTreeを更新しておらず、
2.  左右Spanが削除後のSpanを参照していた。

### -- 手段 --

1.  Spanを選択する
2.  `Dキー`を押す
3.  選択したSpanが削除されること
4.  削除したSpanの左隣のSpanを選択する
5.  `右キー`を押す
6.  右隣のSpanが選択されること

## Rockなannotationを開く

### 一般的な

1.  Multi tracks（レンダリングに時間がかかる） <http://pubannotation.org/docs/sourcedb/PMC/sourceid/1315279/divs/10/annotations.json>
2.  行がたくさん(不正データあり) <http://pubannotation.org/projects/BLAH2015_Annotations_test_5/docs/sourcedb/PMC/sourceid/4300004/divs/16/annotations.json>
3.  cross Spanがたくさん <http://pubannotation.org/projects/BLAH2015_Annotations_test_5/docs/sourcedb/PMC/sourceid/4300004/divs/1/annotations.json>

## アノテーション保存時のRelationのフォーマット

### 背景

1.  5.0.0で、Attributeを扱う様になった時に内部的に型の名前とAttributeをあわせて管理するTypeModelを導入しました
2.  Relationの保存時にフォーマットを修正する処理が抜けていました
3.  5.0.1で対応

### -- 手段 --

1.  アノテーション保存ダイアログを開く(editor0)
2.  `Click to see the json source in a new window`をクリックする
3.  Relationのフォーマットのpredが`"pred":{"_name":"associated_with","_entity":null}`の形式にならずに、 `"relations":[{"id":"R1","pred":"associated_with","subj":"T0","obj":"T1"},{"id":"R2","pred":"associated_with","subj":"T2","obj":"T3"},{"id":"R3","pred":"associated_with","subj":"T4","obj":"T5"},{"id":"R4","pred":"associated_with","subj":"T6","obj":"T7"}]`であること

## Spanを伸ばす/縮めるたときに折り返さないこと

### 背景

1.  5.0.0の開発中に、Spanを伸ばす/縮めるロジックを変えました。
2.  Entityを消して作り直すのをやめ、モデル上のSpanのみを作り直しEntityのSpanへの参照を新しいSpanに変更するロジックに変更しました。
3.  画面上のSpan作成時に`textae-editor__span--wrap`（テキスト折り返し用のクラス）を一度追加し、Entityを作り直した際に、`textae-editor__span--wrap`を消していたロジックが露見しました。
4.  `textae-editor__span--wrap`追加判定ロジックを、Block Spanのときのみ追加するように修正しました。
5.  6.1.0で折返し可能なBlock Spanを廃止しました。

### -- 手段 --

1.  Termモードにする
2.  行を越えるSpanを作る
3.  折り返さないこと
4.  Spanを伸ばす
5.  折り返さないこと

## 親Spanを消したあともGridが移動する

### 背景

1.  Gridの位置変更はSpanの親子をたどって計算しています
2.  親Spanを消した時に子から親の参照を消しを忘れるバグがありました
3.  親を持つSpanは位置変更が掛からなくなっていました

### -- 手段 --

1.  Spanを覆うSpanを作る
2.  作ったSpanを削除する
3.  リサイズするとGridが移動すること

## SpanのEntityを同じものに変更してもEntityが消えない

### 背景

1.  4.2.2でSpanのEntityを同じものに変えると消えました
2.  Typeを同じものに変更した場合は、実行しません

### -- 手段 --

1.  Entityを一つ選択する
2.  `w`キーを押す
3.  変更せずに`OK`ボタンを押す
4.  Entityが消えないこと

## annotations validator 表示内容の更新

### 背景

1.  4.1.8に一度不正内容を表示すると、別の不正ファイルを読んでも内容が変わらないバグがありました。
2.  4.1.10で修正しました。

### -- 手段 --

1.  invalid.jsonを読み込む
2.  invalid_multi.jsonを読む
3.  invalid_multiの不正内容(Track 1 annotations.以下)が表示されること

## Attributeを持つSpanを消したら、Attributeも消えること

### 背景

1.  5.0.0の開発中に、Spanを消しても、そのEntityのAttributeがデータ上から消えずのこることがありました。

### -- 手段 --

1.  Termモードにする
2.  Spanを作る
3.  Entityを2つ作る
4.  Attributeを追加する
5.  Spanを削除する
6.  新しいSpanを作る。Attributeが勝手につかないこと

## 非multi trackファイル読み込み

### 背景

1.  非multi tracksでもtrack idを表示しようとして、取得できずundefinedを表示していました。

### -- 手段 --

1.  Editモードにする
2.  通常のjsonを読み込む(1_annotations.json)
3.  トーストが表示されないこと
4.  Relationに`undefined`が表示されないこと(idとTypeを表示)

## 境界検出の無限ループ

### 背景

1.  前の文字が無い場合の境界判定に失敗して無限ループになるバグがありました。
2.  4.1.8で対応しました。

### 端っこの単語のBoundary Detection

1.  `Boundary Detection`ボタンを押下状態にする
2.  最初の単語をSpanにする
3.  最後の単語をSpanにする
4.  最後の単語（ピリオドなどがあれば含む）をSpanにする
5.  全て戻す

### Boundary Detection有効時に先頭の文字を含み区切り文字を含まないSpanを縮める

1.  一番先頭の単語を区切り文字（空白やハイフン）を含めずにSpanにする
2.  後ろから前に縮める
3.  無限ループになって固まらないこと
4.  Spanが削除されること

## Simpleモードで上のTypeにAttributeがあるときにAttributeが下のTypeの背後に隠れないこと

### 背景

1.  5.0.0からAttributeを追加しました
2.  Simpleモードでは、Attributeが下のTypeに隠れてしまいました。
3.  いままではTypeGapを含めた高さをTypeDomに固定値で設定していました。SimpleモードではLabelの高さの固定値でした。
4.  Attributeの数に応じてTypeDomの高さを自動調整するために、TypeDom内のDomのレイアウトを修正しました。
5.  TypeDomの中に、TypeGapの高さを設定するためのTypeGap用のDOM要素を追加し、TypeGapに応じた高さの設定をTypeDomから分離しました。
6.  LabelとAttributeを表示するDOM要素TypeValuesを追加しました。この高さをautoにしAttributeの数に応じて可変にしました。
7.  Gridの位置は、TypeGap + EntityPane + Label + Attributeの高さの和を、Span座標から引いた位置に絶対指定で配置します。

### -- 手段 --

1.  Termモードにする
2.  Spanを作る
3.  Typeを2つ以上作る
4.  最下段以外のTypeにAttributeを追加する
5.  Simpleモードでにする
6.  最下段以外のTypeのAttributeが、その下のTypeの背後に隠れないこと

## Relationの選択状態

### Relationを選択解除したときに矢印だけだ大きくなったままにならない

1.  Relationモードにする
2.  Relationをホーバーしながら選択
3.  選択を解除
4.  大きい矢印が残らないこと

### Relationを選択してTermモードに切り替える

1.  Relationを選択
2.  Termモードにする
3.  Relationモードにする
4.  同じRelationを選択できること

## コントロールバーのアイコンのtooltip

### 背景

1.  4.1.8で`Edit Relation`を`Relation Edit Mode`に修正しました
2.  4.1.12で高さ調整アイコンを追加しました
3.  4.1.17で`Simple Mode`を`Simple View`に修正しました
4.  4.1.17で`Auto Adjust LineHeight`を`Adjust LineHeight`に修正しました
5.  5.0.0で`Add Attributes [T]`を追加しました
6.  5.3.0で`Add Attributes [T]`を廃止しました

### -- 手段 --

1.  Relation Edit Modeをホバーする
2.  tooltipが`Relation Edit Mode`であること
3.  Simple Viewをホバーする
4.  tooltipが`Simple View`であること
5.  リフレッシュアイコンをホバーする
6.  tooltipが`Adjust LineHeight`であること

## Block Spanを通常のSpanに戻したら、折り返しをやめる

### 背景

1.  5.0.0の開発中に発生
2.  `textae-editor__span--wrap`追加判定ロジックを、Block Spanのときのみ追加するように修正しました。
3.  `textae-editor__span--wrap`削除判定ロジックも、Block Spanのときのみ実行していました。
4.  Block Span出なかったときも、`textae-editor__span--wrap`削除します。
5.  6.1.0で折返し可能なBlock Spanを廃止しました。

### -- 手段 --

1.  Termモードにする
2.  通常のSpanを作る
3.  TypeをSentenceに変える
4.  Block Spanに変わる
5.  通常のSpanに戻す
6.  Spanが改行されること

## Block Span

### 背景

1.  6.1.0で折返し可能なBlock Spanを廃止しました。

### 作る

1.  Editor1を選択
2.  Termモードにする
3.  通常のSpanを作る
4.  TypeをSentenceに変える
5.  Block Spanに変わる

### 表示

1.  Block Spanがピンク色のSpanで表示されること
2.  Block Spanが改行されること（一語は改行しない）

### 編集

1.  のびる
2.  ちぢむ
3.  コピーできる
4.  貼付けできる
5.  削除できる
6.  Typeを変えられる

### 選択

1.  ctrl（Macの場合はCmd）を押してSpanを複数選択できる
2.  shiftを押してSpanを範囲選択できる

### Block Spanを通常のSpanに戻したら、Entityが表示されること

#### 背景

1.  4.2.1から発生
2.  上キーの移動可能チェックにGridのDOMの有無を使うことにした
3.  EntityがなくなったpaneとGridを消す
4.  EntityのTypeを変更時に、新しいEntityを作って、古いEntityを消す順に変更
5.  Entityの削除で、同じtitleのDOMの一つ目だけが取れていたため、通常Spanでは上手く動いた
6.  Block Spanは古いEntityがないため、新しいEntityを削除した
7.  処理順を、古いEntityを削除、新しいEntityを作成、EntityがなくなったpaneとGridを消すの3段階に変更して、対応

#### -- 手段 --

1.  Termモードにする
2.  通常のSpanを作る
3.  TypeをSentenceに変える
4.  Block Spanに変わる
5.  TypeをProteinに変える
6.  SpanにTypeとEntityが表示されること

### Block Spanに他のTypeをつけたら折り返しをやめる

#### 背景

Block SpanにSentence以外のTypeを作ると上手く表示できない。

1.  Gridはdivなので折り返せない。位置がズレる
2.  Block Spanでなくなった時にGrid位置が再計算しないとズレたままになる
3.  Block SpanにSentence以外のTypeをつけたら、通常Spanになって正しい位置に表示されることを確認

#### -- 手段 --

1.  行を越えるSpanを作る
2.  折り返さないこと
3.  TypeをSentenceに変える
4.  Block Spanに変わる
5.  折り返すこと
6.  他のTypeを追加する
7.  折り返しをやめること
8.  追加したTypeの高さがBlock Spanの真上であること
9.  追加したTypeの幅がBlock Spanと同じであること
10. 追加したTypeの左端がBlock Spanと同じであること
11. 色はピンクのままであること

## 左右キーで選択Entityを変更するときBlock Span（のDOM上に表示されていないEntity）を飛ばす

### 背景

1.  データモデル上ではBlockSpanもEntityを持っています
2.  データモデル上でEntityを探すと、DOM上に存在しないEntityも検出していまいます。
3.  左右の要素はDOM要素上で検索しています。
4.  6.1.0で折返し可能なBlock Spanを廃止しました。

### -- 手段 --

1.  Block Spanの右隣のSpanのEntityを選択する
2.  `左キー`を押す
3.  左隣のEntityが選択されること
4.  Block Spanの左隣のSpanのEntityを選択する
5.  `右キー`を押す
6.  右隣のEntityが選択されること

### Block Spanの左に作ったEntityに左右キーで移動できる

#### 背景

1.  4.2.1から発生
2.  左右キーで移動するEntityの順序をDOMの順序から取得します
3.  Gridを作るときは右のSpanのGridの前に挿入します
4.  Block SpanはGridが無いので、新規Gridの挿入に失敗し最後に追加していました
5.  4.4.2で修正
6.  すぐ右のSpanにGridがなかったときは次のSpanのGridを辿ります。

#### -- 手段 --

1.  Block Spanを作る
2.  Block Spanのすぐ左に新しいSpanを作る
3.  新しく作ったSpanのEntityを選択する
4.  `右キー`を押す
5.  右隣のEntityが選択されること
6.  `左キー`を押す
7.  左隣のEntityが選択されること

## Block Spanを選択して、上下キーを押しても選択が切り替わらない

### 背景

1.  4.2.1の開発中
2.  selectionModel中では、Type編集等の対象とするために、Block SpanのEntityも選択する
3.  選択EntityをselectionModelから取得したら、選択できていることになった
4.  選択EntityをDOMから取得することにした
5.  6.1.0で折返し可能なBlock Spanを廃止しました。

### -- 手段 --

1.  Block Spanを選択する
2.  `上キー`を押す
3.  Block Spanが選択されたままであること
4.  Block Spanを選択する
5.  `下キー`を押す
6.  Block Spanが選択されたままであること

## Block Spanをのばす/縮めたときに通常Spanにならないこと

### 背景

1.  SpanのDOMをレンダリングする時に、SpanがBlock Spanかどうかはモデル上のentityをなめて対象のspanを参照するBlock Entityがあるかどうかで判定しています。
2.  モデル上のEntityのSpan ID更新をSpanのレンダリングのあとに行ったため、SpanがBlock Spanかどうかの判定に失敗しました。
3.  モデル上のEntityのSpan ID更新をSpanのレンダリングの前に行って対応しました。
4.  6.1.0で折返し可能なBlock Spanを廃止しました。

### -- 手段 --

1.  Block Spanをのばす
2.  ピンク色のままであること

## 重たい操作にカーソルがぐるぐるになる

1.  次のときリレーションの配置完了までカーソルがぐるぐるになり要素がクリック不能になること
    1.  初回読み込み
    2.  annotationデータ<http://pubannotation.org/docs/sourcedb/PMC/sourceid/1315279/divs/10/annotations.json>読込み時
    3.  リサイズ時
    4.  Simpleモードとその他のモード切り替え時

## Modification

### 背景

1.  6.0.0でModificationを廃止しました。

### 見た目

1.  Entityにnegationだけなら、Entityの上にxを表示
2.  Entityにspeculationだけなら、Entityの上に?を表示
3.  Entityにnegationとspeculationがついたら、xの上に?を表示

### ボタン

1.  選択したEntity/Relationが全てnegation/speculationを持つと押下状態になる

### 編集

1.  Entity/Relationを選択し
2.  negation/speculationボタンを押下状態にするとx/?がつく
3.  negation/speculationボタンを押下状態を解除するとx/?が外れる

### Undo/Redo

1.  RelationモードでEntityのModification編集を戻す、やりなおす
2.  RelationモードでRelationのModification編集を戻す、やりなおす

## Modification付きのSpanを伸ばす/縮める

### 背景

1.  5.0.0の開発中まで気づかなかった
2.  6.0.0でModificationを廃止しました。

### -- 手段 --

1.  Termモードにする
2.  Spanを作る
3.  Modificationを追加する
4.  Modification付きのSpanを伸ばす
5.  Modificationが消えないこと
6.  Modification付きのSpanを縮める
7.  Modificationが消えないこと

## Modificationのあるオブジェクトを削除

### 背景

1.  Modificationのあるオブジェクトを削除するとエラーが起きるバグがありました
2.  renderModificationを抽出する際に、buttonStateHelperの渡し漏れです
3.  4.1.8の開発中に発生して修正しました
4.  6.0.0でModificationを廃止しました。

### -- 手段 --

1.  1_annotations.jsonを開く
2.  Modificationを持つEntityを削除します
3.  Modificationを持つRelationを削除します

## モデルからModificationを削除

### 背景

1.  Modificationの表示だけ消してモデルから消さないバグがありました
2.  同じIDのEntityを作った時に最初からModificationがついて表示されていました
3.  同じIDのRelationを作った時に最初からModificationがついて表示されていました
4.  4.4.1でEntity => Relation => Modificationの連鎖削除時に、モデルから消さないバグを修正しました
5.  6.0.0でModificationを廃止しました。

### Entity

1.  Entityを作る
2.  作ったEntityにModificationをつける
3.  作ったEntityを消す
4.  Entityを作る
5.  作ったEntityにModificationがつかないこと

### Relation

1.  Relationを作る
2.  作ったRelationにModificationをつける
3.  作ったRelationを消す
4.  Relationを作る
5.  作ったRelationにModificationがつかないこと

### RelationをEntityから消す

1.  Relationを作る
2.  作ったRelationにModificationをつける
3.  作ったRelationを親Entityを選択して消す
4.  Relationを作る
5.  作ったRelationにModificationがつかないこと

## 高速にRelationを作ってModificationを作る

### 背景

1.  Modificationの描画はRelation描画後に行います
2.  Relation描画は非同期です
3.  RelationにModificationを追加後、Modification描画開始前にデータを削除するとエラーが起きます
4.  Undo/Redo時は一連の処理が終わるまでRelationのModificationのレンダリングをスキップしています
5.  6.0.0でModificationを廃止しました。

### -- 手段 --

1.  Relationを作る
2.  Modificationを足す
3.  z, z, y, yを10回なるべく高速に繰り返す

## 対象Denotationの削除に連動してModificationが消えること

### Modificationを持つSpanを消したら、Modificationも消えること

#### 背景

1.  5.0.0の開発中に、Spanを消しても、そのEntityのModificationがデータ上から消えずのこることがありました。
2.  6.0.0でModificationを廃止しました。

#### -- 手段 --

1.  Termモードにする
2.  Spanを作る
3.  Entityを作る
4.  Modificationを追加する
5.  Spanを削除する
6.  Modificationが削除されること。保存したデータからModificationが消えていること

## Relationのラベルからテキストを選択してエラーが起きないこと

### 背景

1.  4.4.0の開発中
2.  同一パラグラフ内にしかSpanを作成できません
3.  Span作成、編集時に同一パラグラフ内の操作かチェックします
4.  Relationのラベルから選択した場合、Relationのラベルは`textae-editor__body__annotation-box`の子孫です
5.  `textae-editor__body__text-box__パラグラフ`の子孫ではないため、パラグラフが取得できません
6.  パラグラフの比較を`id`で行っていたので、パラグラフが取得できなかった時に、`id`が取得できずエラーが起きていました
7.  取得した要素は直接比較可能なので、`id`での比較をやめました

### -- 手段 --

1.  Relationのラベル上でマウスダウン
2.  text上でマウスアップ
3.  `It is ambiguous for which Span you want to adjust the boundary. Select the Span, and try again.`がアラート表示されること
4.  エラーが起きないこと

## WindowsのChromeで最大化ボタンを押した時にGridの位置がズレる

### 背景

1.  4.4.3で発見
2.  リサイズに合わせてGridが移動したあとにSpanが移動しているようにみえる
3.  リサイズ時のGridの移動を二回行うことで解消
4.  本当はキューとかで管理して、最後のGrid移動の後に一回だけ追加したい
5.  5.0.0の開発中に3の処理が不要になっていることを確認して削除した

### -- 手段 --

1.  development.htmlを編集してeditorを一つにする
2.  <http://pubannotation.org/projects/ICD10/docs/sourcedb/PubMed/sourceid/10024669/annotations.json> を開く
3.  最大化ボタンを何度か押す
4.  GridとSpanの位置がずれないこと

## ダイアログの二重表示禁止

### 背景

1.  ショートカットキーでダイアログが開けます
2.  ダイアログ表示中にショートカットキーの動作を止めないとダイアログが多重に開きます
3.  ダイアログ開いた時に、ダイアログ中の要素にフォーカスを移すことで、エディタへのキー入力を無効化します
4.  5.0.0でラベル編集、Attribute編集、Type編集のダイアログの対応を追加しました

### -- 手段 --

#### Entity Type and Attribute編集ダイアログ

1.  Termモードにする
2.  Entityを選択する
3.  `Change Label[W]`ボタンを押す
4.  Type and Attribute編集ダイアログを開く
5.  `i`,`u`,`h`を入力する
6.  `×`ボタンを一回だけ押してダイアログが閉じれること

#### Relationラベル編集ダイアログ

1.  Relationモードにする
2.  Relationを選択する
3.  `Change Label[W]`ボタンを押す
4.  ラベル編集ダイアログを開く
5.  `i`,`u`,`h`を入力する
6.  `×`ボタンを一回だけ押してダイアログが閉じれること

#### アノテーション読込みダイアログ

1.  アノテーション読込みダイアログを開く
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

#### Type定義編集ダイアログ

1.  `Select Label [Q]`ボタンをクリックする
2.  Type定義編集ダイアログを開く
3.  `i`,`u`,`h`を入力する
4.  `×`ボタンを一回だけ押してダイアログが閉じれること

#### コンフィグレーション読込みダイアログ

1.  `Select Label [Q]`ボタンをクリックする
2.  コンフィグレーション読込みダイアログを開く
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

1.  EntityをEntryと間違えて書いた

#### -- 手段 --

1.  ショートカットキー図を表示する
2.  `E`の説明が`New Entity`であること

### Switch edit mode

#### 背景

1.  `Switch View mode` を `Switch edit mode` に変えた
2.  4.1.16でアイコンを変更した

#### -- 手段 --

1.  ショートカットキー図を表示する
2.  `F`と`M`の説明が`Switch edit mode`であること
3.  `F`と`M`のアイコンが`T/R`アイコンであること

## ファイル読み込み時のGridを再配置

### 背景

ファイル読み込み時のGridを再配置の契機が不自然だったので変更しました。

1.  前：TypeGapを-1以外に設定した時
2.  今：annotationDataが`all.change`イベントを出した時

### -- 手段 --

1.  読込みダイアログを表示
2.  URLからannotationを読み込む
3.  Gridが正しい位置に表示されること
4.  ローカルファイルからannotationを読み込む
5.  Gridが正しい位置に表示されること

## SpanのEntityにAttributeがある時、EntityのTypeを変えてもAttributeが消えない

### 背景

1.  5.0.0 の開発中に、AttributeのあるEntityのTypeを変えると、Attributeが消えました

### -- 手段 --

1.  Termモードにする
2.  Spanを作る
3.  Typeを作る
4.  Attributeを作る
5.  Typeを変更
6.  Attributeが表示されていること

## 複数Editorを切り替えた時に、オートコンプリートのsourceが切り替わる

1.  <http://localhost:8000/dist/demo/bionlp-st-ge/demo-multi.html> を開く
2.  HTMLのautocompletion_ws属性でURLを指定してあるEditorを選択する（1つめのEditor）
3.  Entityを選択する
4.  `Change Label[W]`ボタンを押す
5.  既存のValueを消す
6.  `pro`を入力
7.  `productionCompany@http://dbpedia.org/ontology/productionCompany`を選択
8.  Entityのラベルが`productionCompany`になること
9.  autocompletion_ws属性を指定していないエディタを選択する（二つ目のEditor）
10. 1_annotations.jsonを読み込む
11. Entityを選択する
12. `Change Label[W]`ボタンを押す
13. 既存のValueを消す
14. `pro`を入力
15. `production coompany@http://dbpedia.org/ontology/productionCompany`を選択
16. Entityのラベルが`production coompany`になること

## text-boxの下側の空白が狭い

### 背景

1.  line-heightで行の高さを設定すると上下に伸びる
2.  上だけに伸びているように見せたい
3.  上はpadding-topで隙間を開けることができる
4.  下の隙間を減らしたい
5.  4.1.8でpadding-topを無視して高さを設定しなおす事で実現
6.  4.5.6でinlineアノテーションに含まれる連続した空白を読み取るために`textae-editor`に`white-space:pre`スタイルを設定しました
7.  このときHTMLタグの改行も表示に反映され、text-boxの下の幅が広くなっていました
8.  5.0.0で`textae-editor__body`と`textae-editor__footer`から改行を取り除いて、text-boxの下を狭くしました

### -- 手段 --

#### 初期表示

1.  annotationを開く
2.  下側の隙間が狭いこと

#### TypeGap変更

1.  Setingダイアログを開く
2.  TypeGapを変更する
3.  高さが再計算されること
4.  下側の隙間が狭いこと

### リサイズ時に高さが再計算されること

#### 背景

1.  リサイズすると行数が変わるので、高さを再計算します。
2.  4.1.11で対応しました。

#### -- 手段 --

1.  1_annotations.jsonを開く
2.  リサイズする
3.  下側の隙間が狭いこと

## ステータスバーの表示

### URLをデコードして表示する

#### 背景

1.  URLが長い場合に、 `Source:` の後ろで改行され、URLがフッターの範囲外に出てしまい表示されていませんでした
2.  日本語URLは長いため、上記の現象がおきやすかったです
3.  5.0.0 からステータスバーに表示するURLをURLデコードします
4.  テストに使える日本語URLがなくなりました

#### -- 手段 --

1.  <http://pubannotation.org/projects/%E6%96%B0%E7%9D%80%E8%AB%96%E6%96%87%E3%83%AC%E3%83%93%E3%83%A5%E3%83%BC/docs/sourcedb/FirstAuthor/sourceid/10005/divs/0/annotations.json> を読み込みます
2.  `http://pubannotation.org/projects/新着論文レビュー/docs/sourcedb/FirstAuthor/sourceid/10005/divs/0/annotations.json` と表示されること

## ブラウザをリサイズして、カーソルがぐるぐる中にEditorをクリックした

### 背景

1.  4.3.4開発中のできごと
2.  ぐるぐる表示中は、操作禁止にするためEditorのbefore擬似要素をz−index最大で表示しています
3.  before擬似要素の表示位置はwindowサイズ100%です
4.  before擬似要素のfocusイベントも親要素のfocusイベントとして発火します
5.  z−indexが同じ要素html上後の要素の方が上に描画されます
6.  ぐるぐる表示中はどのEditorをクリックしても、一番したのEditorのfocusイベントが発火します
7.  ぐるぐる表示をbefore擬似要素から、divに変更します。また、divはtoolが管理して一つだけ持ちます。

### -- 手段 --

1.  Termモードにする
2.  ブラウザをリサイズする
3.  ぐるぐるが出ている間にEditorをクリックする
4.  一番下のEditorが選択されずに、クリックしたEditorが選択されること

## editorを選択して、Entityをクリックすると、Entityが選択される

### 背景

1.  4.4.0の開発中に、Editorのfocus out時に、要素の選択解除をしたら、Entityクリック時にEntityが選択できなくなりました
2.  イベントの発生順序がmouse up, focus out, focus inのため、Entity選択後に、選択解除されます

### -- 手段 --

1.  Termモードにする
2.  Editorをクリックする
3.  Entityをクリックする
4.  Entityの真ん中が赤くなること

## ダイアログがjQuery UI ダイアログで統一されていること

1.  Load ダイアログ
2.  Save ダイアログ
3.  Change label ダイアログ
4.  Setting ダイアログ
5.  Keyboard help ダイアログ

## 起動パラメータsource

### 背景

1.  annotation.jsonを指定するパラメータをtargetからsourceに変えました
2.  後方互換性を考慮してtargetも使えます
3.  両方指定された場合はsourceを優先します
4.  厳密な優先順位は
5.  htmlの属性のsource
6.  htmlの属性のtarget

### -- 手段 --

1.  `target`を使ってannotationが読み込めること(editor1)
2.  htmlの属性で、`source`と`target`を両方指定したら`source`に指定したannotation.jsonが読み込まれること(editor2)

## Editor未選択時にショートカットキーを押した時にエラーが出ない

### 背景

1.  5.0.0の開発時に、Editorの初期化前にEditorのDOM要素をフォーカスすると、ショートカットキー入力時にエラーが起きていました。
2.  開発用のdevelopment.htmlに、Editorの初期化前にEditorのDOM要素をフォーカスするスクリプトを追加しました。

### -- 手段 --

1.  <http://localhost:8000/dev/development.html> を開きます
2.  Editorを選択する前にショートカットキーを押す
3.  開発ツールのコンソールにエラーが表示されないこと

## 最後から2番目のEntityと最後のEntityを消したときに削除ボタンが有効にならない

### 背景

-   Entity削除時の自動選択で選択モデル内にゴミデータが入っていました
-   最後のEntityを消しても、選択モデルないのゴミがあるため、ボタンの有効無効がEntity選択時と同じになっていました
-   4.4.0でゴミデータが入らないよう修正しました

### -- 手段 --

1.  Termモードにする
2.  最後から2番目のEntityを選択する
3.  削除ボタンを押す
4.  最後のEntityが選択されること
5.  削除ボタンを押す
6.  削除ボタンが無効になること

## 削除ボタンが有効になる

### 背景

1.  4.4.1開発中のバグ
2.  選択モデル中のリファクタリング中に、関数を呼ぶべきところを()をつけずに呼んでいました

### Termモード

1.  Termモードにする
2.  Entityを選択する
3.  削除ボタンが有効になること
4.  Spanを選択する
5.  削除ボタンが有効になること
6.  選択解除する
7.  削除ボタンが無効になること

### Relationモード

1.  Relationモードにする
2.  Relationを選択する
3.  削除ボタンが有効になること
4.  選択解除する
5.  削除ボタンが無効になること

## Element.closest()のSafari対応

### 背景

-   SafariにはElement.protoType.closestがない。エラーが起きていた
-   4.3.0でpolyfillを入れて対応
-   Safari 6移行で対応済み。palyfillを削除しました。

### −− 手段 --

1.  Spanを選択
2.  上キーでEntityを選択
3.  下キーでSpanを選択

## ブラウザ対応

1.  Safariで <http://localhost:8000/dev/development.html> を開く
2.  Firefoxで <http://localhost:8000/dev/development.html> を開く

## Termになるannotationを初期表示するときに行の高さが自動調整されること

### 背景

1.  4.4.2で、annotationsを読み込み時にEditモードにするかViewにするかを、現在のモードで判断していたのをmodeパラメータから判断することにした
2.  初期化時にもmodeパラメータに応じてtermかterm-viewかにモード遷移することで、1を実現していた
3.  Termになるannotationsを読み込んだときに、モードが遷移せず行が再計算されなかった
4.  4.4.3で、初期化時はInitモードのままにし、読み込み時にmodeパラメータを元に判断するように修正

### -- 手段 --

1.  [http://localhost:8000/dev/development.html?config=1_config.json%3Faaa⌖=http://pubannotation.org/projects/ICD10/docs/sourcedb/PubMed/sourceid/10024669/annotations.json](http://localhost:8000/dev/development.html?config=1_config.json%3Faaa&target=http://pubannotation.org/projects/ICD10/docs/sourcedb/PubMed/sourceid/10024669/annotations.json) を開く
2.  typeが上の行にかぶらないこと

## 行の高さのスタイル指定 grunt dist用

### 他のdivに影響を与えない

1.  `open "http://localhost:8000/dist/demo/bionlp-st-ge/demo-cdn.html?mode=edit"`
2.  `2_annotation.json`を開く
3.  新しいEntityを追加する
4.  Termモードに切り替える
5.  Spanを選択できること

### line-heightを指定しない時の最低値は41px

1.  `open "http://localhost:8000/dist/demo/bionlp-st-ge/demo-empty.html"`
2.  `2_annotation.json`を開く
3.  `textae-editor__body__text-box`の`line-height`が41pxであること

## ダイアログ表示時のベールが欠けない

### 背景

1.  jQuery UI 1.10.4のcssを使うとベールが欠けていました。

### -- 手段 --

1.  `open 'http://localhost:8000/dist/demo/bionlp-st-ge/demo-cdn.html'`
2.  Settingダイアログを開く
3.  ベールが欠けないこと

## grunt dev

### 背景

1.  ubuntuでgrunt-browserifyの一部のバージョンでモジュールを解決できないエラーが出ました

### -- 手段 --

1.  ubuntuで`grunt dev`できること

## アイコンの並び順

### 背景

1.  以前は`i`がありました。削除しました
2.  4.1.12で高さ調整アイコンを追加しました
3.  4.1.13で`setting`アイコンをギアに変更しました
4.  4.1.17でアイコンの並び順を変更しました

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
11. 右から2番目にギアのアイコンが表示されること
