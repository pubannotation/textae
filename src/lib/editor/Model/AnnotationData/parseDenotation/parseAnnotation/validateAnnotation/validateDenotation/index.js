import validate from '../validate'
import hasLength from './hasLength'
import isBeginAndEndIn from './isBeginAndEndIn'
import isInParagraph from './isInParagraph'
import isNotSpanCrossing from './isNotSpanCrossing'

export default function(text, paragraph, denotations) {
  const resultHasLength = validate(denotations, hasLength)
  const resultInText = validate(
    resultHasLength.acceptedNodes,
    isBeginAndEndIn,
    text
  )
  const resultInParagraph = validate(
    resultInText.acceptedNodes,
    isInParagraph,
    paragraph
  )
  const resultIsNotCrossing = validate(
    resultInParagraph.acceptedNodes,
    isNotSpanCrossing
  )
  const errorCount =
    resultHasLength.rejectedNodes.length +
    resultInText.rejectedNodes.length +
    resultInParagraph.rejectedNodes.length +
    resultIsNotCrossing.rejectedNodes.length

  return {
    accept: resultIsNotCrossing.acceptedNodes,
    reject: {
      hasLength: resultHasLength.rejectedNodes,
      inText: resultInText.rejectedNodes,
      inParagraph: resultInParagraph.rejectedNodes,
      isNotCrossing: resultIsNotCrossing.rejectedNodes
    },
    hasError: errorCount !== 0
  }
}
