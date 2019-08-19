import getNewShortSpan from './getNewShortSpan'
import * as selectPosition from '../../../selectPosition'

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
  return getNewShortSpan(
    annotationData,
    spanAdjuster,
    spanId,
    anchorPosition,
    focusPosition,
    spanConfig
  )
}
