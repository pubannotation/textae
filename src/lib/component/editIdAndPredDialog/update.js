import source from '../source'
import customizeqQueryUiAutocomplete from '../editIdDialog/customize-jquery-ui-autocomplete'
import $ from 'jquery'

customizeqQueryUiAutocomplete()

export default function(dialog, inputPred, inputValue, label, typeContainer, autocompletionWs, done, currentPred, currentValue) {
  // Update the source
  $(inputValue)
    .autocomplete({
      source: (request, response) => {
        label.innerText = ''
        source(typeContainer, autocompletionWs, request, response)
      },
      minLength: 3,
      select: (event, ui) => select(inputValue, label, ui)
    })

  // Update done handler
  dialog.done = done

  // Update display value
  inputPred.value = currentPred
  inputValue.value = currentValue
  if (typeContainer.getLabel(currentValue)) {
    label.innerText = typeContainer.getLabel(currentValue)
  } else {
    label.innerText = ''
  }
}

function select(input, label, ui) {
  input.value = ui.item.raw.id
  label.innerHTML = ui.item.raw.label

  return false
}
