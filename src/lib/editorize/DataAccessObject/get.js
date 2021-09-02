import ajaxAccessor from '../../util/ajaxAccessor'

export default function (url, done, errorHandler, cursorChanger) {
  cursorChanger.startWait()

  ajaxAccessor(
    url,
    (data) => {
      done(data)
      cursorChanger.endWait()
    },
    () => {
      errorHandler()
      cursorChanger.endWait()
    }
  )
}
