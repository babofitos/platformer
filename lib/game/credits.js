ig.module( 
  'game.credits' 
)
.requires(
  'impact.game',
  'impact.font',
  'plugins.gui'
)
.defines(function(){
CreditsScreen = ig.Game.extend({
  clearColor: 'rgb(153,217,234)', //default canvas color
  font: new ig.Font( 'media/04b03.font.png' ),
  init: function() {
  }
})
})