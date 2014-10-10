var ExemploMapa = ExemploMapa || {};

ExemploMapa.Boot = function(){};

//setting game configuration and loading the assets for the loading screen
ExemploMapa.Boot.prototype = {
	init : function() {
		//localStorage.setItem('teste', 'bob'+ this.game.time.now);
		
		//  Hide the un-scaled game canvas
    this.game.canvas.style['display'] = 'none';
 
    //  Create our scaled canvas. It will be the size of the game * whatever scale value you've set
    pixel.canvas = Phaser.Canvas.create(this.game.width * pixel.scale, this.game.height * pixel.scale);
 
    //  Store a reference to the Canvas Context
    pixel.context = pixel.canvas.getContext('2d');
 
    //  Add the scaled canvas to the DOM
    Phaser.Canvas.addToDOM(pixel.canvas);
 
    //  Disable smoothing on the scaled canvas
    Phaser.Canvas.setSmoothingEnabled(pixel.context, false);
 
    //  Cache the width/height to avoid looking it up every render
    pixel.width = pixel.canvas.width;
    pixel.height = pixel.canvas.height;
	},
  preload: function() {
    //assets we'll use in the loading screen
    this.load.image('preloadbar', 'assets/BarraPreloader.png');
  },
  create: function() {
	  
	  
	  
    //loading screen will have a white background
    this.game.stage.backgroundColor = '#fff';

    //scaling options
    //this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    
    //have the game centered horizontally
    //this.scale.pageAlignHorizontally = true;
    //this.scale.pageAlignVertically = true;

    //screen size will be set automatically
    //this.scale.setScreenSize(true);

    //physics system
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    
    this.state.start('Preload');
  }
};