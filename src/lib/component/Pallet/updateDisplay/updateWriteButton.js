import CLASS_NAMES from '../className'

export default function(pallet, history) {
  if (history.hasAnythingToSave('configuration')) {
    pallet.querySelector(`.${CLASS_NAMES.buttonWrite}`).classList.add(CLASS_NAMES.buttonWriteTransit)
  } else {
    pallet.querySelector(`.${CLASS_NAMES.buttonWrite}`).classList.remove(CLASS_NAMES.buttonWriteTransit)
  }
}
