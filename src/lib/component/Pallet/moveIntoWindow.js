export default function (pallet, point) {
  // Pull left the pallet when the pallet protrudes from right of the window.
  if (pallet.offsetWidth + point.left > window.innerWidth) {
    point.left = window.innerWidth - pallet.offsetWidth - 2
  }

  // Pull up the pallet when the pallet protrudes from bottom of the window.
  if (pallet.offsetHeight + point.top > window.innerHeight) {
    point.top = window.innerHeight - pallet.offsetHeight - 1
  }

  pallet.style.top = `${point.top}px`
  pallet.style.left = `${point.left}px`
}
