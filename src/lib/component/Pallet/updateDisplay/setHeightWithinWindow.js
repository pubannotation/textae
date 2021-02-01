const BUFFER = 2

export default function (pallet) {
  if (window.innerHeight - BUFFER <= pallet.offsetHeight) {
    const height = window.innerHeight - BUFFER

    pallet.style.height = `${height}px`
  } else {
    pallet.style.height = null
  }
}
