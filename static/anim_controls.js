var game = document.querySelector('#game')
var btn = document.querySelector('#power-btn')

game.onanimationend = (e) => {
  turnScreenOn()
  $('#game').removeClass('init')
}
