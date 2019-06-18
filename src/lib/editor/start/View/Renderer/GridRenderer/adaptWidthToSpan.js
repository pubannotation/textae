export default function(gridElement, domPositionCache, spanId) {
    domPositionCache.reset()
    const spanPosition = domPositionCache.getSpan(spanId)
    gridElement.style.width = `${spanPosition.width}px`
}
