import CLASS_NAMES from '../className'

export default function(pallet, isLock) {
  const lockIcon = pallet.querySelector(`.${CLASS_NAMES.lockIcon}`)
  const lockNodes = pallet.querySelectorAll(`.${CLASS_NAMES.hideWhenLocked}`)

  if (isLock) {
    lockIcon.style.display = 'inline-block'

    for (const lockNode of lockNodes) {
      lockNode.classList.add(CLASS_NAMES.hideWhenLockedHide)
    }
  } else {
    lockIcon.style.display = 'none'

    for (const lockNode of lockNodes) {
      lockNode.classList.remove(CLASS_NAMES.hideWhenLockedHide)
    }
  }
}
