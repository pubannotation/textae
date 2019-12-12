import push from './push'
import unpush from './unpush'

export default function(el, buttonType, isPushed) {
  if (isPushed) {
    push(el, buttonType)
  } else {
    unpush(el, buttonType)
  }
}
