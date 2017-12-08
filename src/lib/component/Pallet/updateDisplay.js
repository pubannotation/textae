import toRows from './toRows'
import CLASS_NAMES from './className'

export default function(pallet, history, typeContainer, point) {
  if (typeContainer && typeContainer.getSortedIds().length > 0) {
    clear(pallet)
    appendRows(pallet, typeContainer)
    updateLockState(pallet, typeContainer.isLock())
    show(pallet)
    setWidthWithinWindow(pallet)
    setHeightWithinWindow(pallet)
    setWriteButtonState(history, pallet)

    if (point) {
      moveIntoWindow(pallet, point)
    }
  }
}

function clear(pallet) {
  pallet.querySelector('table').innerHTML = ''
  pallet.style.height = ''
}

function updateLockState(pallet, isLock) {
  let lockIcon = pallet.querySelector('.' + CLASS_NAMES.lockIcon),
    lockNodes = pallet.querySelectorAll('.' + CLASS_NAMES.hideWhenLocked),
    hideClassName = CLASS_NAMES.hideWhenLockedHide

  if (isLock) {
    lockIcon.style.display = 'inline-block'
    Array.prototype.forEach.call(lockNodes, (lockNode) => {
      lockNode.classList.add(hideClassName)
    })
  } else {
    lockIcon.style.display = 'none'
    Array.prototype.forEach.call(lockNodes, (lockNode) => {
      lockNode.classList.remove(hideClassName)
    })
  }
}

function appendRows(pallet, typeContainer) {
  pallet.querySelector('table').innerHTML = toRows(typeContainer)
}

function show(pallet) {
  pallet.style.display = 'block'
}

function setWidthWithinWindow(pallet) {
  pallet.style.width = 'auto'
  if (window.innerWidth - 2 <= pallet.offsetWidth) {
    pallet.style.width = window.innerWidth - 4 + 'px'
  }
}

function setHeightWithinWindow(pallet) {
  if (window.innerHeight - 2 <= pallet.offsetHeight) {
    pallet.style.height = window.innerHeight - 2 + 'px'
  }
}

function setWriteButtonState(history, pallet) {
  if (history.hasAnythingToSave('configuration')) {
    pallet.querySelector('.' + CLASS_NAMES.buttonWrite).classList.add(CLASS_NAMES.buttonWriteTransit)
  } else {
    pallet.querySelector('.' + CLASS_NAMES.buttonWrite).classList.remove(CLASS_NAMES.buttonWriteTransit)
  }
}

function moveIntoWindow(pallet, point) {
  // Pull left the pallet when the pallet protrudes from right of the window.
  if (pallet.offsetWidth + point.left > window.innerWidth) {
    point.left = window.innerWidth - pallet.offsetWidth - 2
  }

  // Pull up the pallet when the pallet protrudes from bottom of the window.
  if (pallet.offsetHeight + point.top > window.innerHeight) {
    point.top = window.innerHeight - pallet.offsetHeight - 1
  }

  pallet.style.top = point.top + 'px'
  pallet.style.left = point.left + 'px'
}
