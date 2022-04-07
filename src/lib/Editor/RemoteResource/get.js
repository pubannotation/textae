import $ from 'jquery'

export default function (url, done, errorHandler, eventEmitter) {
  console.assert(url, 'url is necessary!')

  eventEmitter.emit('textae-event.resource.startLoad')

  const opt = {
    type: 'GET',
    url,
    cache: false,
    xhrFields: {
      withCredentials: true
    },
    timeout: 30000
  }

  $.ajax(opt)
    .done((data) => {
      done(data)
      eventEmitter.emit('textae-event.resource.endLoad')
    })
    .fail(() => {
      errorHandler()
      eventEmitter.emit('textae-event.resource.endLoad')
    })
}
