export class GameScene extends Phaser.Scene {
  private player?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;

  private score: number = 0;
  private scoreText?: Phaser.GameObjects.Text;

  private gameOver = false;

  constructor() {
    super('world');
  }

  preload() {
    this.load.image('sky', '../assets/sky.png');
    this.load.image('ground', '../assets/platform.png');
    this.load.spritesheet('actor', '../assets/pipo-charachip022.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.image('star', '../assets/star.png');
    this.load.image('bomb', '../assets/bomb.png');
  }

  create() {
    this.add.image(400, 300, 'sky');

    // 静的な物理グループを作成する 特徴は重力や速度を設定できず、何かが衝突しても動かない
    // そのためプレイヤーを走らせる地面やプラットフォームに最適です。
    const platforms = this.physics.add.staticGroup();

    // setScale()で元の画像の幅を2倍にした
    // staticGroup()で静的なグループを作ったためrefreshBody()の呼び出しが必要
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    // プレイヤーの読み込み
    this.player = this.physics.add.sprite(100, 450, 'actor');

    this.player.setBounce(0.2); // 0.2のバウンス値 これはジャンプした後に着地するとわずかに跳ね返ることを表します
    this.player.setCollideWorldBounds(true); // スプライトは世界の境界と衝突するようになるため画面外にプレイヤーが出れなくなる

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('actor', { start: 3, end: 5 }),
      frameRate: 10, // 毎秒10フレームで動く
      repeat: -1, // -1 はループしろという指示
    });

    this.anims.create({
      key: 'turn',
      frames: [{ key: 'actor', frame: 7 }],
      frameRate: 20,
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('actor', { start: 6, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });

    this.cursors = this.input.keyboard.createCursorKeys();

    const starGroup = this.physics.add.group({
      key: 'star',
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 },
      bounceY: 1,
    });

    const bombGroup = this.physics.add.group({
      key: 'bomb',
      repeat: Math.random() * 10,
      setXY: { x: Math.random() * 10, y: Math.random() * 10, stepX: 100 },
      bounceY: 0.9,
    });

    // 二つのオブジェクトを受け取り、衝突をテストする
    // そして分離させる、一回の呼び出しで全てのグループメンバーに対して衝突をテストする
    this.physics.add.collider(this.player, platforms);
    this.physics.add.collider(starGroup, platforms);
    this.physics.add.collider(bombGroup, platforms);

    // スコアを作る
    this.scoreText = this.add.text(16, 16, 'score: 0', {
      fontSize: '32px',
      color: '#000',
    });

    // プレイヤーと星が重なっているかどうかを見る
    // コールバックの引数のplayerを使っていないが、これは衝突の判定で使用しているので入れておかないとエラーで動かなくなる
    this.physics.add.overlap(this.player, starGroup, (player, starGroup) => {
      // 公式のチュートリアルにはdisableBodyが使われているが古いようで現在は使えない
      // destroy()で同様の事ができるようなのでこちらを使う
      starGroup.destroy();

      this.score += 10;
      this.scoreText?.setText(`score: ${this.score}`);

      if (this.score === 120) {
        this.physics.pause();

        this.add
          .text(400, 300, 'Game Clear!!', {
            fontSize: '96px',
            color: 'red',
          })
          .setOrigin(0.5);
      }
    });

    this.physics.add.collider(this.player, bombGroup, () => {
      this.physics.pause();

      this.player?.setTint(0xff0000);

      this.player?.anims.play('turn');

      this.gameOver = true;

      if (this.gameOver) {
        this.add
          .text(400, 300, 'Game Over!!', {
            fontSize: '96px',
            color: 'red',
          })
          .setOrigin(0.5);
      }
    });
  }

  update() {
    const player = this.player;
    if (player == undefined) {
      return;
    }
    const cursors = this.cursors;
    if (cursors == undefined) {
      return;
    }

    if (cursors.left.isDown) {
      player.setVelocityX(-160);
      player.anims.play('left', true);
    } else if (cursors.right.isDown) {
      player.setVelocityX(160);
      player.anims.play('right', true);
    } else {
      player.setVelocityX(0);
      player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down) {
      player.setVelocityY(-330);
    }
  }
}
