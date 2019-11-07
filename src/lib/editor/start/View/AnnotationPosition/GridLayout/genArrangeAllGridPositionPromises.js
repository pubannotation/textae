import arrangeGridPositionPromise from './arrangeGridPositionPromise'

export default function(domPositionCache, annotationData, typeGap) {
  // Cache all span position because alternating between getting offset and setting offset.
  domPositionCache.cacheAllSpan(annotationData.span.all)

  return annotationData.span.all.map((span) =>
    arrangeGridPositionPromise(domPositionCache, annotationData, typeGap, span)
  )
}
