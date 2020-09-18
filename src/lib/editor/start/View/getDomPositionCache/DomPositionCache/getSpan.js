export default function(editor, spanId) {
  const span = editor[0].querySelector(`#${spanId}`)

  if (!span) {
    throw new Error(`span is not renderd : ${spanId}`)
  }

  // An element.offsetTop and element.offsetLeft does not work in the Firefox,
  // when much spans are loaded like http://pubannotation.org/docs/sourcedb/PMC/sourceid/1315279/divs/10/annotations.json.
  const spanBox = span.getBoundingClientRect()
  const textBox = span.offsetParent.offsetParent.getBoundingClientRect()

  return {
    top: spanBox.top - textBox.top,
    left: spanBox.left - textBox.left,
    width: span.offsetWidth,
    height: span.offsetHeight,
    center: span.offsetLeft + span.offsetWidth / 2
  }
}
