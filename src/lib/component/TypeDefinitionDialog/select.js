export default function (inputId, inputLabel, { item }) {
  inputId.value = item.id
  inputLabel.value = item.label
  return false
}
