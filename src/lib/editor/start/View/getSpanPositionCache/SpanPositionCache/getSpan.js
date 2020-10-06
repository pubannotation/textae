import round from '../../round'

export default function(editor, spanId) {
  const span = editor[0].querySelector(`#${spanId}`)

  if (!span) {
    throw new Error(`span is not renderd : ${spanId}`)
  }

  // An element.offsetTop and element.offsetLeft does not work in the Firefox,
  // when much spans are loaded like http://pubannotation.org/docs/sourcedb/PMC/sourceid/1315279/divs/10/annotations.json.
  const spanBox = span.getBoundingClientRect()
  const textBox = span.offsetParent.offsetParent.getBoundingClientRect()

  // The value of getBoundingClientRect may contain 13 decimal places.
  // It's too fine to use as a style attribute,
  // so I'll round it to 2 decimal places,
  // which is below the rounding accuracy of Google Chrome and Firefox.
  return {
    top: round(spanBox.top - textBox.top),
    left: round(spanBox.left - textBox.left),
    width: round(span.offsetWidth)
  }
}
