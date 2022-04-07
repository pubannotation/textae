import $ from 'jquery'
import serverAuthHandler from './requestAjax/serverAuthHandler'
import post from './post'

export default function (
  url,
  data,
  beforeSend,
  successHandler,
  failHandler,
  finishHandler
) {
  console.assert(url, 'url is necessary!')

  const retryByPost = () =>
    post(url, data, beforeSend, successHandler, failHandler, finishHandler)

  beforeSend()
  requestAjax('patch', url, data, successHandler, retryByPost, finishHandler)
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
    type,
    url,
    contentType: 'application/json',
    data,
    crossDomain: true,
    xhrFields: {
      withCredentials: true
    }
  }

  const retryHandler = () => {
    $.ajax(opt).done(successHandler).fail(failHandler).always(finishHandler)
  }

  $.ajax(opt)
    .done(successHandler)
    .fail((ajaxResponse) =>
      serverAuthHandler(ajaxResponse, failHandler, retryHandler)
    )
    .always(finishHandler)
}
