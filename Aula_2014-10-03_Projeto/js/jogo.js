var jogo = new Phaser.Game(
	320, // largura
	240, // altura
	Phaser.AUTO,
	"elementoJogo");

var setas;

var TelaGameplay = function(jogo) {
	var jogador;
};

TelaGameplay.prototype = {
	preload : function() {
		// carregamento
		jogo.load.spritesheet("imgJogador", "assets/player.png", 16, 16);
	},
	create : function() {
		// inicializacao
		jogador = jogo.add.sprite(60, 60, "imgJogador");
		jogo.physics.enable(jogador, Phaser.Physics.ARCADE);
		jogador.body.gravity.y = 100;
		jogador.body.collideWorldBounds = true;
		jogador.body.drag.x = 400;
		
		setas = jogo.input.keyboard.createCursorKeys();
	},
	update : function() {
		// a cada frame
		if (setas.right.isDown) {
			jogador.body.velocity.x = 100;
		}
		if (setas.left.isDown) {
			jogador.body.velocity.x = -100;
		}
	}
}

jogo.state.add("Gameplay", TelaGameplay);
jogo.state.start("Gameplay");

























