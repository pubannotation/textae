import getNewExpandSpan from './getNewExpandSpan'

export default function getNewSpan(
  annotationData,
  spanAdjuster,
  spanId,
  selectionWrapper,
  spanConfig
) {
  const positionsOnAnnotation = selectionWrapper.getPositionsOnAnnotation()

  return getNewExpandSpan(
    annotationData,
    spanAdjuster,
    spanId,
    positionsOnAnnotation.anchor,
    positionsOnAnnotation.focus,
    spanConfig
  )
}
