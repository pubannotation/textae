import clearTextSelection from './clearTextSelection'
import alertifyjs from 'alertifyjs'

export default function (message) {
  clearTextSelection()
  alertifyjs.warning(message)
}
