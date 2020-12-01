import isBeginAndEndIn from './isBeginAndEndIn'
import ChainValidation from '../ChainValidation'
import getBoundaryCrossingSpans from '../../../../getBoundaryCrossingSpans'

export default function (targetSpans, text, allSpans) {
  return new ChainValidation(targetSpans)
    .and('hasLength', (n) => n.span.end - n.span.begin > 0)
    .and('inText', (n) => isBeginAndEndIn(text, n.span))
    .and(
      'isNotCrossing',
      (n) =>
        getBoundaryCrossingSpans(
          allSpans.map((s) => s.span),
          n.span.begin,
          n.span.end
        ).length === 0
    )
}
