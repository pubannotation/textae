import source from '../../../source'
import customizeqQueryUiAutocomplete from '../../../dialog/EditDialog/customize-jquery-ui-autocomplete'

customizeqQueryUiAutocomplete()

export default function($dialog, typeContainer, autocompletionWs, done, id, label, color, isDefault) {
  let $inputs = $dialog.find('input')

  // Update the source
  $inputs.eq(0)
    .autocomplete({
      source: (request, response) => {
        source(typeContainer, autocompletionWs, request, response)
      },
      minLength: 3,
      select: (event, ui) => select($inputs.eq(0), $inputs.eq(1), ui)
    })
  $inputs.eq(1)
    .autocomplete({
      source: (request, response) => {
        source(typeContainer, autocompletionWs, request, response)
      },
      minLength: 3,
      select: (event, ui) => select($inputs.eq(0), $inputs.eq(1), ui)
    })

  // Update done handler
  $dialog.done = done

  // Update display value
  $inputs.eq(0).val(id)
  $inputs.eq(1).val(label)
  $inputs.eq(2).val(color)
  $inputs.eq(3).attr('checked', isDefault)
  $inputs.eq(3).prop('checked', isDefault)

  if (isDefault) {
    $inputs.eq(3).attr('disabled', 'disabled')
    $inputs.eq(3).prop('disabled', 'disabled')
  }
}

function select($inputId, $inputLabel, ui) {
  $inputId.val(ui.item.raw.id)
  $inputLabel.val(ui.item.raw.label)

  return false
}
