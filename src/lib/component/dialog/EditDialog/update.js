import source from '../../source'
import customizeqQueryUiAutocomplete from './customize-jquery-ui-autocomplete'
import $ from 'jquery'

customizeqQueryUiAutocomplete()

export default function($dialog, typeDefinition, autocompletionWs, done, predicate, value) {
  let $inputs = $dialog.find('input'),
    $labelSpan = $dialog.find('label').eq(1).find('span')

  // Update the source
  if (typeDefinition && autocompletionWs) {
    $inputs.eq(1)
    .autocomplete({
      source: (request, response) => {
        $labelSpan.text('')
        source(typeDefinition, autocompletionWs, request, response)
      },
      minLength: 3,
      select: (event, ui) => select($inputs.eq(1), $labelSpan, ui)
    })
  }

  // Update done handler
  $dialog.done = done

  // Update display value
  $inputs.eq(0).val(predicate)
  $inputs.eq(1).val(value)
  if (typeDefinition && typeDefinition.getLabel(value)) {
    $labelSpan.text(typeDefinition.getLabel(value))
  } else {
    $labelSpan.text('')
  }
}

function select($input, $labelSpan, ui) {
  $input.val(ui.item.raw.id)
  $labelSpan.html(ui.item.raw.label)

  return false
}
