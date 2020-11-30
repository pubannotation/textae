import hasLength from './hasLength'
import isBeginAndEndIn from './isBeginAndEndIn'
import Validation from '../Validation'
import IsNotCrossingValidation from './IsNotCrossingValidation'
import ChainValidation from '../ChainValidation'
import isBoundaryCrossingWithOtherSpans from '../../../../isBoundaryCrossingWithOtherSpans'

export default function (text, targetSpans, allSpans) {
  const [accept, errorMap] = new ChainValidation(targetSpans)
    .and('hasLength', (n) => n.span.end - n.span.begin > 0)
    .and('inText', (n) => isBeginAndEndIn(text, n.span))
    .and(
      'isNotCrossing',
      (n) =>
        !isBoundaryCrossingWithOtherSpans(
          allSpans.map((s) => s.span),
          n.span.begin,
          n.span.end
        )
    )
    .validate()

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
    accept,
    reject: {
      wrongRange: errorMap.get('hasLength'),
      outOfText: errorMap.get('inText'),
      boundaryCrossingSpans: errorMap.get('isNotCrossing')
    },
    hasError: errorMap.size
  }
}
