// If the begin or end value is a string, the comparison with other numbers cannot be done correctly.
// You cannot generate a valid value for the ID of Dom of span from a begin or end that contains a decimal point.
export default function(span) {
  return Object.assign({}, span, {
    begin: parseInt(span.begin),
    end: parseInt(span.end)
  })
}
