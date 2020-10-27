export default function(textBox, span) {
  console.assert(span.element, 'span is not renderd')
  const spanElement = span.element

  // An element.offsetTop and element.offsetLeft does not work in the Firefox,
  // when much spans are loaded like http://pubannotation.org/docs/sourcedb/PMC/sourceid/1315279/divs/10/annotations.json.
  const rectOfSpan = spanElement.getBoundingClientRect()
  const rectOfTextBox = textBox.boundingClientRect

  return {
    top: rectOfSpan.top - rectOfTextBox.top,
    left: rectOfSpan.left - rectOfTextBox.left,
    width: spanElement.offsetWidth
  }
}
