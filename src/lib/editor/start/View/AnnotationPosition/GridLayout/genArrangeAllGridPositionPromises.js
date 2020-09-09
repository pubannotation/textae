import arrangeGridPositionPromise from './arrangeGridPositionPromise'

export default function(domPositionCache, annotationData, gridHeight) {
  // Cache all span position because alternating between getting offset and setting offset.
  domPositionCache.cacheAllSpan(annotationData.span.allSpansWithGrid)

  return annotationData.span.allSpansWithGrid.map((span) =>
    arrangeGridPositionPromise(
      domPositionCache,
      annotationData,
      gridHeight,
      span
    )
  )
}
