import hasLength from './hasLength'
import isBeginAndEndIn from './isBeginAndEndIn'
import isNotSpanCrossing from './isNotSpanCrossing'
import Validation from '../Validation'

export default function(text, spans) {
  const hasLengthValidation = new Validation(spans, hasLength)
  const inTextValidation = new Validation(
    hasLengthValidation.validNodes,
    (node) => isBeginAndEndIn(text, node.span)
  )
  const isNotCrossingValidation = new Validation(
    inTextValidation.validNodes,
    isNotSpanCrossing
  )
  const errorCount =
    hasLengthValidation.invalidNodes.length +
    inTextValidation.invalidNodes.length +
    isNotCrossingValidation.invalidNodes.length

  return {
    accept: isNotCrossingValidation.validNodes,
    reject: {
      hasLength: hasLengthValidation.invalidNodes,
      inText: inTextValidation.invalidNodes,
      isNotCrossing: isNotCrossingValidation.invalidNodes
    },
    hasError: errorCount !== 0
  }
}
