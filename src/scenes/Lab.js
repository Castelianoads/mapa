import { Scene } from "phaser";
import { CONFIG } from "../config";
import Player from "../entites/Player"

export default class Lab extends Scene {
  /**@type {Phaser.Tilemaps.Tilemap} */
  map;
  layers;

  /**@type {Player} */
  player

  constructor(){
    super('Lab');
  }

  preload(){
    // Carregar dados do mapa
    this.load.tilemapTiledJSON('tilemap-lab-info', 'mapas/lab_info.json')

    // Carregar os tilessets do map (as imagens)
    this.load.image('tiles-office', 'mapas/tiles/tiles_office.png')

    // Importando um spritesheet
    this.load.spritesheet('player', 'carlos.png', {
      frameWidth: CONFIG.TILE_SIZE,
      frameHeight: CONFIG.TILE_SIZE * 2
    })
  }

  create(){
    this.createMap()
    this.createLayers()
    
    this.player = new Player(this, 100, 90)

    this.createCamera()

  }

  update(){

  }


  createMap(){
    this.map = this.make.tilemap({
      key: 'tilemap-lab-info', // dados JSON
      tileHeight: CONFIG.TILE_SIZE,
      tileWidth: CONFIG.TILE_SIZE
    })

    // Fazendo a correspondencia entre as imagens usadas no TIled
    // e as carregadas pelo Phaser
    // addTilesetImage(nome da imagem no TIled, nome da imagem carregada no Phaser)
    this.map.addTilesetImage('tiles_office', 'tiles-office')
  }

  createLayers(){
    // Pegando os tilessers
    const tilesOffice = this.map.getTileset('tiles_office') // Nome no tiles

    // Inserir os layers
    this.map.createLayer('abaixo', [tilesOffice], 0, 0)
    this.map.createLayer('abaixo 1', [tilesOffice], 0, 0)
    this.map.createLayer('abaixo 3', [tilesOffice], 0, 0)
    this.map.createLayer('acima', [tilesOffice], 0, 0)

    
  }

  createCamera(){

    const mapWidth = this.map.width * CONFIG.TILE_SIZE;
    const mapHeight = this.map.height * CONFIG.TILE_SIZE;

    this.cameras.main.setBounds(0, 0, mapWidth, mapHeight)
    this.cameras.main.startFollow(this.player)
  }


}