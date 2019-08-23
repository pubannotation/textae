import arrangeGridPositionPromise from './arrangeGridPositionPromise'

export default function(
  domPositionCache,
  typeDefinition,
  annotationData,
  typeGap
) {
  // Cache all span position because alternating between getting offset and setting offset.
  for (const span of annotationData.span.all) {
    domPositionCache.getSpan(span.id)
  }

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
