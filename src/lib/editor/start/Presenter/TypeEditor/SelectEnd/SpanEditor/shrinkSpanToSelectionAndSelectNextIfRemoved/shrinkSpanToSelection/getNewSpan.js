import getNewShortSpan from './getNewShortSpan'
import getAnchorPosition from '../../../getAnchorPosition'
import getFocusPosition from '../../../getFocusPosition'

export default function getNewSpan(
  annotationData,
  spanAdjuster,
  spanId,
  selection,
  spanConfig
) {
  const anchorPosition = getAnchorPosition(annotationData, selection)
  const focusPosition = getFocusPosition(annotationData, selection)
  return getNewShortSpan(
    annotationData,
    spanAdjuster,
    spanId,
    anchorPosition,
    focusPosition,
    spanConfig
  )
}
