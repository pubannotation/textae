import $ from 'jquery'
import searchTerm from '../searchTerm'
import select from './select'
import customizeqQueryUiAutocomplete from '../customize-jquery-ui-autocomplete'

customizeqQueryUiAutocomplete()

export default function(
  inputElement,
  labelSpan,
  autocompletionWs,
  getLocalData
) {
  $(inputElement).autocomplete({
    source: (request, response) => {
      labelSpan.innerText = ''
      searchTerm(
        autocompletionWs,
        getLocalData(request.term),
        request.term,
        response
      )
    },
    minLength: 3,
    select: (_, ui) => select(inputElement, labelSpan, ui)
  })
}
