import toRows from './toRows'

export default function(pallet, typeContainer, point) {
  if (typeContainer && typeContainer.getSortedIds().length > 0) {
    clear(pallet)
    appendRows(pallet, typeContainer)
    show(pallet)
    setHeightWithinWindow(pallet)
    moveIntoWindow(pallet, point)
  }
}

function clear(pallet) {
  pallet.querySelector('table').innerHTML = ''
  pallet.style.height = ''
}

function appendRows(pallet, typeContainer) {
  pallet.querySelector('table').innerHTML = toRows(typeContainer)
}

function show(pallet) {
  pallet.style.display = 'block'
}

function setHeightWithinWindow(pallet) {
  if (window.innerHeight - 2 <= pallet.offsetHeight) {
    pallet.style.height = window.innerHeight - 2 + 'px'
  }
}

function moveIntoWindow(pallet, point) {
  // Pull up the pallet when the pallet protrudes from bottom of the window.
  if (pallet.offsetHeight + point.top > window.innerHeight) {
    point.top = window.innerHeight - pallet.offsetHeight - 1
  }

  pallet.style.top = point.top + 'px'
  pallet.style.left = point.left + 'px'
}
