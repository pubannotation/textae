import isBeginAndEndIn from './isBeginAndEndIn'
import ChainValidation from '../ChainValidation'
import getBoundaryCrossingSpans from '../../../../getBoundaryCrossingSpans'

export default function (targetSpans, text, allSpans, sourcePropertyName) {
  return new ChainValidation(targetSpans, sourcePropertyName)
    .and('hasLength', (n) => n.span.end - n.span.begin > 0)
    .and('inText', (n) => isBeginAndEndIn(text, n.span))
    .and('isNotCrossing', (n) => {
      const bondaryCrossingSpans = getBoundaryCrossingSpans(
        allSpans,
        n.span.begin,
        n.span.end
      )
      return [bondaryCrossingSpans.length === 0, bondaryCrossingSpans]
    })
}
