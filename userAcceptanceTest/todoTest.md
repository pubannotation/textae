# 対応予定のテスト

## パレットで SelectionAttribute タブを表示したあと、保存する configuration に indelible プロパティが追加されないこと

### 背景

1. パレットの Predicate 削除ボタンを有効にするかどうかの情報を Attribute 定義情報の indelible プロパティに書き込んでいました
2. 6.4.127 で、パレットを表示するときに使用する Attribute 定義情報をコピーでなくしました
3. 保存する cofiguration にも indelible プロパティが反映しました

### -- 手段 --

1. Editor1 を選択
2. Term モードにする
3. `q`キーを押してパレットを開く
4. `denoto`タブを開く
5. `Uplaod`ボタンをクリック
6. `Configuration differences`欄に`indelible:true`が表示されないこと

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
