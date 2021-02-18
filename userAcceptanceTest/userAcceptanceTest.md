# 受け入れテスト

共通確認項目

1.  `npm run dist`を実行します
2.  `npm run dev:server`を実行します
3.  <http://localhost:8000/dist/demo/development.html> を開きます
4.  ブラウザの開発ツールを起動します。
5.  以下のテストを実行して、エラーが出ないこと

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

## String Attribute 定義の Value の追加、編集、削除

### 背景

1.  5.2.0 から Entity パレットで String Attribute の Value が編集出来るようになりました。

### -- 手段 --

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
8. String Attribute 編集ダイアログの`Object`を`par`に変更
9. 表示された候補を選択
10. `OK`ボタンをクリック
11. エラーが起きないこと
