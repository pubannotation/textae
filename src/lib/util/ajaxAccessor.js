import $ from 'jquery'
import isEmptyString from './isEmptyString'

export default function (url, dataHandler, failedHandler) {
  if (isEmptyString(url)) {
    return
  }

  const opt = {
    type: 'GET',
    url,
    cache: false,
    xhrFields: {
      withCredentials: true
    },
    timeout: 30000
  }

  $.ajax(opt).done(dataHandler).fail(failedHandler)
}
