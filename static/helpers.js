var now = new Date()

function removeAllClasses(){
  $('#game').removeClass(function(){
    return $('#game').attr('class')
  })
}

function capitalizeFirstLetter(str){
  return str.charAt(0).toUpperCase() + str.slice(1)
}
