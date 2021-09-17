function tellServer(what, turnedTo){
  var response = $.ajax({
    url: '/' + what,
    method: 'POST',
    data: turnedTo,
    contentType: 'text/plain',
    processData: false
  })
}
