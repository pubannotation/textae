import getNewShortSpan from './getNewShortSpan'
import Positions from '../../Positions'

export default function getNewSpan(
  annotationData,
  spanAdjuster,
  spanId,
  selectionWrapper,
  spanConfig
) {
  const positions = new Positions(annotationData, selectionWrapper)
  return getNewShortSpan(
    annotationData,
    spanAdjuster,
    spanId,
    positions.anchor,
    positions.focus,
    spanConfig
  )
}
