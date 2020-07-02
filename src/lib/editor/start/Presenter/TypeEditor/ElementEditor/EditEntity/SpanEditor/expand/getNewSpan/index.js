import getNewExpandSpan from './getNewExpandSpan'
import Positions from '../../Positions'

export default function getNewSpan(
  annotationData,
  spanAdjuster,
  spanId,
  selection,
  spanConfig
) {
  const positions = new Positions(annotationData, selection)

  return getNewExpandSpan(
    annotationData,
    spanAdjuster,
    spanId,
    positions.anchor,
    positions.focus,
    spanConfig
  )
}
