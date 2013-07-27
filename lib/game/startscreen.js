ig.module( 
  'game.startscreen' 
)
.requires(
  'impact.game',
  'impact.font',
  'plugins.gui'
)
.defines(function(){
StartScreen = ig.Game.extend({
  font: new ig.Font( 'media/04b03.font.png' ),
  clearColor: 'rgb(153,217,234)', //default canvas color

  init: function() {
    var x = ig.system.width/2
      , y = ig.system.height/3

    //play button
    ig.gui.element.add({
      name: 'Play',
      group: 'startmenu',
      size: {x: 110, y: 26},
      pos: {x: x-(110/2), y: y},
      state: {
        normal: {
          image: new ig.Image('media/buttons/play-default.png')
        },
        hover: {
          image: new ig.Image('media/buttons/play-hover.png')
        }
      },
      click: function() {
        ig.system.setGame(MyGame)
      }
    })
    //shop button
    ig.gui.element.add({
      name: 'Shop',
      group: 'startmenu',
      size: {x:110, y:26},
      pos: {x: x-(110/2), y: y+30},
      state: {
        normal: {
          image: new ig.Image('media/buttons/shop-default.png')
        },
        hover: {
          image: new ig.Image('media/buttons/shop-hover.png')
        }
      },
      click: function() {
        ig.system.setGame(ShopScreen)
      }
    })
    //credits button
    ig.gui.element.add({
      name: 'Credits',
      group: 'startmenu',
      size: {x:110, y:26},
      pos: {x: x-(110/2), y: y+60},
      state: {
        normal: {
          image: new ig.Image('media/buttons/credits-default.png')
        },
        hover: {
          image: new ig.Image('media/buttons/credits-hover.png')
        }
      },
      click: function() {
        ig.system.setGame(CreditsScreen)
      }
    })
  },
  update: function() {
    this.parent()
  },
  draw: function() {
    this.parent()
    var x = ig.system.width/2
      , y = ig.system.height - 10

    if (ig.gui.show) ig.gui.draw()
    this.font.draw('JumpMan', x, y-50, ig.Font.ALIGN.CENTER)
    this.font.draw('Jump: Spacebar or W', x, y-40, ig.Font.ALIGN.CENTER)
    this.font.draw('Shoot: E', x, y-30, ig.Font.ALIGN.CENTER)
  }
})
})