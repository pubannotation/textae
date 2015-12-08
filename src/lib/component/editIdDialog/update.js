import source from './source'

export default function(dialog, input, label, typeContainer, autocompletionWs, done, currentId) {
  // Update the source
  $(input).autocomplete({
    source: (request, response) => source(typeContainer, autocompletionWs, request, response),
    minLength: 2,
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
  label.innerText = ui.item.raw.label

  return false
}
