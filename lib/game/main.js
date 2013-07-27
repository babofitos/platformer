ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',
	'impact.collision-map',
	'impact.background-map',
	'game.entities.player',
	'game.entities.coin',
	'game.entities.bee',
	'plugins.gui',
	'game.shop',
	'game.startscreen',
	'game.gameover',
	'game.credits'
)
.defines(function(){

// The Backdrop image for the game, subclassed from ig.Image
// because it needs to be drawn in it's natural, unscaled size, 

MyGame = ig.Game.extend({
	
	// Load a font
	font: new ig.Font( 'media/04b03.font.png' ),
	gravity:260,
	map: [],
	cameraSpeed: 10,
	tiles: new ig.Image('media/tiles.png'),
	backdrop: new ig.Image('media/background.png'),
	currPlatLevel: null,
	gap: 2,
	platFinished: true,
	platRemaining: 0,
	mapLen: 0,
	gapFinished: true,
	score: 0,
	timePassed: new ig.Timer(),
	highScore: 0,
	gold: 0,
	minPlatformHeight: this.mapLen/2,
	minGap: 4,
	minPlatformLen: 5,
	maxPlatformLen: 9,
	maxJump: 7,
	hasCoins: false,
	coinRows: 0,
	clearColor: 'rgb(153,217,234)', //default canvas color
	
	init: function() {
		// Initialize your game here; bind keys etc.
		ig.input.bind(ig.KEY.SPACE, 'jump')
		ig.input.bind(ig.KEY.W, 'jump')
		ig.input.bind(ig.KEY.E, 'shoot')
		ig.input.bind(ig.KEY.MOUSE1, 'jump') //for touch

		//reset game timer on deaths
		this.timePassed.reset()
		//update any high scores obtained
		this.highScore = localStorage.score ? localStorage.score : 0
		//set gold amount from previous plays
		this.gold = localStorage.gold ? localStorage.gold : 0

		//the first part of the map is always the same
		//each tile is 8px. 320/8 = 40 tiles per row
		//40 elements in each row.
		this.map = this.createMap(ig.system.width, ig.system.height, this.tiles.width)
		//set currPlatLevel
		this.currPlatLevel = 23
		//set mapLen
		this.mapLen = this.map.length

		this.collisionMap = new ig.CollisionMap( 8, this.map );

	  var bgmap = new ig.BackgroundMap( 8, this.map, this.tiles );
    // Add the bgmap to the Game's array of BackgroundMaps
    // so it will be automatically drawn by .draw()
    this.backgroundMaps.push( bgmap );
    ig.game.spawnEntity(EntityPlayer, 10, 10)
	},
	createMap: function(width, height, tileW) {
	  var map = []
	  for (var row=0;row<height/tileW;row++) {
	  	var el = []
	  	for (var col=0;col<width/tileW;col++) {
	  		if (row == 23) {
	  			map[row] = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0]
	  			break
	  		} else {
	  			el.push(0)
	  		}
	  		map[row] = el
	  	}
	  }
	  return map
	},
	update: function() {

		this.parent()
		//score
		this.score += ig.system.tick * this.timePassed.delta()
		
  	var player = this.getEntitiesByType(EntityPlayer)[0]
  		, mapLen = this.mapLen
  		, map = this.map
  		, minGap = this.minGap
  		, minPlatformLen = this.minPlatformLen
  		, maxPlatformLen = this.maxPlatformLen
  		, maxJump = this.maxJump
  		, minPlatformHeight = this.minPlatformHeight
  	
  	//player is dead, game over
  	if (!player) {
			return
		}

  	//camera
  	//padding of 20 from left
  		this.screen.x = player.pos.x - 20
  	//wait else char will fall through world
  	if (player.pos.x > 25) {
  		//without this it is very choppy
	  	this.screen.x -= 8
	  	// without this entities go blazing fast
		  for( var i =0; i < this.entities.length; i++ ) {
	      this.entities[i].pos.x -= 8
	    }

	    //tile generation

	    //on first run this triggers
			//if platform finished and gaps are made init all variables
	  	if (this.platFinished && this.gapFinished) {

		  	var currPlatLevel = this.choosePlatformRow(minPlatformHeight, mapLen)
		  		//make platform atleast minplatformlen but at most maxplatformlen
					, platLength = minPlatformLen + Math.floor(Math.random()*(maxPlatformLen-minPlatformLen)+1)
					//set gap length between platforms
					, gap = minGap + Math.floor(Math.random()*(maxJump-minGap+1))


				//saved for next few cycles to access
				this.currPlatLevel = currPlatLevel
				this.gap = gap

				//does platform have coins?
				if (Math.random() > 0.5) {
					this.hasCoins = true
					//how many rows of coins?
					this.coinRows = 1 + Math.floor(Math.random() * 2)
					this.createPlatforms(map, currPlatLevel, mapLen, true, this.coinRows)
				} else {
					this.hasCoins = false
					this.coinRows = 0
					this.createPlatforms(map, currPlatLevel, mapLen, false, 0)
				}
				
				//make mob?
				if (Math.random() > 0.3) {
					this.makeMob(map, currPlatLevel)
				}

				//counter for how long we stay on current plat length generation
				//minus one since we already made one in createPlatforms()
				this.platRemaining = platLength-1

				this.platFinished = false
				
				//make platforms on same currPlatLevel until platRemaining is 0
			} else if (!this.platFinished) {
				this.createPlatforms(map, this.currPlatLevel, mapLen, this.hasCoins, this.coinRows)

				this.platRemaining--
				if (this.platRemaining == 0) {
					this.platFinished = true
					this.gapFinished = false
				}
				//if platforms are finished start making gaps
			} else {
				this.makeGaps(map, mapLen)

				this.gap--
				if (this.gap == 0) {
					this.gapFinished = true
				}
			}
		}
	},
	makeCoin: function(map, platRow, coinRows) {
	  //make coin at right edge of screen on top of platform
	  var x = ig.system.width-7
	  	, y

	  //iterate by number of rows
	  for (var i=0;i<coinRows;i++) {
	  	//make one above platform height
	  	y = (platRow-1-i) * 8
	  	this.spawnEntity(EntityCoin, x, y)
	  }
	},
	makeMob: function(map, platRow) {
	  var x = ig.system.width
	  	, y = ((platRow-2) * 8) - 4
	  	//randomize max velocity
	  	, maxVelX = 10 + Math.floor(Math.random() * 60)
	  this.spawnEntity(EntityBee, x, y, {maxVelX: maxVelX})
	},
	makeGaps: function(map, mapLen) {
	  for (var i=0;i<mapLen;i++) {
	  	map[i].shift()
	  	map[i].push(0)
	  }
	},
	choosePlatformRow: function(min, max) {
		//make next platform -1, 0, or +1 current platform height
		//make min and max limits
	  var currPlatLevel = this.currPlatLevel + (Math.floor(Math.random()*3) - 1)
	  //if next platform is greater than max possible, make max
  	if (currPlatLevel >= max) {
  		currPlatLevel = max-1
  	//if lower than min possible, set min
  	} else if (currPlatLevel <= min) {
  		currPlatLevel = min
  	}
	  return currPlatLevel
	},
	createPlatforms: function(map, level, limit, hasCoins, coinRows) {
		//0 means no tile
		//1 means tile
		//shift and push every row down to platform row
		for (var row=0;row<level;row++) {
			map[row].shift()
			map[row].push(0)
		}

		//take out old tiles on platform row, generate platforms
		map[level].shift()
		map[level].push(1)

		//make coins
		if (hasCoins) {
			this.makeCoin(map, level, coinRows)
		}
		
		//iterate over remaining rows
		for (var remainRow=level+1;remainRow<limit;remainRow++) {
			map[remainRow].shift()
			map[remainRow].push(0)
		}
	},
	draw: function() {
		this.parent()
    //score
    var score = this.score.floor().toString()
    this.font.draw('Score: ' + score, 10, 10, ig.Font.ALIGN.LEFT)
    this.font.draw('High Score: ' + this.highScore, ig.system.width-10, 10, ig.Font.ALIGN.RIGHT)
	},
	gameOver: function() {
		//calculate gold
		this.gold = Math.floor(this.score/100)

		//assign score, gold to ig class so that gameoverscreen can access
	  ig.finalScore = this.score
	  ig.gold = this.gold
	  ig.system.setGame(GameOverScreen)
	}
});

// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main( '#canvas', StartScreen, 60, 320, 240, 3 );

});
