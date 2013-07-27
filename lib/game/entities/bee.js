ig.module( 
  'game.entities.bee' 
)
.requires(
  'impact.entity',
  'impact.sound'
)
.defines(function(){
  EntityBee = ig.Entity.extend({
    animSheet: new ig.AnimationSheet('media/bee.png', 11, 12),
    size: {x: 11, y:12},
    offset: {x: 0, y: 0},
    startPosition: null,
    maxVel: {x:60, y:150},
    friction: {x:600, y:0},
    bounciness: 0,
    speed: 300,
    accelGround: 900,
    accelAir: 600,
    jump: 90,
    health:10,
    gravityFactor: 0,
    type: ig.Entity.TYPE.B,
    checkAgainst: ig.Entity.TYPE.A,
    collides: ig.Entity.COLLIDES.PASSIVE,

    init: function(x, y, settings) {
      this.parent(x, y, settings)
      this.addAnim('fly', 0.07, [0,1,2])
      this.accel.x = -100
      this.maxVel.x = settings.maxVelX
    },
    update: function() {
      this.parent()
      if (this.pos.x < 0) {
        this.kill()
      }
    },
    check: function(other) {
      other.receiveDamage(10, this)
    }
  })
});
