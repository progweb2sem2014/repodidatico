// criar a variavel game
var game = new Phaser.Game(
  480, 
  320, 
  Phaser.AUTO,
  "div-jogo",
  {
    preload: preload,
    create: create,
    update: update
  });

function preload () 
{
  // carregar imagem
  game.load.image("ceu", "assets/fundo.png");
  
  game.load.spritesheet(
    "heroi", "assets/walk_sheet.png", 75, 96);
  
  game.load.atlasXML(
    "atlasSprites", 
    "assets/sprites.png",
    "assets/sprites.xml");
  
  game.load.tilemap(
    "mapa", 
    "assets/mapa.csv",
    null,
    Phaser.Tilemap.CSV);
  
  game.load.image(
    "tileset", 
    "assets/simples_pimples.png");
  
  game.load.audio("musica", ["assets/Cartoon_Journey.mp3"]);
}

function create ()
{
  // adicionar fundo
  game.add.sprite(0, 0, "ceu");
  
  game.add.sprite(10, 10, "heroi");
  
  game.add.sprite(150, 10, "atlasSprites");
  
  //var mapa = game.add.tilemap("mapa", 30, 20);
  //mapa.addTilesetImage("tileset");
  //mapa.createLayer(0);
  
  var som = game.add.audio("musica");
  som.play();
  
  
}

function update ()
{
}
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  