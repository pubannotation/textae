import getNewExpandSpan from './getNewExpandSpan'
import getPositions from '../../getPositions'

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

  return getNewExpandSpan(
    annotationData,
    spanAdjuster,
    spanId,
    anchorPosition,
    focusPosition,
    spanConfig
  )
}
