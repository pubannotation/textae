const BUFFER = 2

export default function (pallet, height) {
  if (height - BUFFER <= pallet.offsetHeight) {
    pallet.style.height = `${height - BUFFER}px`
  } else {
    pallet.style.height = null
  }
}
