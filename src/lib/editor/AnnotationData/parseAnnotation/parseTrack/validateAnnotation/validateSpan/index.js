import hasLength from './hasLength'
import isBeginAndEndIn from './isBeginAndEndIn'
import Validation from '../Validation'
import IsNotCrossingValidation from './IsNotCrossingValidation'

export default function (text, targetSpans, allSpans) {
  const hasLengthValidation = new Validation(targetSpans, hasLength)
  const inTextValidation = new Validation(
    hasLengthValidation.validNodes,
    (node) => isBeginAndEndIn(text, node.span)
  )
  const crossValidation = new IsNotCrossingValidation(
    inTextValidation.validNodes,
    allSpans
  )

  return {
    accept: crossValidation.validNodes,
    reject: {
      wrongRange: hasLengthValidation.invalidNodes,
      outOfText: inTextValidation.invalidNodes,
      boundaryCrossingSpans: crossValidation.invalidNodes
    },
    hasError:
      hasLengthValidation.invalid ||
      inTextValidation.invalid ||
      crossValidation.invalid
  }
}
