## Attribute のある Entity と Attribute のない Entity を同時に選択しているとき、その Attribute を編集するショートカットキーを押したら警告を表示する

### 背景

1. 6.x.x で、パレットの Attribute 編集ボタンを有効にする条件を追加しました
1. 6.4.x でショートカットキーから Attribute 編集するときの条件を同等にしました

### -- 手段 --

1.  Editor1 を選択
2.  Term モードにする
3.  `T1:a:b`と`E1:a:b`を選択する
4.  `5`キーを押す
5.  `Some selected items has zero or multi this attribute.`が表示されること
