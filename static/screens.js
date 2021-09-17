var home = {
  name: 'home',
  html: '',
  prepare(){
    prepareHomescreen()
  }
}
var notes = {
  name: 'notes',
  html: '',
  prepare(){
    prepareNotesApp()
    statusBar()
  },
  open(){
    openNotesApp()
  },
  close(){
    current_txt = undefined
    current_canvas = undefined
    selected = 'w'
    removeFromAppList(open_apps, notes)
    if (this == currentScreen()){
      home.prepare()
      squareButton()
    }
  }
}
var camera = {
  name: 'camera',
  html: '',
  prepare(){
    prepareCamera()
    statusBar()
  },
  open(){
    openCamera()
  },
  close(){
    removeFromAppList(open_apps, camera)
    if (this == currentScreen()){
      home.prepare()
      squareButton()
    }
  }
}

function loadScreen(scr){
  var requestScreen = $.ajax({
    url: '/static/screens/' + scr + '/' + scr + '.html',
    dataType: 'html'
  })
  requestScreen.done(function(html){

    if (scr == 'home'){
      home.html = html
      home.prepare()
    }
    else if (scr == 'notes'){
      notes.html = html
      notes.prepare()
    }
    else if (scr == 'camera'){
      camera.html = html
      camera.prepare()
    }

  })
}
