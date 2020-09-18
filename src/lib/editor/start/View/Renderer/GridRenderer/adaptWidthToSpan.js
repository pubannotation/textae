export default function(gridElement, domPositionCache, spanId) {
  domPositionCache.removeAllSpan()
  domPositionCache.removeAllEntity()

  const spanPosition = domPositionCache.getSpan(spanId)
  gridElement.style.width = `${spanPosition.width}px`
}
