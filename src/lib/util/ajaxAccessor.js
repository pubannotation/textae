export {
  getAsync,
  post
}
import $ from 'jquery'

function getAsync(url, dataHandler, failedHandler) {
  if (isEmpty(url)) {
    return
  }

  let opt = {
    type: "GET",
    url: url,
    cache: false,
    xhrFields: {
      withCredentials: true
    }
  }

  $.ajax(opt)
    .done((data) => {
      if (dataHandler !== undefined) {
        dataHandler(data)
      }
    })
    .fail((res, textStatus, errorThrown) => {
      if (failedHandler !== undefined) {
        failedHandler()
      }
    })
}

function post(url, data, successHandler, failHandler, finishHandler) {
  if (isEmpty(url)) {
    return
  }

  console.log("POST data", data)

  let opt = {
    type: "post",
    url: url,
    contentType: "application/json",
    data: data,
    crossDomain: true,
    xhrFields: {
      withCredentials: true
    }
  }

  $.ajax(opt)
    .done(successHandler)
    .fail(failHandler)
    .always(finishHandler)
}

function isEmpty(str) {
  return !str || str === ""
}
