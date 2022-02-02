import ajaxAccessor from '../../util/ajaxAccessor'

export default function (url, done, errorHandler, eventEmitter) {
  eventEmitter.emit('textae-event.data-access-object.startLoad')

  ajaxAccessor(
    url,
    (data) => {
      done(data)
      eventEmitter.emit('textae-event.data-access-object.endLoad')
    },
    () => {
      errorHandler()
      eventEmitter.emit('textae-event.data-access-object.endLoad')
    }
  )
}
