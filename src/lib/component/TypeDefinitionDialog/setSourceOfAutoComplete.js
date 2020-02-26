import $ from 'jquery'
import customizeqQueryUiAutocomplete from '../customize-jquery-ui-autocomplete'
import searchTerm from '../searchTerm'
import select from './select'

customizeqQueryUiAutocomplete()

export default function(el, autocompletionWs, getLocalData) {
  const inputs = el.querySelectorAll('input')

  // Update the source
  $(inputs[0]).autocomplete({
    source: (request, response) =>
      searchTerm(
        autocompletionWs,
        getLocalData(request.term),
        request.term,
        response
      ),
    minLength: 3,
    select: (_, ui) => select(inputs[0], inputs[1], ui)
  })

  $(inputs[1]).autocomplete({
    source: (request, response) =>
      searchTerm(
        autocompletionWs,
        getLocalData(request.term),
        request.term,
        response
      ),
    minLength: 3,
    select: (_, ui) => select(inputs[0], inputs[1], ui)
  })
}
