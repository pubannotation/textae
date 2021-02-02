const BORDER_HEIGHT = 7 * 2

export default function (pallet, height) {
  if (height - BORDER_HEIGHT <= pallet.offsetHeight) {
    pallet.style.height = `${height - BORDER_HEIGHT}px`
  } else {
    pallet.style.height = null
  }
}
