import $ from 'jquery'

export default function (url, done, errorHandler, eventEmitter) {
  eventEmitter.emit('textae-event.resource.startLoad')

  ajaxAccessor(
    url,
    (data) => {
      done(data)
      eventEmitter.emit('textae-event.resource.endLoad')
    },
    () => {
      errorHandler()
      eventEmitter.emit('textae-event.resource.endLoad')
    }
  )
}

function ajaxAccessor(url, dataHandler, failedHandler) {
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
