import hasLength from './hasLength'
import isBeginAndEndIn from './isBeginAndEndIn'
import Validation from '../Validation'

export default function(text, spans) {
  const hasLengthValidation = new Validation(spans, hasLength)
  const inTextValidation = new Validation(
    hasLengthValidation.validNodes,
    (node) => isBeginAndEndIn(text, node.span)
  )

  return {
    accept: inTextValidation.validNodes,
    reject: {
      hasLength: hasLengthValidation.invalidNodes,
      inText: inTextValidation.invalidNodes
    },
    hasError: hasLengthValidation.invalid || inTextValidation.invalid
  }
}
