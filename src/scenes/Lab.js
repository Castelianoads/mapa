import { Scene } from "phaser";
import { CONFIG } from "../config";
import Player from "../entites/Player"

export default class Lab extends Scene {
  /**@type {Phaser.Tilemaps.Tilemap} */
  map;

  /**@type {Player} */
  player;

  layers = {};

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
    this.player.setDepth(2)
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

  createLayersManual(){
    // Pegando os tilessers
    const tilesOffice = this.map.getTileset('tiles_office') // Nome no tiles

    // Inserir os layers
    this.map.createLayer('abaixo', [tilesOffice], 0, 0)
    this.map.createLayer('abaixo 1', [tilesOffice], 0, 0)
    this.map.createLayer('abaixo 3', [tilesOffice], 0, 0)
    this.map.createLayer('acima', [tilesOffice], 0, 0)
  }

  createLayers(){
    // Pegando os tilessers
    const tilesOffice = this.map.getTileset('tiles_office') // Nome no tiles

    const layersNames = this.map.getTileLayerNames();
    for (let i = 0; i < layersNames.length; i++) {
      const name = layersNames[i];
      this.layers[name] = this.map.createLayer(name, [tilesOffice], 0, 0)
      // Define a profundidade de cada camada
      this.layers[name].setDepth( i);
      
    }
    console.log(this.layers);
  }

  createCamera(){

    const mapWidth = this.map.width * CONFIG.TILE_SIZE;
    const mapHeight = this.map.height * CONFIG.TILE_SIZE;

    this.cameras.main.setBounds(0, 0, mapWidth, mapHeight)
    this.cameras.main.startFollow(this.player)
  }


}