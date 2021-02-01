export default function (editor, pallet, point, maxWidth, maxHeight) {
  // Pull left the pallet when the pallet protrudes from right of the editor.
  if (pallet.offsetWidth + point.left > maxWidth) {
    point.left = editor[0].offsetLeft + maxWidth - pallet.offsetWidth - 2
  }

  // Pull up the pallet when the pallet protrudes from bottom of the window.
  let top
  if (pallet.offsetHeight + point.clientY > maxHeight) {
    top =
      point.pageY -
      editor[0].offsetTop -
      (pallet.offsetHeight + point.clientY - maxHeight)
  } else {
    top = point.pageY - editor[0].offsetTop
  }

  pallet.style.top = `${top}px`
  pallet.style.left = `${point.left}px`
}
