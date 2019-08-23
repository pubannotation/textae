import arrangeGridPositionPromise from './arrangeGridPositionPromise'

export default function(
  domPositionCache,
  typeDefinition,
  annotationData,
  typeGap
) {
  // Cache all span position because alternating between getting offset and setting offset.
  domPositionCache.cacheAllSpan(annotationData.span.all)

  return annotationData.span.all.map((span) =>
    arrangeGridPositionPromise(
      domPositionCache,
      typeDefinition,
      annotationData,
      typeGap,
      span
    )
  )
}
