ig.module( 
  'game.shop' 
)
.requires(
  'impact.game',
  'impact.font',
  'plugins.gui'
)
.defines(function(){
ShopScreen = ig.Game.extend({
  font: new ig.Font('media/04b03.font.png'),
  clearColor: 'rgb(153,217,234)', //default canvas color

  init: function() {
    var x = ig.system.width
      , y = ig.system.height/2
      , upgrades = ['doublejump', 'magnet', 'shotgun', 'autoaim', 'range']

    // ig.gui.element.add({
    //   name: 'next',
    //   group: 'shopmenu',
    //   size: {x: 16, y: 16},
    //   pos: {x: x-16-10, y: y},
    //   state: {
    //     normal: {
    //       image: new ig.Image('media/arrow.png')
    //     }
    //   },
    //   click: function() {
    //     console.log('next')
    //   }
    // })
    // ig.gui.element.add({
    //   name: 'prev',
    //   group: 'shopmenu',
    //   size: {x: 16, y: 16},
    //   pos: {x: 10, y: y},
    //   state: {
    //     normal: {
    //       image: new ig.Image('media/arrow2.png')
    //     }
    //   },
    //   click: function() {
    //     console.log('prev')
    //   }
    // })
    //back button
    ig.gui.element.add({
      name: 'Back',
      group: 'shopmenu',
      size: {x: 110, y: 26},
      pos: {x: 10, y: 10},
      state: {
        normal: {
          image: new ig.Image('media/buttons/back-default.png')
        },
        hover: {
          image: new ig.Image('media/buttons/back-hover.png')
        }
      },
      click: function() {
        ig.gui.element.action('hideGroup', 'shopmenu')
        ig.system.setGame(StartScreen)
      }
    })
    //buy button
    ig.gui.element.add({
      name: 'Buy',
      group: 'shopmenu',
      size: {x: 110, y: 26},
      pos: {x: x-110, y: ig.system.height-26},
      state: {
        normal: {
          image: new ig.Image('media/buttons/buy-default.png')
        },
        hover: {
          image: new ig.Image('media/buttons/buy-hover.png')
        }
      },
      click: function() {
        console.log('buy')
      }
    })
    // this.makeUpgradeButtons(upgrades)
  },
  draw: function() {
    this.parent()
    if (ig.gui.show) {
      ig.gui.element.action('hideGroup', 'startmenu')
      ig.gui.element.action('showGroup', 'shopmenu')
      ig.gui.draw()

    }
  },
  makeUpgradeButtons: function(upgrades) {
    var len = upgrades.length

    for (var i=0;i<len;i++) {
      ig.gui.element.add({
        name: upgrades[i],
        group: 'shopmenu',
        size: {x:16, y: 16},
        pos: {x: 10*(i % 6), y: 10*Math.floor(i/6)},
        state: {
          normal: {
            image: new ig.Image('media/' + upgrades[i] + '.png')
          }
        },
        click: function() {
          console.log('bought')
        }
      })
    }
  }
})
})