import source from '../../source'
import customizeqQueryUiAutocomplete from '../../dialog/EditDialog/customize-jquery-ui-autocomplete'

customizeqQueryUiAutocomplete()

export default function($dialog, typeContainer, autocompletionWs, done, id, label, color, isDefault) {
  let $inputs = $dialog.find('input'),
    $labelSpan = $dialog.find('label').eq(1).find('span')

  // Update the source
  $inputs.eq(1)
    .autocomplete({
      source: (request, response) => {
        $labelSpan.text('')
        source(typeContainer, autocompletionWs, request, response)
      },
      minLength: 3,
      select: (event, ui) => select($inputs.eq(1), $labelSpan, ui)
    })

  // Update done handler
  $dialog.done = done

  // Update display value
  $inputs.eq(0).val(id)
  $inputs.eq(1).val(label)
  if (typeContainer.getLabel(label)) {
    $labelSpan.text(typeContainer.getLabel(label))
  } else {
    $labelSpan.text('')
  }
  $inputs.eq(2).val(color)
  $inputs.eq(3).attr('checked', isDefault)
  $inputs.eq(3).prop('checked', isDefault)

  if (isDefault) {
    $inputs.eq(3).attr('disabled', 'disabled')
    $inputs.eq(3).prop('disabled', 'disabled')
  }
}

function select($input, $labelSpan, ui) {
  $input.val(ui.item.raw.id)
  $labelSpan.html(ui.item.raw.label)

  return false
}
