import $ from 'jquery'
import serverAuthHandler from './serverAuthHandler'

export default function(
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
  $.ajax(opt)
    .done(successHandler)
    .fail((ajaxResponse) => serverAuthHandler(ajaxResponse, failHandler))
    .always(finishHandler)
}
