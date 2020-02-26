export default function(inputElement, labelSpan, ui) {
  inputElement.value = ui.item.raw.id
  labelSpan.innerText = ui.item.raw.label
  return false
}
