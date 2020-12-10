import getNewExpandSpan from './getNewExpandSpan'
import Positions from '../../Positions'

export default function getNewSpan(
  annotationData,
  spanAdjuster,
  spanId,
  selectionWrapper,
  spanConfig
) {
  const positions = new Positions(annotationData.span, selectionWrapper)

  return getNewExpandSpan(
    annotationData,
    spanAdjuster,
    spanId,
    positions.anchor,
    positions.focus,
    spanConfig
  )
}
