// If the begin or end value is a string,
// the comparison with other numbers cannot be done correctly.
// You cannot generate a valid value for the ID of HTML element of span
// from a begin or end that contains a decimal point.
export default function (acceptedAnnotation) {
  const typeSetting = acceptedAnnotation.typeSetting.map((src) => ({
    ...src,
    span: convert(src.span)
  }))

  const denotation = acceptedAnnotation.denotation.map((src) => ({
    ...src,
    span: convert(src.span)
  }))

  const block = acceptedAnnotation.block.map((src) => ({
    ...src,
    span: convert(src.span)
  }))

  return { ...acceptedAnnotation, typeSetting, denotation, block }
}
function convert(span) {
  return { ...span, begin: parseInt(span.begin), end: parseInt(span.end) }
}
