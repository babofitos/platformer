ig.module( 
  'game.entities.coin' 
)
.requires(
  'impact.entity',
  'impact.sound'
)
.defines(function(){
  EntityCoin = ig.Entity.extend({
    size: {x: 8, y: 8},
    animSheet: new ig.AnimationSheet('media/coin.png', 8, 8),
    type: ig.Entity.TYPE.NONE,
    checkAgainst: ig.Entity.TYPE.A,
    gravityFactor: 0,
    init: function(x, y, settings) {
      this.parent(x, y, settings)
      this.addAnim('idle', 0.2, [0,1,2,3,2,1])
    },
    update: function() {
      this.parent()
      if (this.pos.x < 0) {
        this.kill()
      }
    },
    pickup: function() {
      ig.game.score += 10
      this.kill()
    },
    check: function(other) {
      this.pickup()
    }
  })
})