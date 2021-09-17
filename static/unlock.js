var tries = 0
var blocked = false

// As the password input isn't called from the start,
// delegate the event to it's parent and check for it's
// class each time it is triggered
$('#game').keypress(function(e){

  if (!(e.target && e.target.className == 'password' || e.target.className == 'col-5 password')){
    return
  }

  if (!(e.which == 13)){
    return
  }

  if (blocked){
    $('.password').val('')
    return
  }

  var request = $.ajax({
    url: '/check',
    method: 'POST',
    data: $('.password').val(),
    processData: false,
    contentType: 'text/plain'
  })

  request.done(function(ans){

    if (ans.correct){
      tries = 0

      if (!last_screen[last_screen.length-1]){

        if (!home.html){
          loadScreen('home')
        }else{
          prepareHomescreen()
        }

      }else{
        last_screen[last_screen.length-1].prepare()
      }

    }else{
      wrongPassword()
    }

  })

})

function wrongPassword(){
  tries++
  if (tries > 2){
    blocked = true

    var n = 60 * tries
    var timerID = setInterval(function(){
      n--
      if (n == 0){
        clearInterval(timerID)
        blocked = false
        $('.orientation').html('Type your password')
        $('.blocked-warning').slideUp()
        $('.pw-tip').slideDown()
      }
      $('.blocked-warning').html('You had too many wrong attempts. Try again in ' + String(n) + ' seconds')
    }, 1000)

    $('.orientation').html('Phone blocked')
    $('.pw-tip').slideUp()
    $('.blocked-warning').slideDown()
  }
  // Tremble screen
  for (var i = 0; i < 2; i++){
    $('.password').animate({'left': '-=3'}, 100)
    $('.password').animate({'left': '+=6'}, 100, function(){
        $('.password').css('left', 0)
    })
  }

  $('.password').val('')
  return
}
