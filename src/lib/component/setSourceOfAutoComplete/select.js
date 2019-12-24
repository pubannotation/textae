export default function(input, labelSpan, ui) {
  input.value = ui.item.raw.id
  labelSpan.innerText = ui.item.raw.label
  return false
}
