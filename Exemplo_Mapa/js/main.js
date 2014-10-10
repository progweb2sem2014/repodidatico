
var ExemploMapa = ExemploMapa || {};

var pixel = { 
	scale: 2, 
	canvas: null, 
	context: null, 
	width: 0, 
	height: 0 
}

// criacao de objeto jogo
ExemploMapa.game = new Phaser.Game(
   320,
   240,
   Phaser.CANVAS,
   '',
   null,
   false,
   false);

ExemploMapa.game.state.add('Boot', ExemploMapa.Boot);
ExemploMapa.game.state.add('Preload', ExemploMapa.Preload);
ExemploMapa.game.state.add('Game', ExemploMapa.Game);

ExemploMapa.game.state.start('Boot');

