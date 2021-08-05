# 受け入れテスト

共通確認項目

1.  `npm run dist`を実行します
2.  `npm run dev:server`を実行します
3.  <http://localhost:8000/dist/demo/development.html> を開きます
4.  ブラウザの開発ツールを起動します。
5.  以下のテストを実行して、エラーが出ないこと

## Ctrl/Cmd を押して複数選択、Term モードで

1.  Term モードにする
2.  Span と Span を同時に複数選択する
3.  Entity と Entity を同時に複数選択する
4.  Span と Entity を同時に複数選択する

## Ctrl/Cmd を押しながら、新しく作った Relation をラベルを使って複数選択

1.  新規に Relation を作る
2.  他の Relation を選択
3.  Ctrl を押しながら新しく作った Relation のラベルをクリック
4.  両方の Relation が選択されること

## マウス操作で兄弟 Span を端を共有する親 Span にする

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
