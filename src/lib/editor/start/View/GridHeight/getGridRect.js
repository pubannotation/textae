export default function(span) {
  console.assert(span.element, 'span is not renderd')
  const spanElement = span.element

  // An element.offsetTop and element.offsetLeft does not work in the Firefox,
  // when much spans are loaded like http://pubannotation.org/docs/sourcedb/PMC/sourceid/1315279/divs/10/annotations.json.
  const spanBox = spanElement.getBoundingClientRect()
  const textBox = span.root.element.getBoundingClientRect()

  return {
    top: spanBox.top - textBox.top,
    left: spanBox.left - textBox.left,
    width: spanElement.offsetWidth
  }
}
