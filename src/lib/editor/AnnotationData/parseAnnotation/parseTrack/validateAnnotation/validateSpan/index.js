import getSpanValidation from '../getSpanValidation'

export default function (text, targetSpans, allSpans) {
  const [accept, errorMap] = getSpanValidation(
    targetSpans,
    text,
    allSpans
  ).validate()

  return {
    accept,
    reject: {
      wrongRange: errorMap.get('hasLength'),
      outOfText: errorMap.get('inText'),
      boundaryCrossingSpans: errorMap.get('isNotCrossing')
    },
    hasError: errorMap.size
  }
}
