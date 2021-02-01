const BUFFER = 2

export default function (pallet, windowHeight) {
  if (windowHeight - BUFFER <= pallet.offsetHeight) {
    const height = windowHeight - BUFFER

    pallet.style.height = `${height}px`
  } else {
    pallet.style.height = null
  }
}
