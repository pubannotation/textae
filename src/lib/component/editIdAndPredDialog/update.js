import source from '../editIdDialog/source'
import customizeqQueryUiAutocomplete from '../editIdDialog/customize-jquery-ui-autocomplete'
import $ from 'jquery'

customizeqQueryUiAutocomplete()

export default function(dialog, inputId, inputPred, label, typeContainer, autocompletionWs, done, currentId, currentPred) {
  // Update the source
  $(inputId)
    .autocomplete({
      source: (request, response) => {
        label.innerText = ''
        source(typeContainer, autocompletionWs, request, response)
      },
      minLength: 3,
      select: (event, ui) => select(inputId, label, ui)
    })

  // Update done handler
  dialog.done = done

  // Update display value
  inputId.value = currentId
  inputPred.value = currentPred
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
