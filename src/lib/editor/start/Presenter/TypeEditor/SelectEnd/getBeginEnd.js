import getAnchorPosition from './getAnchorPosition'
import getFocusPosition from './getFocusPosition'

export default function(annotationData, selection) {
  const anchorPosition = getAnchorPosition(annotationData, selection)
  const focusPosition = getFocusPosition(annotationData, selection)
  // switch the position when the selection is made from right to left
  if (anchorPosition > focusPosition) {
    return [focusPosition, anchorPosition]
  }
  return [anchorPosition, focusPosition]
}
