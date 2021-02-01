export default function (pallet, width) {
  pallet.style.width = 'auto'

  if (width - 2 <= pallet.offsetWidth) {
    pallet.style.width = `${width - 4}px`
  }
}
