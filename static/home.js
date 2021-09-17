var new_clock_position

function prepareHomescreen(){
  $('#game').html(home.html)
  setInterval(function(){
    now = new Date()
    $('#clock').html(now.toTimeString().slice(0,5))
  }, 1000)
  $('#clock').html(now.toTimeString().slice(0,5))
  $('.hour').html(now.toTimeString().slice(0,5))
  $('.day').html(now.toDateString())
  removeAllClasses()
  $('#game').addClass('homescreen')

  if (new_clock_position){
    $('.hour-day').css('top', new_clock_position)
  }

  $('#turnOffMenu').slideUp(1)
  $('.dropdown').slideUp(1)

  $('.hour-day').draggable({
    revert: function(){
      if (parseInt($('.hour-day').css('top')) < 0 || parseInt($('.hour-day').css('bottom')) < 0){
        return true
      }
    },
    revertDuration: 200,
    axis: "y",
    stop: function(){
      $('.hour-day').css('left', 'inherit')
      new_clock_position = $('.hour-day').css('top')
    }
  })

  $('.homescreen').droppable({
    accept: ".hour-day"
  })

  $('.search').keypress(function(e){
    if (e.which != 13){return}
    if (this.value.toLowerCase() == 'notes'){
      notes.open()
      return
    }
    else if (this.value.toLowerCase() == 'camera'){
      camera.open()
      return
    }
    open(`https://www.google.com/search?q=${this.value}`)
    this.value = ''
  })

  last_screen.length = 0
}

function statusBar(){
  let start, end
  $('#hidden').draggable({
    revert: true,
    axis: "y",
    start: function(e){
      start = parseInt(e.pageY, 10)
    },
    stop: function(e){
      end = parseInt(e.pageY, 10)
      if ((end - start) > 50){
        $('#status-bar').slideDown(300)
        setTimeout(function(){
          $('#status-bar').slideUp(300)
        }, 4000)
      }
      $('#hidden').css('top, left', '0, 0')
    }
  })

  $('#hidden').click(function(){
    $('#status-bar').slideDown(200)
    setTimeout(function(){
      $('#status-bar').slideUp(200)
    }, 500)
  })
}
