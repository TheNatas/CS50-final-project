function openNotesApp(){

  if (!notes.html){
    loadScreen('notes')
  }else{
  notes.prepare()
  }

}

var selected = 'w'

function prepareNotesApp(){
  $('#game').html(notes.html)
  removeAllClasses()
  $('#game').addClass('notes-app')

  addToAppList(open_apps)
  addToAppList(last_screen)

  $('#status-bar').slideUp(1)
  $('#clear_confirmation').slideUp(1)
  $('#turnOffMenu').slideUp(1)
  $('.dropdown').slideUp(1)

  displayField()
}

function displayField(command){
  if (!command){
    command = selected
  }
  if (command == 'w'){
    $('#draw').slideUp(1)
    $('#clear').slideUp(1)
    $('#clear_confirmation').slideUp(1)
    $('#write').slideDown(1).focus()
    $('#d').removeClass('selected')
    $('#w').addClass('selected')
    selected = 'w'
    textarea()
  }
  else if (command == 'd'){
    $('#write').slideUp(1)
    $('#draw').slideDown(1)
    $('#clear').slideDown(1)
    $('#clear_confirmation').slideUp(1)
    $('#w').removeClass('selected')
    $('#d').addClass('selected')
    selected = 'd'
    canvas()
  }
}

var current_txt // <-- hold the text notes when minimized
// Place the minimized notes back
function textarea(){
  if (current_txt){
    $('#write').val(current_txt)
  }
  // Save text when minimizing
  $('#power-btn, .const-btn').one('mousedown', function(){
    current_txt = $('#write').val()
  })
}

// canvas functionality by Blindman67 (user from StackOverflow)
// See https://stackoverflow.com/questions/43853119/javascript-wrong-mouse-position-when-drawing-on-canvas
// for reference.
var current_canvas // <-- hold the canvas drawing when minimized
function canvas(){

  const mouse = {
    x: 0, y: 0,
    lastX: 0, lastY: 0,
    b1: false, b2: false, b3: false,
    buttonNames: ['b1', 'b2', 'b3']
  }

  const field = document.querySelector('#draw')
  const ctx = field.getContext('2d')

  if (current_canvas){
    ctx.drawImage(current_canvas, 0, 0)
  }
  // Save drawing when minimizing
  $('#power-btn, .const-btn').one('mousedown', function(){
    let src = field.toDataURL()
    current_canvas = document.createElement('img')
    current_canvas.setAttribute('src', src)
  })

  requestAnimationFrame(mainLoop)

  function mainLoop(time) {
    if (mouse.b1) {  // is button 1 down?
      ctx.beginPath()
      ctx.moveTo(mouse.lastX, mouse.lastY)
      ctx.lineTo(mouse.x, mouse.y)
      ctx.stroke()
    }


    // Save the last known mouse coordinate here
    mouse.lastX = mouse.x;
    mouse.lastY = mouse.y;
    requestAnimationFrame(mainLoop); // Get next frame
  }

  document.addEventListener('mousemove', mouseEvent)
  document.addEventListener('mousedown', mouseEvent)
  document.addEventListener('mouseup',   mouseEvent)

  function mouseEvent(e){

    // Only start mouse down events if the users started on the canvas
    if (e.type === 'mousedown' && !(e.target.id === 'draw')) {
         return
    }

    const bounds = field.getBoundingClientRect()

    mouse.x = event.pageX - bounds.left - window.scrollX
    mouse.y = event.pageY - bounds.top - window.scrollY

    fixCoordinates(mouse)

    if (event.type === 'mousedown') {
         mouse[mouse.buttonNames[event.which - 1]] = true;  // Set the button as down
    }
    else if (event.type === 'mouseup') {
         mouse[mouse.buttonNames[event.which - 1]] = false; // Set the button up
    }

    function fixCoordinates(mouse){

      mouse.x /= bounds.width
      mouse.y /= bounds.height

      mouse.x *= field.width
      mouse.y *= field.height

    }

    $('#clear').click(function(){
      $('#clear_confirmation').slideDown()
      $('#yes').click(function(){
        ctx.clearRect(0, 0, field.width, field.height)
        $('#clear_confirmation').slideUp()
      })
      $('#no').click(function(){
        $('#clear_confirmation').slideUp()
      })
    })

  }

}

function saveNotes(){
  if (selected == 'w'){

    var blob = new Blob([$('#write').val()], {type: 'text/plain;charset=utf-8'})
    saveAs(blob, "notes.txt")

  }else{

    const field = document.querySelector('#draw')
    field.toBlob(function(blob){
      saveAs(blob, "notes.png")
    })

  }
}
