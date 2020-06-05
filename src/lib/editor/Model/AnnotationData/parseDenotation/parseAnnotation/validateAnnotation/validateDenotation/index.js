import validate from '../validate'
import hasLength from './hasLength'
import isBeginAndEndIn from './isBeginAndEndIn'
import isNotSpanCrossing from './isNotSpanCrossing'

export default function(text, denotations) {
  const resultHasLength = validate(denotations, hasLength)
  const resultInText = validate(
    resultHasLength.acceptedNodes,
    isBeginAndEndIn,
    text
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
