import arrangeGridPositionPromise from './arrangeGridPositionPromise'

export default function(domPositionCache, typeContainer, annotationData, typeGap) {
  return annotationData.span.all()
    // There is at least one type in span that has a grid.
    .filter((span) => span.getTypes().length > 0)
    .map((span) => {
      // Cache all span position because alternating between getting offset and setting offset.
      domPositionCache.getSpan(span.id)
      return span
    })
    .map((span) => arrangeGridPositionPromise(domPositionCache, typeContainer, annotationData, typeGap, span))
}
