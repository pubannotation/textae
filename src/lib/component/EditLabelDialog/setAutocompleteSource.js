import source from '../source'
import select from './select'

export default function(typeDefinition, autocompletionWs, $value, $labelSpan) {
  if (typeDefinition && autocompletionWs) {
    $value
      .autocomplete({
        source: (request, response) => {
          $labelSpan.text('')
          source(typeDefinition, autocompletionWs, request, response)
        },
        minLength: 3,
        select: (_, ui) => select($value, $labelSpan, ui)
      })
  }
}
