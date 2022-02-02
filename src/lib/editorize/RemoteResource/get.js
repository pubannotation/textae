import ajaxAccessor from '../../util/ajaxAccessor'

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
