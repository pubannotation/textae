import ajaxAccessor from '../../util/ajaxAccessor'
import alertifyjs from 'alertifyjs'

export default function(url, done, cursorChanger) {
  cursorChanger.startWait()

  ajaxAccessor(
    url,
    (data) => {
      done(url, data)
      cursorChanger.endWait()
    },
    () => {
      cursorChanger.endWait()
      alertifyjs.error('Could not load the target.')
    }
  )
}
