import { Scene } from "phaser";
import { CONFIG } from "../config";
import Player from "../entites/Player"
import Touch from "../entites/Touch"

export default class Lab extends Scene {
  /**@type {Phaser.Tilemaps.Tilemap} */
  map;

  /**@type {Player} */
  player;
  playerCollision = [];
  touch;
  layers = {};

  /** @type {Phaser.Physics.Arcade.Group} */
  groupObjects;
  isTouching = false;

  constructor(){
    super('Lab');
  }

  preload(){
    // Carregar dados do mapa
    this.load.tilemapTiledJSON('tilemap-lab-info', 'mapas/sala.json')

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
    this.createObjects();
    this.createPlayer()
    this.createCamera()
    this.createColliders()
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

    //console.log(this.tilesOffice.getTileAt());

    // const prop = tilesOffice.getTileProperties(0)
    // if (prop.hasOwnProperty('name')) {
    //   const propValue = properties['name'];
    //   console.log(propValue); // Exibe o valor da propriedade
    // }

    for (let i = 0; i < layersNames.length; i++) {
      const name = layersNames[i];
      this.layers[name] = this.map.createLayer(name, [tilesOffice], 0, 0)
      // Define a profundidade de cada camada
      this.layers[name].setDepth(i);

      console.log(this.layers);

      // Verifica se o layer possui colisao
      if(name.endsWith('Collision')){
        this.layers[name].setCollisionByProperty({ collide: true })

        // Adiciona a função de callback para cada tile colidível
        this.layers[name].setTileIndexCallback(0, this, (sprite, tile) => {
            //console.log(`Collided with ${tile.properties.object}, ${sprite}`);
          }
        );

        // Mostrar em amarelo os objetos que pode colidir
        if ( CONFIG.DEBUG_COLLISION ) {
          const debugGraphics = this.add.graphics().setAlpha(0.75).setDepth(i);
          this.layers[name].renderDebug(debugGraphics, {
            tileColor: null, // Color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
          });
        }
      }
      
    }
  }

  createCamera(){
    const mapWidth = this.map.width * CONFIG.TILE_SIZE;
    const mapHeight = this.map.height * CONFIG.TILE_SIZE;

    this.cameras.main.setBounds(0, 0, mapWidth, mapHeight)
    this.cameras.main.startFollow(this.player)
  }

  createObjects() {
    // Criar um grupo para os objetos
    this.groupObjects = this.physics.add.group();

    console.log(this.groupObjects)

    const objects = this.map.createFromObjects("Objeto", {
        name: "Placa"

    });

    console.log(objects)
    // Tornando todos os objetos, Sprites com Physics (que possuem body)
    this.physics.world.enable(objects);

    for(let i = 0; i < objects.length; i++){
        //Pegando o objeto atual
        const obj = objects[i];
        //Pegando as informações do Objeto definidas no Tiled
        const prop = this.map.objects[0].objects[i];
        console.log(prop)


        obj.setDepth(this.layers.length + 1);
        obj.setVisible(false);

        this.groupObjects.add(obj);

        console.log(obj);
    }
}

  createPlayer(){
    this.touch = new Touch(this, 16*8, 16*5)
    this.player = new Player(this, 16*8, 16*5, this.touch)
    this.player.setDepth(2)    
  }

  createColliders(){
    // Diferença COLIDER x OVERLAP
    // COLLIDER: colide e impede a passagem
    // Overlap: detecta a sobreposição dos elementos, não impede a passagem

    // Criando colisão entre o player e as camadas de colisão do Tiled
    const layersNames = this.map.getTileLayerNames();
    for (let i = 0; i < layersNames.length; i++) {
      const name = layersNames[i];
      
      if(name.endsWith('Collision')){
        this.physics.add.collider(this.player, this.layers[name], this.Collided(), null, this)
      }
    }

    //Criar colisão entre a "Maozinha" do Player e os objetos da camada de objetos da camada de Objetos
    // Chama a função this.handleTouch toda vez que o this.touch entrar em contato com um objeto do this.groupObjects
    this.physics.add.overlap(this.touch, this.groupObjects, this.handleTouch, undefined, this);
  }

  handleTouch(touch, object) {
    if(this.isTouching && this.player.isAction){
      return;
    }

    if (this.isTouching && !this.player.isAction){
      this.isTouching = false;
      return;
    }

    if(this.player.isAction) {
      this.isTouching = true;
      console.log("Estou tocando");
    }
  }

  Collided(){
    console.log('Collided');
  }
}