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

  textDialago = ""
  telaDialago;

  /** @type {Phaser.Physics.Arcade.Group} */
  groupObjects;
  isTouching = false;

  constructor(){
    super('Lab');
  }

  preload(){
    this.load.tilemapTiledJSON('tilemap-lab-info', 'mapas/sala.json')

    this.load.image('tiles-office', 'mapas/tiles/tiles_office.png')

    this.load.spritesheet('player', 'carlos.png', {
      frameWidth: CONFIG.TILE_SIZE,
      frameHeight: CONFIG.TILE_SIZE * 2
    });

    this.load.spritesheet('Lixeira', 'mapas/tiles/lixeiras_spritesheet.png', {
      frameWidth: CONFIG.TILE_SIZE,
      frameHeight: CONFIG.TILE_SIZE * 2
    });
  }

  create(){
    this.createMap();
    this.createLayers();
    this.createObjects();
    this.createPlayer();
    this.createCamera();
    this.createColliders();
    this.createLixeira();
  }

  update(){
    
  }


  createMap(){
    this.map = this.make.tilemap({
      key: 'tilemap-lab-info',
      tileHeight: CONFIG.TILE_SIZE,
      tileWidth: CONFIG.TILE_SIZE
    })

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
    const tilesOffice = this.map.getTileset('tiles_office') // Nome no tiles
    const layersNames = this.map.getTileLayerNames();

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
    this.groupObjects = this.physics.add.group();

    console.log(this.groupObjects)

    const objects = this.map.createFromObjects("Objeto", "Objeto", "Objeto", "Objeto", {
      name: "Placa", name: "Quadro", name: "Lixeira", name: "Cadeira"
    });

    console.log(objects)
    // Tornando todos os objetos, Sprites com Physics (que possuem body)
    this.physics.world.enable(objects);

    for(let i = 0; i < objects.length; i++){
      //Pegando o objeto atual
      const obj = objects[i];
      //Pegando as informações do Objeto definidas no Tiled
      const prop = this.map.objects[0].objects[i];

      obj.setDepth(this.layers.length + 1);
      obj.setVisible(false);
      obj.prop = this.map.objects[0].objects[i].properties;
      console.log(obj.prop);
      this.groupObjects.add(obj);
     
      console.log(obj);
    }
}

  createPlayer(){
    this.touch = new Touch(this, 16*8, 16*5);
    this.player = new Player(this, 16*8, 16*5, this.touch);
    this.player.setDepth(2);        
  }

  createColliders(){
    const layersNames = this.map.getTileLayerNames();
    for (let i = 0; i < layersNames.length; i++) {
      const name = layersNames[i];
      
      if(name.endsWith('Collision')){
        this.physics.add.collider(this.player, this.layers[name], this.Collided(), null, this)
      }
    }

    this.physics.add.overlap(this.touch, this.groupObjects, this.handleTouch, undefined, this);
  }

  // Associar lixeira de acordo com sua cor
  createLixeira(){
    //const lixeiraAmarela = this.add.sprite(184,48, 'Lixeira', 0) ;
    //const lixeiraAzul = this.add.sprite(200,48, 'Lixeira', 3) ;
  };

  handleTouch(touch, object) {
    if(this.isTouching && this.player.isAction){
      return;
    }

    // Para de tocar
    if (this.isTouching && !this.player.isAction){
      this.isTouching = false;
      return;
    }

    if(this.player.isAction) {
      this.isTouching = true;
      if(object.name == "Quadro"){ // Interação com o quadro
        console.log("Estou tocando no Quadro", object);
      }
      else if(object.name == "Placa"){ // Interação com as placas
        if(object.prop[0].value == "Comida"){
          this.dialago("Proibido comer");
        } else if(object.prop[0].value == "Celular"){
          this.dialago("Proibido celular");
        }
      }
      else if(object.name == "Cadeira"){ // Interação com a cadeira
        console.log("Estou tocando no cadeira", object);
      }
      else if(object.name == "Lixeira"){ // Interação com o lixeira 
        if(object.prop[0].value == "Laranja"){
          this.add.sprite(object.x, 48, 'Lixeira', 2);    
        } else if (object.prop[0].value == "Azul"){
          this.add.sprite(object.x, 48, 'Lixeira', 4);          
        }
      }
    }
  };

  dialago(texto){
    // Crie uma caixa de texto para exibir o conteúdo
    this.telaDialago = this.add.graphics();
    // Obtenha as dimensões da tela
    const width = CONFIG.GAME_WIDTH;
    const height = CONFIG.GAME_HEIGHT;

    // Defina as dimensões da caixa de diálogo
    const boxWidth = width * 0.6;
    const boxHeight = height * 0.1;

    // Calcule a posição da caixa de diálogo
    const boxX = width / 2 - boxWidth / 2;
    const boxY = height / 2 - boxHeight / 2;

    // Crie uma caixa de texto para exibir o conteúdo
    this.telaDialago.fillStyle(0x000000, 0.7);
    this.telaDialago.fillRect(boxX, boxY, boxWidth, boxHeight);

    const textStyle = {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: '#ffffff',
      wordWrap: { width: boxWidth - 20, useAdvancedWrap: true }
    };

    const textX = boxX + 10;
    const textY = boxY + 10;

    this.textDialago = this.add.text(textX, textY, texto, textStyle);

    // Quando mover o player
    this.input.keyboard.on('keydown', (event) => {
      if (event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        this.textDialago.setVisible(false);
        this.telaDialago.setVisible(false);
      }
    });
  };
  
  

  Collided(){
    console.log('Collided');
  };
}