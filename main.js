
import { AUTO } from "phaser";
import { CONFIG } from "./src/config";
import Lab from "./src/scenes/Lab";
import Lab2 from "./src/scenes/Lab2";


const config = {
  with: CONFIG.GAME_WIDTH,
  height: CONFIG.GAME_HEIGHT,
  type: AUTO,
  scene: [Lab],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 0
      },
      debug: true
    }
  },
  pixelArt: true,
  scale: {
    zoom: CONFIG.GAME_SCALE
  }
}


export default new Phaser.Game(config);