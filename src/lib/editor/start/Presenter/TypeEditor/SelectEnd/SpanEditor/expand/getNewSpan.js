import getNewExpandSpan from './getNewExpandSpan'
import * as selectPosition from '../../selectPosition'

export default function getNewSpan(
  annotationData,
  spanAdjuster,
  spanId,
  selection,
  spanConfig
) {
  const anchorPosition = selectPosition.getAnchorPosition(
    annotationData,
    selection
  )
  const focusPosition = selectPosition.getFocusPosition(
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
