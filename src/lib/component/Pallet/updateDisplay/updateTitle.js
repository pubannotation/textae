import CLASS_NAMES from '../className'
import capitalize from 'capitalize'

export default function(pallet, handlerType) {
  const text = `${capitalize(handlerType)} configuration`

  pallet.querySelector(`.${CLASS_NAMES.titleText}`).innerText = text
}
