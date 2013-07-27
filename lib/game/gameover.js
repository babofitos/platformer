ig.module( 
  'game.gameover' 
)
.requires(
  'impact.game',
  'impact.font',
  'plugins.gui'
)
.defines(function(){
GameOverScreen = ig.Game.extend({
  clearColor: 'rgb(153,217,234)', //default canvas color
  font: new ig.Font( 'media/04b03.font.png' ),
  finalScore: 0,
  newHighScore: false,
  gold: 0,
  calcGold: true,
  then: Date.now(),
  beforeGold: 0, //gold that player had before current game to be used in transfer effect

  init: function() {
    this.finalScore = Math.floor(ig.finalScore)
    //gold earned?
    this.gold = ig.gold
    //high score beaten
    if (localStorage.score && (this.finalScore > localStorage.score)) {
      localStorage.score = this.finalScore
      this.newHighScore = true
    //first time playing
    } else if (!localStorage.score) {
      localStorage.score = this.finalScore
      this.newHighScore = true
    }

    //if localstorage gold exists, add. else set new
    if (localStorage.gold) {
      //we need the old value to count up to the real total value in draw()
      this.beforeGold = +localStorage.gold

      localStorage.gold = parseInt(localStorage.gold, 10) + parseInt(this.gold, 10)
    } else {
      localStorage.gold = this.gold
    }
  },
  update: function() {
    if (ig.input.pressed('jump')) {
      ig.system.setGame(MyGame)
    }
    this.parent()

    //count up on total gold amnt
    if (this.calcGold && this.gold > 0) {
      this.then = this.countGold(this.then)
    }
  },
  draw: function() {
    this.parent()
    var x = ig.system.width/2
      , y = ig.system.height/2

    this.font.draw('Game Over!', x, y, ig.Font.ALIGN.CENTER)
    this.font.draw('Score: ' + this.finalScore, x, y+10, ig.Font.ALIGN.CENTER)
    if (this.newHighScore) {      
      this.font.draw('NEW HIGH SCORE!', x, y+20, ig.Font.ALIGN.CENTER)
    }
    
    this.font.draw('Gold Earned this run: ' + ig.gold, x, y+30, ig.Font.ALIGN.CENTER)
    this.font.draw('Total Gold: ' + this.beforeGold, x, y+40, ig.Font.ALIGN.CENTER)

    //if counter is finished
    if (this.gold === 0) {
      this.font.draw('Press Space or W to play again', x, y+50, ig.Font.ALIGN.CENTER)
    }
  },
  countGold: function(then) {
    var then = then
      , now = Date.now()

    //for delay, otherwise counts too fast
    if (now-60 > then) {
      then = now
      //on each update loop
      this.gold--
      this.beforeGold++
      if (this.gold == 0) {
        this.calcGold = true
      }
    }
    return then
  }
})
})