function turnScreen(){
  // Ask server if phone is on or off
  var reqState = $.ajax({
    url: '/state',
    dataType: 'text'
  })
  reqState.done(function(phoneState){
    if (phoneState == 'on'){

      // Ask server if screen is on or off
      var request = $.ajax({
        url: '/screen',
        dataType: 'text'
      })

      request.done(function(phoneScreen){
        if (phoneScreen == 'on'){
          // If screen is on, turn it off
          $('#game').html('')
          $('#game').html('<div id="camera-div"><div id="camera"></div></div>')
          removeAllClasses()
          tellServer('screen', 'off')

        }else{
            turnScreenOn()
        }

      })

    }
  })

}

function turnScreenOn(){

  var request = $.ajax({
    url: 'static/screens/lock/lock.html',
    dataType: 'html'
  })

  request.done(function(html){

    $('#game').css('filter', 'brightness(100%)')
    $('#game').html(html)
    $('#game').addClass('lockscreen')
    tellServer('screen', 'on')
    prepareLockScreen()

  })

}
