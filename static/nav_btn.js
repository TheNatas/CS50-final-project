var open_apps = []
var last_screen = []

// ---------------------------------------------------BUTTON HANDLERS--------------------------------------------------- //
function squareButton(){
  $('.dropdown-menu').html('')
  // Show the apps in open_apps and allow the user to close any
  if (open_apps.length == 0){return}
  $('.dropdown').toggle()
  for (let i = 0; i < open_apps.length; i++){
    let app = document.createElement('div')
    app.setAttribute('class', 'dropdown-item')
    document.querySelector('.dropdown-menu').appendChild(app)
    app.innerHTML = capitalizeFirstLetter(open_apps[i].name)

    let btn = document.createElement('button')
    btn.setAttribute('id', 'closeBtn')
    app.appendChild(btn)
    btn.innerHTML = 'X'
  }

  $('#game').on('click', function(e){

    if (!(e.target.id == 'squareBtn' || e.target.parentElement.className == 'dropdown-item' || e.target.className == 'dropdown-item' || e.target.className == 'dropdown-menu')){
      $('.dropdown').slideUp()
    }else if ($('.dropdown-menu').html() == ''){
      $('.dropdown').slideUp()
    }

  })

  $('.dropdown-item').on('click', function(e){
    for (let i = 0; i < open_apps.length; i++){
      // Checks if the user opened an app from open_apps
      if (capitalizeFirstLetter(open_apps[i].name) == e.target.firstChild.data){
        open_apps[i].open()
      }
      // Checks if the user removed an app from open_apps
      else if (capitalizeFirstLetter(open_apps[i].name) == e.target.parentElement.firstChild.data){
        open_apps[i].close()
        e.target.parentElement.remove()
      }
    }
  })
}

function homeButton(){
  home.prepare()
}

function returnButton(){

  if (currentScreen() == home){
    return
  }

  if (last_screen.length == 1){
    home.prepare()
    return
  }

  last_screen[last_screen.length-2].prepare()
  last_screen.splice(last_screen.length-2, 1)
}
// ------------------------------------------------------HELPERS-------------------------------------------------------- //

function addToAppList(list){

  let app = currentScreen()

  if (app == home){
    return
  }
  // Remove the current screen from open_apps (if already opened)
  removeFromAppList(list, app)
  // Add the current screen to open_apps
  list.push(app)
}

function removeFromAppList(list, app){

  if (list.indexOf(app) != -1){
    list.splice(list.indexOf(app), 1)
  }
}

function currentScreen(){
  if ($('#game').hasClass('homescreen')){
    return home
  }
  else if ($('#game').hasClass('notes-app')){
    return notes
  }
  else if ($('#game').hasClass('camera-app')){
    return camera
  }
}
