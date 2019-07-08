export default function(pallet) {
  pallet.style.width = 'auto'

  if (window.innerWidth - 2 <= pallet.offsetWidth) {
    const width = window.innerWidth - 4
    pallet.style.width = `${width}px`
  }
}
