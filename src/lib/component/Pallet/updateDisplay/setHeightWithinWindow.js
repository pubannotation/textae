export default function (pallet) {
  if (window.innerHeight - 2 <= pallet.offsetHeight) {
    const height = window.innerHeight - 2
    pallet.style.height = `${height}px`
  } else {
    pallet.style.height = null
  }
}
