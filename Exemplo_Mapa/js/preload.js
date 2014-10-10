var ExemploMapa = ExemploMapa || {};

//loading the game assets
ExemploMapa.Preload = function(){};

ExemploMapa.Preload.prototype = {
	preload: function() {
		//show loading screen
		this.preloadBar = this.add.sprite(
			this.game.world.centerX, 
			this.game.world.centerY, 
			'preloadbar');
		this.preloadBar.anchor.setTo(0.5);
		this.load.setPreloadSprite(this.preloadBar);

		//load game assets
		this.load.tilemap('level1', 'assets/Level1.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.image('tiles', 'assets/simples_pimples.png');
		this.load.spritesheet('player', 'assets/player.png', 16, 16);

	},
	create: function() {
		this.state.start('Game');
	},
	loadRender : function() {
		//  Every loop we need to render the un-scaled game canvas to the displayed scaled canvas:
		pixel.context.drawImage(
			this.game.canvas, 0, 0, 
			this.game.width, this.game.height, 0, 0, 
			pixel.width, pixel.height);
	}
};