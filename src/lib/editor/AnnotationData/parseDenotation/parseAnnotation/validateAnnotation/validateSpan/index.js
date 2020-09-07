import validate from '../validate'
import hasLength from './hasLength'
import isBeginAndEndIn from './isBeginAndEndIn'
import isNotSpanCrossing from './isNotSpanCrossing'

export default function(text, spans) {
  const resultHasLength = validate(spans, hasLength)
  const resultInText = validate(resultHasLength.acceptedNodes, (node) =>
    isBeginAndEndIn(text, node.span)
  )
  const resultIsNotCrossing = validate(
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
