import getNewExpandSpan from './getNewExpandSpan'

export default function getNewSpan(
  annotationData,
  spanAdjuster,
  spanId,
  selectionWrapper,
  spanConfig
) {
  const positionsOnAnnotation = selectionWrapper.getPositionsOnAnnotation(
    annotationData.span
  )

  return getNewExpandSpan(
    annotationData,
    spanAdjuster,
    spanId,
    positionsOnAnnotation.anchor,
    positionsOnAnnotation.focus,
    spanConfig
  )
}
