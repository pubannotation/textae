import $ from 'jquery'

export default function (url, done, errorHandler, eventEmitter) {
  console.assert(url, 'url is necessary!')

  eventEmitter.emit('textae-event.resource.startLoad')

  $.ajax({
    type: 'GET',
    url,
    cache: false,
    xhrFields: {
      withCredentials: true
    },
    timeout: 30000
  })
    .done(done)
    .fail(errorHandler)
    .always(() => eventEmitter.emit('textae-event.resource.endLoad'))
}
