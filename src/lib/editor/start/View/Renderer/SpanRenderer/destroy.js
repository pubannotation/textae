export default function(spanId) {
  const spanElement = document.querySelector('#' + spanId)
  const parent = spanElement.parentNode

  // Move the textNode wrapped this span in front of this span.
  while (spanElement.firstChild) {
    parent.insertBefore(spanElement.firstChild, spanElement)
  }

  parent.removeChild(spanElement)
  parent.normalize()
}
