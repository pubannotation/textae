import getSpanValidation from './getSpanValidation'

export default function (text, denotations, spans) {
  const [accept, errorMap] = getSpanValidation(denotations, text, spans)
    .and(
      'uniqueID',
      (n) => denotations.filter((d) => d.id === n.id).length === 1
    )
    .validate()

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
