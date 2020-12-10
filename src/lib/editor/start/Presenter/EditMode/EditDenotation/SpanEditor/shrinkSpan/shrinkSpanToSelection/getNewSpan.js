import getNewShortSpan from './getNewShortSpan'
import PositionsOnAnnotation from '../../../../PositionsOnAnnotation'

export default function getNewSpan(
  annotationData,
  spanAdjuster,
  spanId,
  selectionWrapper,
  spanConfig
) {
  const positionsOnAnnotation = new PositionsOnAnnotation(
    annotationData.span,
    selectionWrapper
  )
  return getNewShortSpan(
    annotationData,
    spanAdjuster,
    spanId,
    positionsOnAnnotation.anchor,
    positionsOnAnnotation.focus,
    spanConfig
  )
}
