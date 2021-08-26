import getSpanValidation from './getSpanValidation'
import isIDUnique from './isIDUnique'

export default function (text, blocks, spans) {
  return getSpanValidation(blocks, text, spans, 'blocks')
    .and('uniqueID', (n) => isIDUnique(spans, n))
    .and(
      'uniqueRange',
      ({ span }) =>
        blocks.filter(
          ({ span: otherSpan }) =>
            (span.begin === otherSpan.begin) & (span.end === otherSpan.end)
        ).length === 1
    )
    .validateAll()
}
