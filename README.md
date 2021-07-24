
## 空から落ちてくる星を集めるアクションゲーム


### 概要

Phaser3の公式のチュートリアル
http://phaser.io/tutorials/making-your-first-phaser-3-game/part1

公式の方は JavaScript で書いてありますが、このリポジトリはそれを TypeScript に置き換えて作ったものです。

### ゲームのルール

星を全て集めたらゲームクリアです。
爆弾に当たるとゲームオーバーです。

### 操作方法

 - 左: 左方向に移動
 - 右: 右方向に移動
 - 上: ジャンプ

### プレイ方法

このリポジトリをクローンした後、以下のコマンドで必要パッケージのインストールをしてください。

```

npm install

```

以下のコマンドで起動、もしくはnpm scriptからserveを使って起動してください。

```

webpack-cli serve --mode development

```
