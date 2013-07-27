ig.module( 
  'game.entities.player' 
)
.requires(
  'impact.entity',
  'impact.sound'
)
.defines(function(){
  EntityPlayer = ig.Entity.extend({
    animSheet: new ig.AnimationSheet( 'media/player.png', 16, 16 ),
    size: {x: 8, y:14},
    offset: {x: 4, y: 2},
    type: ig.Entity.TYPE.A,
    collides: ig.Entity.COLLIDES.PASSIVE,
    startPosition: null,
    health: 10,
    maxVel: {x:100, y:150},
    friction: {x:600, y:0},
    bounciness: 0,
    speed: 300,
    accelGround: 900,
    accelAir: 600,
    jump: 90,
    bound: 100, //this limits how close mobs have to be for auto-aim to kick in
    autoaim: true,
    jumpSFX: new ig.Sound( 'media/sounds/jump.*' ),

    init: function(x, y, settings) {
      this.parent(x, y, settings)
      this.startPosition = {x:x, y:y}
      this.addAnim('idle', 1, [0])
      this.addAnim('run', 0.07, [0,1,2,3,4,5])
      this.addAnim('jump', 1, [9]);
      this.addAnim('fall', 0.4, [6,7]);
      this.accel.x = 100
    },
    update: function() {
      //gameover if char falls off screen
      if (this.pos.y > ig.system.height) {
        this.kill()
      }
      // var accel = this.standing ? this.accelGround : this.accelAir

      // this.accel.x += .01
      // this.accel.x = accel

      //jump
      if (this.standing && ig.input.pressed('jump')) {
        this.vel.y = -this.jump
        this.jumpSFX.play()
      }
      
      //calculate angle from hero to nearby monsters, default to 0 if none are near
      var angle = this.autoaim ? this.autoAim() : 0

      //shoot
      if (ig.input.pressed('shoot')) {
        ig.game.spawnEntity(EntityBullet, this.pos.x, this.pos.y, {angle: angle})
      }

      //set up animations based on speed
      if( this.vel.y < 0 ) {
        this.currentAnim = this.anims.jump;
      }else if( this.vel.y > 0 ) {
        this.currentAnim = this.anims.fall;
      } else {
        this.currentAnim = this.anims.run
      }
      this.parent()
    },
    kill: function() {
      this.parent()
      ig.game.gameOver()
    },
    autoAim: function() {
      var bound = this.bound
        //find nearest bee only
        , bee = ig.game.getEntitiesByType(EntityBee)[0]
        , beeX
        , beeY
        , dX
        , dY
        , angle = 0 //in radians

      if (bee && this.distanceTo(bee) <= bound) {
        beeX = bee.pos.x
        beeY = bee.pos.y
        dX = bee.pos.x - this.pos.x
        dY = bee.pos.y - this.pos.y
        angle = Math.atan2(dY, dX)

        //dont let bullet shoot behind player
        if (angle > Math.PI/2 || angle < (-1 * Math.PI)/2) {
          angle = 0
        }
      }
      return angle
    }
  })

  EntityBullet = ig.Entity.extend({
    size: {x: 5, y: 5},
    offset: {x:0, y:-1},
    animSheet: new ig.AnimationSheet( 'media/bullet.png', 5, 3 ),
    type: ig.Entity.TYPE.NONE,
    checkAgainst: ig.Entity.TYPE.B,
    collides: ig.Entity.COLLIDES.PASSIVE,
    defaultVel: 200,
    init: function( x, y, settings ) {
        this.parent(x+8, y+7, settings)
        var velx = Math.cos(settings.angle) * this.defaultVel
          , vely = Math.sin(settings.angle) * this.defaultVel

        this.maxVel.x = this.accel.x = this.vel.x = velx
        this.maxVel.y = this.accel.y = this.vel.y = vely
        this.addAnim( 'idle', 0.2, [0] )
    },
    handleMovementTrace: function( res ) {
        this.parent(res);
        if (res.collision.x || res.collision.y) {
            this.kill()
        }
    },
    check: function(other) {
        other.receiveDamage(10, this)
        ig.game.score += 10
        this.kill()
    },
    update: function() {
      this.parent()
      if (this.pos.x > ig.system.width/2 - 70) {
        this.kill()
      }
    }
  })
});
