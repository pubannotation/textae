import customizeqQueryUiAutocomplete from './customize-jquery-ui-autocomplete'

customizeqQueryUiAutocomplete()

export default function($dialog, done, predicate, value) {
  const $inputs = $dialog.find('input')

  // Update done handler
  $dialog.done = done

  // Update display value
  $inputs.eq(0).val(predicate)
  $inputs.eq(1).val(value)
}
