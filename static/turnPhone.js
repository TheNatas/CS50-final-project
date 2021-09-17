// Press & hold functionality by kirupa
// See https://www.kirupa.com/html5/press_and_hold.htm
// for reference.
// Adaptations were made for specifications of the project.

let timerID
let counter = 0

let pressHoldEvent = new CustomEvent("pressHold")

// Increase or decrease value to adjust how long
// one should keep pressing down before the pressHold
// event fires
let pressHoldDuration = 50

// Listening for the mouse and touch events
btn.addEventListener("mousedown", pressingDown, false)
btn.addEventListener("mouseup", notPressingDown, false)
btn.addEventListener("mouseleave", notPressingDown, false)

btn.addEventListener("touchstart", pressingDown, false)
btn.addEventListener("touchend", notPressingDown, false)

// Listening for our custom pressHold event
btn.addEventListener("pressHold", turnPhone, false)

function pressingDown(e) {
  // Start the timer
  requestAnimationFrame(timer);

}

function notPressingDown(e) {

  if (!$('#game').hasClass('init')){
    if (counter < pressHoldDuration && e.type != 'mouseleave'){
      // If phone isn't initializing and the
      // press didn't trigger a state change,
      turnScreen()
    }
  }

  // Stop the timer
  cancelAnimationFrame(timerID)
  counter = 0;

}

function timer() {

  if (counter < pressHoldDuration) {
    timerID = requestAnimationFrame(timer);
    counter++;

  } else {
    if (!$('#game').hasClass('init')){
      // If not already initializing,
      btn.dispatchEvent(pressHoldEvent);
    }
  }
}

function turnPhone(){
  var request = $.ajax({
    url: '/state',
    dataType: 'text',
  })

  request.done(function(phoneState){

    if (phoneState == 'on'){
      turnOffMenu()
    }else{
      turnPhoneOn()
    }

  })
}

function turnPhoneOn(){
  var request = $.ajax({
    url: 'static/screens/init/init.html',
    dataType: 'html'
  })

  request.done(function(html){

    $('#game').html(html)
    $('.dev').slideUp(1)

    $('#game').addClass('init')
    $('.dev').delay(4000).toggle(1000)

    tellServer('state', 'on')
  })

}

function turnOffMenu(){



  $('#turnOffMenu').slideDown()

  $('.menu-btn').click(function(e){
    if (e.target.id == 'turnOff'){
      turnPhoneOff(restart=false)
    }
    else if (e.target.id == 'restart'){
      turnPhoneOff(restart=true)
    }
    else{
      $('#turnOffMenu').slideUp()
    }
  })
  $('#game').one('click', function(e){
    if (e.target.parentElement.id == 'turnOffMenu' || e.target.id == 'turnOffMenu'){
      return
    }
    else{
      $('#turnOffMenu').slideUp()
    }
  })
}

function turnPhoneOff(restart){
  $('#game').html('')
  $('#game').html('<div id="camera-div"><div id="camera"></div></div>')
  removeAllClasses()
  open_apps.length = 0
  tellServer('state', 'off')

  if (restart){
    setTimeout(turnPhoneOn, 4000)
  }
}
