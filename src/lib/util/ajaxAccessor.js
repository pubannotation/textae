export { getAsync, post, patch }
import $ from 'jquery'

function getAsync(url, dataHandler, failedHandler) {
  if (isEmpty(url)) {
    return
  }

  const opt = {
    type: 'GET',
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

  console.log('POST data', data)
  requestAjax('post', url, data, successHandler, failHandler, finishHandler)
}

function patch(url, data, successHandler, failHandler, finishHandler) {
  if (isEmpty(url)) {
    return
  }

  console.log('PATCH data', data)
  requestAjax('patch', url, data, successHandler, failHandler, finishHandler)
}

function isEmpty(str) {
  return !str || str === ''
}

function requestAjax(
  type,
  url,
  data,
  successHandler,
  failHandler,
  finishHandler
) {
  const opt = {
    type: type,
    url: url,
    contentType: 'application/json',
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
