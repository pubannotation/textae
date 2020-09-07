import hasLength from './hasLength'
import isBeginAndEndIn from './isBeginAndEndIn'
import isNotSpanCrossing from './isNotSpanCrossing'
import ValidationResults from '../ValidationResults'

export default function(text, spans) {
  const resultHasLength = new ValidationResults(spans, hasLength)
  const resultInText = new ValidationResults(
    resultHasLength.acceptedNodes,
    (node) => isBeginAndEndIn(text, node.span)
  )
  const resultIsNotCrossing = new ValidationResults(
    resultInText.acceptedNodes,
    isNotSpanCrossing
  )
  const errorCount =
    resultHasLength.rejectedNodes.length +
    resultInText.rejectedNodes.length +
    resultIsNotCrossing.rejectedNodes.length

  return {
    accept: resultIsNotCrossing.acceptedNodes,
    reject: {
      hasLength: resultHasLength.rejectedNodes,
      inText: resultInText.rejectedNodes,
      isNotCrossing: resultIsNotCrossing.rejectedNodes
    },
    hasError: errorCount !== 0
  }
}
