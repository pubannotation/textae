import $ from 'jquery'
import searchTerm from './searchTerm'
import customizeqQueryUiAutocomplete from './customize-jquery-ui-autocomplete'

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
        if (labelSpan instanceof HTMLInputElement) {
          labelSpan.value = ''
        } else {
          labelSpan.innerText = ''
        }
      }

      searchTerm(
        autocompletionWs,
        getLocalData(request.term),
        request.term,
        response
      )
    },
    minLength: 3,
    select: (_, { item }) => {
      inputElement.value = item.id

      console.log(123)
      if (labelSpan) {
        if (labelSpan instanceof HTMLInputElement) {
          labelSpan.value = item.label
        } else {
          labelSpan.innerText = item.label
        }
      }

      return false
    }
  })
}
