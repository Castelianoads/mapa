import { Scene } from "phaser";
import { CONFIG } from "../config";

export default class Lab extends Scene {
  /**@type {Phaser.Tilemaps.Tilemap} */
  map;
  layers;

  constructor(){
    super('Lab');
  }

  preload(){
    // Carregar dados do mapa
    this.load.tilemapTiledJSON('tilemap-lab-info', 'mapas/lab_info.json')

    // Carregar os tilessets do map (as imagens)
    this.load.image('tiles-office', 'mapas/tiles/tiles_office.png')
  }

  create(){
    this.createMap()
    this.createLayers()
    


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

}