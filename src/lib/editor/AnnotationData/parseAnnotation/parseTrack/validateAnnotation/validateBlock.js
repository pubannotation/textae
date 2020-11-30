import getSpanValidation from './getSpanValidation'

export default function (text, blocks, spans) {
  const [accept, errorMap] = getSpanValidation(blocks, text, spans)
    .and('uniqueID', (n) => blocks.filter((d) => d.id === n.id).length === 1)
    .and(
      'uniqueRange',
      ({ span }) =>
        blocks.filter(
          ({ span: otherSpan }) =>
            (span.begin === otherSpan.begin) & (span.end === otherSpan.end)
        ).length === 1
    )
    .validate()

  return {
    accept,
    reject: {
      wrongRange: errorMap.get('hasLength'),
      outOfText: errorMap.get('inText'),
      boundaryCrossingSpans: errorMap.get('isNotCrossing'),
      duplicatedID: errorMap.get('uniqueID'),
      duplicatedRange: errorMap.get('uniqueRange')
    },
    hasError: errorMap.size
  }
}
