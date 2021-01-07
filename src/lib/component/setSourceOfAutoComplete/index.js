import $ from 'jquery'
import searchTerm from '../searchTerm'
import customizeqQueryUiAutocomplete from '../customize-jquery-ui-autocomplete'

customizeqQueryUiAutocomplete()

export default function (
  inputElement,
  labelSpan,
  autocompletionWs,
  getLocalData
) {
  $(inputElement).autocomplete({
    source: (request, response) => {
      if (labelSpan) {
        labelSpan.innerText = ''
      }

      searchTerm(
        autocompletionWs,
        getLocalData(request.term),
        request.term,
        response
      )
    },
    minLength: 3,
    select: (_, ui) => {
      inputElement.value = ui.item.raw.id

      if (labelSpan) {
        labelSpan.innerText = ui.item.raw.label
      }

      return false
    }
  })
}
