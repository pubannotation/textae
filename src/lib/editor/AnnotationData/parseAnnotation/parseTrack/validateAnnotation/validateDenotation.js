import getSpanValidation from './getSpanValidation'
import isIDUnique from './isIDUnique'

export default function (text, denotations, spans) {
  return getSpanValidation(denotations, text, spans)
    .and('uniqueID', (n) => isIDUnique(spans, n))
    .validate()
}
