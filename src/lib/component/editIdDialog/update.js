import source from './source'
import customizeqQueryUiAutocomplete from './customize-jquery-ui-autocomplete'
import $ from 'jquery'

customizeqQueryUiAutocomplete()

export default function(dialog, input, label, typeContainer, autocompletionWs, done, currentId) {
  // Update the source
  $(input)
    .autocomplete({
      source: (request, response) => {
        label.innerText = ''
        source(typeContainer, autocompletionWs, request, response)
      },
      minLength: 3,
      select: (event, ui) => select(input, label, ui)
    })

  // Update done handler
  dialog.done = done

  // Update display value
  input.value = currentId
  if (typeContainer.getLabel(currentId)) {
    label.innerText = typeContainer.getLabel(currentId)
  } else {
    label.innerText = ''
  }
}

function select(input, label, ui) {
  input.value = ui.item.raw.id
  label.innerHTML = ui.item.raw.label

  return false
}
