import ajaxAccessor from '../../util/ajaxAccessor'

export default function (url, done, errorHandler, editor) {
  editor.startWait()

  ajaxAccessor(
    url,
    (data) => {
      done(data)
      editor.endWait()
    },
    () => {
      errorHandler()
      editor.endWait()
    }
  )
}
