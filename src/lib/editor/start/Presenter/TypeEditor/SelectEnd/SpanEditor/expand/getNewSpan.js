import getNewExpandSpan from './getNewExpandSpan'
import getAnchorPosition from '../../getAnchorPosition'
import getFocusPosition from '../../getFocusPosition'

export default function getNewSpan(
  annotationData,
  spanAdjuster,
  spanId,
  selection,
  spanConfig
) {
  const anchorPosition = getAnchorPosition(annotationData, selection)
  const focusPosition = getFocusPosition(annotationData, selection)
  return getNewExpandSpan(
    annotationData,
    spanAdjuster,
    spanId,
    anchorPosition,
    focusPosition,
    spanConfig
  )
}
