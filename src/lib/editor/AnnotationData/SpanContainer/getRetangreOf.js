// An element.offsetTop and element.offsetLeft does not work in the Firefox,
// when much spans are loaded like http://pubannotation.org/docs/sourcedb/PMC/sourceid/1315279/divs/10/annotations.json.
export default function(spanElement) {
  const rectOfSpan = spanElement.getBoundingClientRect()
  const rectOfTextBox = spanElement.offsetParent.offsetParent.getBoundingClientRect()

  return {
    top: rectOfSpan.top - rectOfTextBox.top,
    left: rectOfSpan.left - rectOfTextBox.left,
    width: rectOfSpan.width
  }
}
