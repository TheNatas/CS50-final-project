function prepareLockScreen(){

  $('.hour').html(now.toTimeString().slice(0,5))
  $('.day').html(now.toDateString())
  setInterval(function(){
    now = new Date()
    $('.hour').html(now.toTimeString().slice(0,5))
    $('.day').html(now.toDateString())
  }, 1000)

  $('.hour-day').slideDown(1)
  $('#turnOffMenu').slideUp(1)
  $('.password').slideUp(1)
  $('.swipe').slideUp(1)
  $('.password-screen').slideUp(1)
  $('.blocked-warning').slideUp(1)

  $('.swipe').slideDown()

  $('.space').click(showPasswordInput)

  function showPasswordInput(){
    $('.password').slideDown().focus()
    $('.swipe').slideUp()
    $('.hour-day').slideUp()
    $('.password-screen').slideDown()
    if (blocked){
      $('.orientation').html('Phone blocked')
      $('.pw-tip').slideUp(1)
      $('.blocked-warning').slideDown(1)
    }
  }

  // Listen to the swipe,
  // checking if it was
  // long enough
  var start
  var end

  $('.swipe').draggable({
    revert: true,
    revertDuration: 200,
    axis: "y",
    start: function(e){start = parseInt(e.pageY, 10)},
    stop: function(e){end = parseInt(e.pageY, 10)
            if ((start - end) < 75){
              return
            }else{
              showPasswordInput()
            }
          }
  })

}
