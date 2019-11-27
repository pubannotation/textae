import customizeqQueryUiAutocomplete from '../customize-jquery-ui-autocomplete'
import source from '../source'
import select from './select'

customizeqQueryUiAutocomplete()

export default function($dialog, typeDefinition, autocompletionWs) {
  const $inputs = $dialog.find('input')
  // Update the source
  $inputs.eq(0).autocomplete({
    source: (request, response) => {
      source(typeDefinition, autocompletionWs, request.term, response)
    },
    minLength: 3,
    select: (_, ui) => select($inputs.eq(0), $inputs.eq(1), ui)
  })
  $inputs.eq(1).autocomplete({
    source: (request, response) => {
      source(typeDefinition, autocompletionWs, request.term, response)
    },
    minLength: 3,
    select: (_, ui) => select($inputs.eq(0), $inputs.eq(1), ui)
  })
}
