import source from '../source'
import select from './select'
import customizeqQueryUiAutocomplete from '../customize-jquery-ui-autocomplete'

customizeqQueryUiAutocomplete()

export default function(typeDefinition, autocompletionWs, $value, $labelSpan) {
  if (typeDefinition && autocompletionWs) {
    $value.autocomplete({
      source: (request, response) => {
        $labelSpan.text('')
        source(typeDefinition, autocompletionWs, request.term, response)
      },
      minLength: 3,
      select: (_, ui) => select($value, $labelSpan, ui)
    })
  }
}
