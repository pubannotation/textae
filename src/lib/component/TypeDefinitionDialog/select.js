export default function($inputId, $inputLabel, ui) {
  $inputId.val(ui.item.raw.id)
  $inputLabel.val(ui.item.raw.label)
  return false
}
