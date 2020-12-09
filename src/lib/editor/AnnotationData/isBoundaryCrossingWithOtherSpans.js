import getBoundaryCrossingSpans from './getBoundaryCrossingSpans'

// A span its range is coross over with other spans are not able to rendered.
// Because spans are renderd with span tag. Html tags can not be cross over.
export default function (spans, begin, end) {
  console.assert(end !== undefined, 'end is necessary.')

  return (
    getBoundaryCrossingSpans(
      spans.map((span) => ({ span })),
      begin,
      end
    ).length > 0
  )
}
