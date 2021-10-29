import getSpanValidation from './getSpanValidation'
import isIDUnique from './isIDUnique'

export default function (text, denotations, spanOfAllTracks, spans) {
  return getSpanValidation(denotations, text, spanOfAllTracks, 'denotations')
    .and('uniqueID', (n) => isIDUnique(spans, n))
    .validateAll()
}
