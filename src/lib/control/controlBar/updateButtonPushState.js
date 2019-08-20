import push from '../push'
import unpush from '../unpush'

export default function($control, buttonType, isPushed) {
  if (isPushed) {
    push($control, buttonType)
  } else {
    unpush($control, buttonType)
  }
}
