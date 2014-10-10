// criacao de objeto jogo
var jogo = new Phaser.Game(
   400,
   600,
   Phaser.AUTO,
   'jogo',
   null,
   false,
   false);

var anzolJ1, anzolJ2;

var gravidade = 100;
var velocidadeAnzolY = 200;
var velocidadeAnzolX = 400;
var arrasto = 40;
var velocidadeMaxX = 100;
var velocidadeMaxY = 100;
var velPeixe = 50;
var intervaloPeixePequeno = 1;
var intervaloPeixeMedio = 2;
var intervaloPeixeGrande = 7;
var maxPeixes = 10;

var MenuInicial = function (jogo) {};
MenuInicial.prototype = {
   
   // criando funcao preload
   preload : function () {
      // carregando imagem de fundo
      jogo.load.image('fundo_menu', '../assets/fundo_menu.jpg');
      // outras imagens
      jogo.load.image('fundo_papel', '../assets/fundo_papel.jpg');
      jogo.load.image('J1', '../assets/J1.png');
      jogo.load.image('J2', '../assets/J2.png');
      jogo.load.image('agua', '../assets/agua.png');
      jogo.load.image('anzol_J1', '../assets/anzol_J1.png');
      jogo.load.image('anzol_J2', '../assets/anzol_J2.png');
      jogo.load.image('peixe_pequeno', '../assets/peixe_pequeno.png');
      jogo.load.image('peixe_medio', '../assets/peixe_medio.png');
      jogo.load.image('peixe_grande', '../assets/peixe_grande.png');
   },
   
   // criando funcao create
   create : function () {
      jogo.add.sprite(0, 0, 'fundo_menu');
   },
   
   // criar funcao update
   update : function () {
      
      if (jogo.input.keyboard.justPressed(
            Phaser.Keyboard.SPACEBAR,
            5)) {
         jogo.state.start('Pescaria');
      }
   }
};

var Pescaria = function (jogo) {
   var topoAgua;

};
Pescaria.prototype = {
   
   create : function () {
      // adicionar imagens
      jogo.add.sprite(0, 0, 'fundo_papel');
      var agua1 = jogo.add.sprite(0, 0, 'agua');
      agua1.blendMode = PIXI.blendModes.MULTIPLY;
      
      var imgJ1 = jogo.add.sprite(0, 0, 'J1');
      imgJ1.blendMode = PIXI.blendModes.MULTIPLY;
      var imgJ2 = jogo.add.sprite(0, 0, 'J2');
      imgJ2.blendMode = PIXI.blendModes.MULTIPLY;
      
      var agua2 = jogo.add.sprite(0, 0, 'agua');
      agua2.blendMode = PIXI.blendModes.MULTIPLY;
      
      // definindo anzol
      anzolJ1 = jogo.add.sprite(50, 400, 'anzol_J1');
      anzolJ1.anchor.setTo(0.5, 0.5);
      jogo.physics.enable(anzolJ1, Phaser.Physics.ARCADE);
      anzolJ1.body.setSize(20, 30, 8, 16);
      anzolJ1.body.gravity.setTo(0, gravidade);
      anzolJ1.body.collideWorldBounds = true;
      anzolJ1.body.drag.setTo(arrasto, arrasto);
      anzolJ1.body.maxVelocity.setTo(velocidadeMaxX, velocidadeMaxY);
      
      topoAgua = jogo.add.sprite (0, 230);
      jogo.physics.enable(topoAgua, Phaser.Physics.ARCADE);
      topoAgua.body.setSize(400, 20, 0, 0);
      topoAgua.body.gravity.setTo(0, 0);
      topoAgua.body.immovable = true;
   },
   
   update : function () {
      
      // anzolJ1
      anzolJ1.body.acceleration.setTo(0,0);
      if (jogo.input.keyboard.isDown(Phaser.Keyboard.W)) {
         anzolJ1.body.acceleration.y = -velocidadeAnzolY;
      }
      if (jogo.input.keyboard.isDown(Phaser.Keyboard.S)) {
         anzolJ1.body.acceleration.y = velocidadeAnzolY;
      }
      if (jogo.input.keyboard.isDown(Phaser.Keyboard.D)) {
         anzolJ1.body.acceleration.x = velocidadeAnzolX;
      }
      if (jogo.input.keyboard.isDown(Phaser.Keyboard.A)) {
         anzolJ1.body.acceleration.x = -velocidadeAnzolX;
      }
      
      anzolJ1.body.maxVelocity.y = velocidadeMaxY;
      
      if(jogo.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
        anzolJ1.body.maxVelocity.y = velocidadeMaxY * 4;
        anzolJ1.body.acceleration.y = -velocidadeAnzolY * 4;
      }
      
      // checar colisoes
      jogo.physics.arcade.collide (anzolJ1, topoAgua);
   }
};


// adicionou estado ao jogo
jogo.state.add('MenuInicial', MenuInicial);
jogo.state.add('Pescaria', Pescaria);
jogo.state.start('MenuInicial');












