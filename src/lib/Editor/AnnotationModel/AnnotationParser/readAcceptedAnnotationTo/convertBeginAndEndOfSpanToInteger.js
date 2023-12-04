// If the begin or end value is a string,
// the comparison with other numbers cannot be done correctly.
export default function (typeSetting, denotation, block) {
  return [typeSetting.map(convert), denotation.map(convert), block.map(convert)]
}

function convert(src) {
  const { span } = src

  return {
    ...src,
    span: convertBeginAndEndToInteger(span)
  }
}

function convertBeginAndEndToInteger(span) {
  // You cannot generate a valid value for the ID of HTML element of span
  // from a begin or end that contains a decimal point.
  return { ...span, begin: parseInt(span.begin), end: parseInt(span.end) }
}
