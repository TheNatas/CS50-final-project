function activateCamera(){

  let capture_btn = document.querySelector('#capture')
  capture_btn.addEventListener('click', takePicture, false)

  var video = document.querySelector('video')
  var photo = document.querySelector('#photo')
  var canvas = document.querySelector('#canvas')
  var context = canvas.getContext('2d');

  // Add save icon listener
  $('#video-container').click(function(e){
    if (e.target.id != 'save-photo'){return}
    savePhoto()
  })

  // Add close icon listener
  $('#video-container').click(function(e){
    if (e.target.id != 'close-photo'){return}
    $('#original').slideUp()
    changeDisplay()
  })

  // Add filtering icons listener
  $('#video-container').click(function(e){
    let id
    if (e.target.id == 'original'){
      if (!e.isTrigger){
        $('.selected').removeClass('selected')
        $('#original').addClass('selected')
        $('#value-slider').slideUp()

        $('#filter-name').html(capitalizeFirstLetter(e.target.id))
        $('#filter-name').stop()
        $('#filter-name').slideUp(1)
        $('#filter-name').slideDown(800)
      }
      context.filter = 'none'
      context.drawImage(photo, 0, 0, canvas.width, canvas.height)
      return
    }
    if (e.target.className != 'preview'){return}
    let filter = e.target.id

    let value

    if (!value){
      $('#value-slider').slideDown()
    }

    // Configure slider and convert units for each filter
    let end = ''
    switch (filter) {
      case 'grayscale':
        $('.selected').removeClass('selected')
        $('#grayscale').addClass('selected')
        end = '%'
        $('#value-slider').attr('max', '100')
        $('#value-slider').val('0')
        $('#original').click()

        $('#filter-name').html(capitalizeFirstLetter(filter))
        $('#filter-name').stop()
        $('#filter-name').slideUp(1)
        $('#filter-name').slideDown(800)
        break;
      case 'blur':
        $('.selected').removeClass('selected')
        $('#blur').addClass('selected')
        end = 'px'
        $('#value-slider').attr('max', '5')
        $('#value-slider').val('0')
        $('#original').click()

        $('#filter-name').html(capitalizeFirstLetter(filter))
        $('#filter-name').stop()
        $('#filter-name').slideUp(1)
        $('#filter-name').slideDown(800)
        break;
      case 'contrast':
        $('.selected').removeClass('selected')
        $('#contrast').addClass('selected')
        end = '%'
        $('#value-slider').attr('max', '200')
        $('#value-slider').val('100')
        $('#original').click()

        $('#filter-name').html(capitalizeFirstLetter(filter))
        $('#filter-name').stop()
        $('#filter-name').slideUp(1)
        $('#filter-name').slideDown(800)
        break;
      case 'sepia':
        $('.selected').removeClass('selected')
        $('#sepia').addClass('selected')
        end = '%'
        $('#value-slider').attr('max', '100')
        $('#value-slider').val('0')
        $('#original').click()

        $('#filter-name').html(capitalizeFirstLetter(filter))
        $('#filter-name').stop()
        $('#filter-name').slideUp(1)
        $('#filter-name').slideDown(800)
    }

    // Add input change listener
    $('#value-slider').on('input', function(e){
      $('#original').slideDown()

      if (e.target.id != 'value-slider'){return}
      value = $('#value-slider').val()

      context.filter = filter + `(${value}${end})`
      context.restore()
      context.drawImage(photo, 0, 0, canvas.width, canvas.height)
    })
  })

  function takePicture(){

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    context.save()
    context.scale(-1, 1)
    context.drawImage(video, 0, 0, -canvas.width, canvas.height);

    changeDisplay()

    let src = canvas.toDataURL()
    photo.setAttribute('src', src)

  }

  function changeDisplay(){
    $('#canvas').toggle()
    $('video').toggle()
    $('#capture').toggle()
    $('#close-photo').toggle()
    $('#save-photo').toggle()
    $('.preview').toggle()
    $('#value-slider, #filter-name').slideUp()

    let prev = canvas.toDataURL()
    $('#grayscale, #sepia, #blur, #contrast, #original').attr('src', prev)
  }

  function savePhoto(){
    canvas.toBlob(function(blob){
      saveAs(blob, "selfie.png")
    })
  }

}
