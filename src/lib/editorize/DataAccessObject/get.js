import ajaxAccessor from '../../util/ajaxAccessor'

export default function (url, done, errorHandler, editor) {
  editor.eventEmitter.emit('textae-event.data-access-object.startLoad')

  ajaxAccessor(
    url,
    (data) => {
      done(data)
      editor.eventEmitter.emit('textae-event.data-access-object.endLoad')
    },
    () => {
      errorHandler()
      editor.eventEmitter.emit('textae-event.data-access-object.endLoad')
    }
  )
}
