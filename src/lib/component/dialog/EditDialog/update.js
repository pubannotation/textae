
export default function($dialog, predicate, value) {
  const $inputs = $dialog.find('input')

  // Update display value
  $inputs.eq(0).val(predicate)
  $inputs.eq(1).val(value)
}
