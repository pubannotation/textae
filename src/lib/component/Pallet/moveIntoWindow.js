export default function (editor, pallet, point) {
  // Pull left the pallet when the pallet protrudes from right of the editor.
  if (pallet.offsetWidth + point.left > editor[0].offsetWidth) {
    point.left =
      editor[0].offsetLeft + editor[0].offsetWidth - pallet.offsetWidth - 2
  }

  // Pull up the pallet when the pallet protrudes from bottom of the window.
  let top
  if (pallet.offsetHeight + point.clientY > window.innerHeight) {
    top =
      point.pageY -
      editor[0].offsetTop -
      (pallet.offsetHeight + point.clientY - window.innerHeight)
  } else {
    top = point.pageY - editor[0].offsetTop
  }

  pallet.style.top = `${top}px`
  pallet.style.left = `${point.left}px`
}
