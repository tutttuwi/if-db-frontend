## 動作設計
### システムノード
- タップ
  - システムと連携しているアプリのエッジを活性化表示
- ダブルタップ
  - 対象システムノードのIF一覧がポップアップで表示される
    - 対象IFを選択:IFを利用しているシステム-アプリ、IFが参照しているシステム-アプリが一覧表示される

### アプリノード
- タップ
  - アプリと連携しているアプリのエッジを活性化表示
- ダブルタップ
  - 対象ノードのIF一覧がポップアップで表示される
    - 対象IFを選択:IFを利用しているシステム-アプリ、IFが参照しているシステム-アプリが一覧表示される

### フィルター
- IFでフィルターすると、参照しているシステム一覧が表示される
  - →★各システムへの影響確認ができる
  - →★過去障害情報が確認でき、再発防止につながる
- 業務シナリオでフィルタすると、

### アカウント設定
- 修正したノード位置を記録する:ノード追加された際に挙動問題ないか確認必要
- ログイン画面実装
  - メールアドレス
  - パスワード
    - →追って認証機能追加

### 管理画面
- システム/アプリ追加画面(他社に関する情報も追加しておく)
  - 一覧画面
    - 参照:クリックで詳細画面遷移
    - 削除可能
      - 削除する場合、紐づく情報すべて削除される
      - ※チェックボックスで複数件削除も可能
  - 登録画面
    - 一括登録（指定のJSON定義でUPLOADしてもらえれば一括登録可能）
    - グループ追加
      - グループID
      - 親グループ(parent)
      - グループ名
      - 概要説明
    - システム追加
      - システムID
      - サブシステムID
      - 親グループ(parent)
      - システム名
      - 概要説明
    - アプリ追加
      - アプリID
      - サブアプリID
      - 親システム(parent)
      - アプリタイプ（WEB/API/DB/BATCHなど）
      - 資料（配列[資料名:URL]）
      - 概要説明
- IF管理画面
  - アプリ一覧表示
    - →アプリ選択
      - IF一覧画面
         -IF追加
           -IF追加画面
             - IF ID
             - IF名称
             - IFタイプ (api/db/batch/csv)
             - エンドポイント(apiエンドポイント/ファイル名/テーブル名/SP名)
             - 設計書URL
             - 概要説明
             - 補足説明
         -IF削除
           -参照情報など削除されてしまうが問題ないか?
         -IF更新
- アプリ管理画面
  - アプリ一覧
    →アプリ選択（edge）
       -参照先システム
       -参照先システムIF
       -CRUD
       -概要説明
       -いつ呼び出されるか
       -補足情報

### メモ書き
- いつ実行されるかの情報保持する
  - edgeに保持


### その他

- []edgeの数に応じて、edgeの太さを太くする制御いれる?
- []ノードを移動させたらそのユーザの設定情報に保存しておく
- []リセットボタンでノード位置の初期化にも対応する

- [x] Github初回コミット
- [] panzoom
  - <https://github.com/cytoscape/cytoscape.js-panzoom>
- [x] popper(取り下げ)→普通にmouseover時に要素表示するで良い
  - <https://github.com/cytoscape/cytoscape.js-popper?tab=readme-ov-file#usage-with-popperjs--deprecated->


### 作業メモ

ReactにCytoscape.jsでネットワークグラフを書いてみた
https://zenn.dev/k8shiro/articles/sample-cytoscapejs

https://stackblitz.com/edit/react-cytoscape-example-hiybsx?file=src%2FApp.js
yarn add cytoscape-cola


yarn add react-cytoscapejs
yarn add cytoscape
yarn add @types/react-cytoscapejs