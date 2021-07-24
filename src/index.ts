import Phaser from 'phaser';
import { Scenes } from './Scenes';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  parent: 'game-app', // game-app内にcanvasを生成
  scene: Scenes,
};

new Phaser.Game(config);
