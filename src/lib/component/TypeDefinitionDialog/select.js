export default function(inputId, inputLabel, ui) {
  inputId.value = ui.item.raw.id
  inputLabel.value = ui.item.raw.label
  return false
}
