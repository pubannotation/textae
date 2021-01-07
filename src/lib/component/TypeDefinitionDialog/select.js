export default function (inputId, inputLabel, ui) {
  inputId.value = ui.item.id
  inputLabel.value = ui.item.label
  return false
}
