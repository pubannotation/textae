import toRows from './toRows'

export default function(pallet, typeContainer, point, labelUsedNumberMap) {
  if (typeContainer && typeContainer.getSortedIds().length > 0) {
    clear(pallet)
    appendRows(pallet, typeContainer, labelUsedNumberMap)
    show(pallet)
    setWidthWithinWindow(pallet)
    setHeightWithinWindow(pallet)

    if (point) {
      moveIntoWindow(pallet, point)
    }
  }
}

function clear(pallet) {
  pallet.querySelector('table').innerHTML = ''
  pallet.style.height = ''
}

function appendRows(pallet, typeContainer, labelUsedNumberMap) {
  pallet.querySelector('table').innerHTML = toRows(typeContainer, labelUsedNumberMap)
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
