import getSpanValidation from './getSpanValidation'
import UniqueIDValidation from './UniqueIDValidation'
import validateSpan from './validateSpan'
import Validation from './Validation'

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

  const result = validateSpan(text, blocks, spans)
  const uniqIDValidation = new UniqueIDValidation(result.accept)
  const uniqRangeValidation = new Validation(
    uniqIDValidation.validNodes,
    ({ span }) =>
      uniqIDValidation.validNodes.filter(
        ({ span: otherSpan }) =>
          (span.begin === otherSpan.begin) & (span.end === otherSpan.end)
      ).length === 1
  )

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
