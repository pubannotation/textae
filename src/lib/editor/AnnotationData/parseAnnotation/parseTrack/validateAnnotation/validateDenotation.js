import getSpanValidation from './getSpanValidation'
import UniqueIDValidation from './UniqueIDValidation'
import validateSpan from './validateSpan'

export default function (text, denotations, spans) {
  const [accept, errorMap] = getSpanValidation(denotations, text, spans)
    .and(
      'uniqueID',
      (n) => denotations.filter((d) => d.id === n.id).length === 1
    )
    .validate()

  const result = validateSpan(text, denotations, spans)
  const uniqIDValidation = new UniqueIDValidation(result.accept)

  return {
    accept,
    reject: {
      wrongRange: errorMap.get('hasLength'),
      outOfText: errorMap.get('inText'),
      boundaryCrossingSpans: errorMap.get('isNotCrossing'),
      duplicatedID: errorMap.get('uniqueID')
    },
    hasError: errorMap.size
  }
}
