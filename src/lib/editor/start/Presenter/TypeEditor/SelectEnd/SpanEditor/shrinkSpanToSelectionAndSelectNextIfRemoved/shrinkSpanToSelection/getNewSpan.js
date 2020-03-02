import getNewShortSpan from './getNewShortSpan'
import getPositions from '../../../getPositions'

export default function getNewSpan(
  annotationData,
  spanAdjuster,
  spanId,
  selection,
  spanConfig
) {
  const [anchorPosition, focusPosition] = getPositions(
    annotationData,
    selection
  )
  return getNewShortSpan(
    annotationData,
    spanAdjuster,
    spanId,
    anchorPosition,
    focusPosition,
    spanConfig
  )
}
