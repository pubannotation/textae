import $ from 'jquery'

export default function (url, dataHandler, failedHandler) {
  console.assert(url, 'url is necessary!')

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
