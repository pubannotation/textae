// If the begin or end value is a string,
// the comparison with other numbers cannot be done correctly.
// You cannot generate a valid value for the ID of HTML element of span
// from a begin or end that contains a decimal point.
export default function (typeSetting, denotation, block) {
  return [
    typeSetting.map((src) => ({
      ...src,
      span: convert(src.span)
    })),
    denotation.map((src) => ({
      ...src,
      span: convert(src.span)
    })),
    block.map((src) => ({
      ...src,
      span: convert(src.span)
    }))
  ]
}

function convert(span) {
  return { ...span, begin: parseInt(span.begin), end: parseInt(span.end) }
}
