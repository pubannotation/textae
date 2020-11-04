export default function (inputElement, labelSpan, ui) {
  inputElement.value = ui.item.raw.id

  if (labelSpan) {
    labelSpan.innerText = ui.item.raw.label
  }

  return false
}
