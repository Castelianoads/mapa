import { Scene } from "phaser"
import { CONFIG } from "../config";

// 9-sline

export default class Lab2 extends Scene {
  /** @type {Phaser.Tilemaps.tilemap} */
  map;;
  layers = {};

  /** @type {Phaser.GameObjects.Container} */
  dialog;

  /** @type {Phaser.GameObjects.Text} */
  dialogText;

  /** @type {Phaser.GameObjects.Sprite} */
  dialogNext;

  dialogPositionShow;
  dialogPositionHide;


  constructor(){
    super('Lab2')
  }

  preload(){
    // Carregar dados do mapa
    this.load.tilemapTiledJSON('tilemap-lab-info', 'mapas/sala.json')

    // Carregar os tilessets do map (as imagens)
    this.load.image('tiles-office', 'mapas/tiles/tiles_office.png')

    this.load.atlas('hud', 'hud.png', 'hud.json')

  }

  create(){
    this.createMap();
    this.createLayers();
    this.createDialog();
    this.showDialog("Trabalho de jogos digitais Carlos Eduardo Casteliano de Paula");

  }

  update(){


  }


  createMap(){
    this.map = this.make.tilemap({
      key: 'tilemap-lab-info', // dados JSON
      tileHeight: CONFIG.TILE_SIZE,
      tileWidth: CONFIG.TILE_SIZE
    })
    this.map.addTilesetImage('tiles_office', 'tiles-office')
  }

  createLayers(){
    const tilesOffice = this.map.getTileset('tiles_office') // Nome no tiles
    const layersNames = this.map.getTileLayerNames();
    for (let i = 0; i < layersNames.length; i++) {
      const name = layersNames[i];
      this.layers[name] = this.map.createLayer(name, [tilesOffice], 0, 0)
      this.layers[name].setDepth(i);
    }
  }

  createDialog(){
    this.dialog = this.add.container(0, 0).setDepth(10);

    const tileSize = CONFIG.TILE_SIZE
    const largura = CONFIG.GAME_WIDTH - (2 * tileSize);
    const altura = 4 * tileSize;

    this.dialogPositionShow = CONFIG.GAME_HEIGHT - altura - tileSize * 2;
    this.dialogPositionHide = CONFIG.GAME_HEIGHT + tileSize;

    this.dialog.add(
      [
        this.add.image(0, 0, 'hud', 'dialog_topleft'),
        this.add.image(16, 0, 'hud', 'dialog_top').setDisplaySize(largura, tileSize),
        this.add.image(largura + tileSize, 0, 'hud', 'dialog_topright'),
        

        this.add.image(0, 16, 'hud', 'dialog_left').setDisplaySize(tileSize, altura),
        this.add.image(16, 16, 'hud', 'dialog_center').setDisplaySize(largura, altura),
        this.add.image(largura + tileSize, 16, 'hud', 'dialog_right').setDisplaySize(tileSize, altura),

        this.add.image(0, altura + tileSize, 'hud', 'dialog_bottomleft'),
        this.add.image(16, altura + tileSize, 'hud', 'dialog_bottom').setDisplaySize(largura, tileSize),
        this.add.image(largura + tileSize, altura + tileSize, 'hud', 'dialog_bottomright'),
      ]
    )
    
      this.dialog.setPosition(0, this.dialogPositionHide)

      const style = {
        fontFamily : 'Verdana',
        fontSize: 12,
        color: '#6b5052',
        maxLines: 3,
        wordWrap : { width: largura }
      }

      this.dialogText = this.add.text(tileSize, tileSize, "Helo word", style)
      this.dialog.add(this.dialogText)
  }

  showDialog(text){
    this.dialogText.text = ''
    
    // Verifica se esta fora da tela
    if(this.dialog.y > this.dialogPositionShow){
      this.add.tween({
        targets: this.dialog,
        duration: 400,
        y: this.dialogPositionShow,
        ease: Phaser.Math.Easing.Back.Out,
        onComplete: () => {
          this.showText(text)
        }
      });
    } else {
      this.showText(text)
    }


  }

  showText(text){
    let i = 0;

    this.time.addEvent({
      repeat: text.length - 1,
      delay: 25,
      callback: () => {
        this.dialogText.text += text[i++]
      }
    })
  }

}