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

var timer = 0;
var kongregate;

// Callback function
function CarregouKong(){
  // Set the global kongregate API object
  kongregate = kongregateAPI.getAPI();
  console.log(kongregate.services.getUsername());
}

function preload () 
{
  // carregar API do KONGREGATE
  kongregateAPI.loadAPI(CarregouKong);
  
  // carregar imagem
  game.load.image("ceu", "fundo.png");
  
  game.load.spritesheet(
    "heroi", "walk_sheet.png", 75, 96);
  
  game.load.atlasXML(
    "atlasSprites", 
    "sprites.png",
    "sprites.xml");
  
  game.load.audio("musica", ["Cartoon_Journey.mp3"]);
}

function create ()
{
  // adicionar fundo
  game.add.sprite(0, 0, "ceu");
  
  game.add.sprite(10, 10, "heroi");
  
  game.add.sprite(150, 10, "atlasSprites");
}

function update ()
{
  if(game.input.keyboard.isDown(Phaser.Keyboard.R))
  {
    console.log("teste");
    timer += game.time.elapsed;
  }
  if(game.input.keyboard.justReleased(Phaser.Keyboard.R, 50))
  {
    kongregate.stats.submit("max-tempo", Math.floor(timer));
    timer = 0;
  }
}
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  