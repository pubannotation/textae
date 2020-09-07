import hasLength from './hasLength'
import isBeginAndEndIn from './isBeginAndEndIn'
import isNotSpanCrossing from './isNotSpanCrossing'
import Validation from '../Validation'

export default function(text, spans) {
  const hasLengthValidation = new Validation(spans, hasLength)
  const inTextValidation = new Validation(
    hasLengthValidation.acceptedNodes,
    (node) => isBeginAndEndIn(text, node.span)
  )
  const isNotCrossingValidation = new Validation(
    inTextValidation.acceptedNodes,
    isNotSpanCrossing
  )
  const errorCount =
    hasLengthValidation.rejectedNodes.length +
    inTextValidation.rejectedNodes.length +
    isNotCrossingValidation.rejectedNodes.length

  return {
    accept: isNotCrossingValidation.acceptedNodes,
    reject: {
      hasLength: hasLengthValidation.rejectedNodes,
      inText: inTextValidation.rejectedNodes,
      isNotCrossing: isNotCrossingValidation.rejectedNodes
    },
    hasError: errorCount !== 0
  }
}
