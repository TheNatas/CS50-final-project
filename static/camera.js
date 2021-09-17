var constraints = {
  audio: false,
  video: {
    facingMode: "user",
    width: document.querySelector('div').width,
    heiht: document.querySelector('div').height
  }
}

function openCamera(){

  if (!camera.html){
    loadScreen('camera')
  }else{
  camera.prepare()
  }

}

function prepareCamera(){

  $('#game').html(camera.html)
  removeAllClasses()
  $('#game').addClass('camera-app')

  addToAppList(open_apps)
  addToAppList(last_screen)

  $('#status-bar').slideUp(1)
  $('#turnOffMenu').slideUp(1)
  $('.dropdown').slideUp(1)

  navigator.mediaDevices.getUserMedia(constraints)
  .then(function(stream){
    var video = document.querySelector('video')
    video.srcObject = stream
    video.onloadedmetadata = function(e){
      video.play()
      $('#camera').addClass('active')
      activateCamera()
    }
  })
  .catch(function(err){
    console.log(err.name + ": " + err.message)
  })

}
