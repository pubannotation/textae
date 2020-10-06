export default function(span) {
  const spanElement = span.element

  const parent = spanElement.parentNode

  // Move the textNode wrapped this span in front of this span.
  while (spanElement.firstChild) {
    parent.insertBefore(spanElement.firstChild, spanElement)
  }

  parent.removeChild(spanElement)
  parent.normalize()

  // Block span has a background element.
  if (span.backgroundElement) {
    span.backgroundElement.remove()
  }
}
