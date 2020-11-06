import veil from './veil'

export default function (hasWaitingEditor) {
  if (hasWaitingEditor) {
    veil.show()
  } else {
    veil.hide()
  }
}
