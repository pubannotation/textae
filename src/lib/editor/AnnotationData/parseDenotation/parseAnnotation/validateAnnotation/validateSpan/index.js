import hasLength from './hasLength'
import isBeginAndEndIn from './isBeginAndEndIn'
import Validation from '../Validation'
import IsNotCrossingValidation from './IsNotCrossingValidation'

export default function(text, spans) {
  const hasLengthValidation = new Validation(spans, hasLength)
  const inTextValidation = new Validation(
    hasLengthValidation.validNodes,
    (node) => isBeginAndEndIn(text, node.span)
  )
  const isNotCrossingValidation = new IsNotCrossingValidation(
    inTextValidation.validNodes
  )

  return {
    accept: isNotCrossingValidation.validNodes,
    reject: {
      hasLength: hasLengthValidation.invalidNodes,
      inText: inTextValidation.invalidNodes,
      isNotCrossing: isNotCrossingValidation.invalidNodes
    },
    hasError:
      hasLengthValidation.invalid ||
      inTextValidation.invalid ||
      isNotCrossingValidation.invalid
  }
}
