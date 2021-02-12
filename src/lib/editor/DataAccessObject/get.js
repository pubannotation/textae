import ajaxAccessor from '../../util/ajaxAccessor'
import alertifyjs from 'alertifyjs'

export default function (url, done, cursorChanger) {
  cursorChanger.startWait()

  ajaxAccessor(
    url,
    (data) => {
      done(data)
      cursorChanger.endWait()
    },
    () => {
      cursorChanger.endWait()
      alertifyjs.error(
        `Could not load the file from the location you specified.: ${url}`
      )
    }
  )
}
