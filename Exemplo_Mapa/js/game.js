var ExemploMapa = ExemploMapa || {};

//title screen
ExemploMapa.Game = function(){};

ExemploMapa.Game.prototype = {
	create: function() {
		this.map = this.game.add.tilemap('level1');

		//the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
		this.map.addTilesetImage('simples_pimples', 'tiles');

		//create layer
		this.lyrFundo = this.map.createLayer('Fundo');
		this.lyrColisao = this.map.createLayer('Colisao');
		this.lyrDetalhes = this.map.createLayer('Detalhes');

		//collision on blockedLayer
		this.map.setCollisionBetween(0, 100000, true, 'Colisao', true);

		//resizes the game world to match the layer dimensions
		this.lyrColisao.resizeWorld();
		
		
		this.player = this.add.sprite(16, 200, 'player');
		this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
		this.player.body.collideWorldBounds = true;
		this.player.body.gravity.y = 1000;
		this.player.body.maxVelocity.x = 100;
		this.player.body.maxVelocity.y = 400;
		this.player.anchor.setTo(0.5, 0.5);
		this.player.body.drag.x = 400;
		
		this.player.animations.add('parada', [0], 6, true);
		this.player.animations.add('andando', [1, 2], 9, true);
		this.player.animations.add('pulando', [1], 3, true);
		this.player.animations.play('andando');
		
		this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_PLATFORMER);
		this.cursors = this.game.input.keyboard.createCursorKeys();
    	this.btnPulo = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
		this.facing = 'left';
		this.timerPulo = 10;
	},
	update : function() {
		this.game.physics.arcade.collide(this.player, this.lyrColisao);
		this.player.body.acceleration.x = 0;
		
		if (this.cursors.left.justPressed(5) || this.cursors.right.justPressed(5)) {
			this.player.body.velocity.x = 0;
		}
		
		if (this.cursors.left.isDown) {
			this.player.body.acceleration.x = -400;
			this.player.scale.x = -1;
		}
		if (this.cursors.right.isDown) {
			this.player.body.acceleration.x = 400;
			this.player.scale.x = 1;
		}

		if (this.player.body.velocity.x > 0) {
			this.player.animations.play('andando');
		}
		else if (this.player.body.velocity.x < 0) {
			this.player.animations.play('andando');
		}
		else {
			this.player.animations.play('parada');
		}

		if (this.player.body.velocity.y != 0) {
			this.player.animations.play('pulando');
		}

		if (this.btnPulo.isDown && this.player.body.onFloor() && this.timerPulo > 0 /*&& this.game.time.now > this.timerPulo*/) {
			this.player.body.velocity.y = -400;
			/*his.timerPulo = this.game.time.now + 750;*/
			this.timerPulo = 0;
		}
		
		if (this.btnPulo.justReleased(50)) {
			this.timerPulo = 100;
		}
		
	},
	render : function() {
		//  Every loop we need to render the un-scaled game canvas to the displayed scaled canvas:
		pixel.context.drawImage(
			this.game.canvas, 0, 0, 
			this.game.width, this.game.height, 0, 0, 
			pixel.width, pixel.height);
	}
}