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

var pontos = 0;
var meuObj = {
      vidas : 100,
      xp : 1000
    };

function preload ()
{
}

function create (
)
{
  // guardando meuItem na armazenagem local
  // localStorage.setItem("meuItem", "0");
  var objSalvo = JSON.parse(localStorage.getItem("objeto"));
  console.log(objSalvo);
}

function update ()
{
  // pontos += game.time.elapsed;
  
  game.input.onDown.add(
    function () 
    {
      // localStorage.setItem("meuItem", pontos + "");
      localStorage.setItem("objeto", JSON.stringify(meuObj));
    },
    this
  );
  
 
}







