import getSpanValidation from './getSpanValidation'

export default function (text, blocks, spans) {
  return getSpanValidation(blocks, text, spans)
    .and('uniqueID', (n) => blocks.filter((d) => d.id === n.id).length === 1)
    .and(
      'uniqueRange',
      ({ span }) =>
        blocks.filter(
          ({ span: otherSpan }) =>
            (span.begin === otherSpan.begin) & (span.end === otherSpan.end)
        ).length === 1
    )
    .validate()
}
