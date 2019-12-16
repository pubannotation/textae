export default function(editors) {
  // Remove ACTIVE_CLASS from all editor.
  editors
    .map((other) => other[0])
    .forEach((element) => {
      element.classList.remove('textae-editor--active')
    })
}
