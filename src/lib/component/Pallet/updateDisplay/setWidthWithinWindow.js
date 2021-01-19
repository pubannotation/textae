export default function (editor, pallet) {
  pallet.style.width = 'auto'

  if (editor[0].offsetWidth - 2 <= pallet.offsetWidth) {
    const width = editor[0].offsetWidth - 4
    pallet.style.width = `${width}px`
  }
}
