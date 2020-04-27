import getNewShortSpan from './getNewShortSpan'
import Positions from '../../Positions'

export default function getNewSpan(
  annotationData,
  spanAdjuster,
  spanId,
  selection,
  spanConfig
) {
  const positions = new Positions(annotationData, selection)
  return getNewShortSpan(
    annotationData,
    spanAdjuster,
    spanId,
    positions.anchor,
    positions.focus,
    spanConfig
  )
}
