import getAnchorPosition from './getAnchorPosition'
import getFocusPosition from './getFocusPosition'

export default function(annotationData, selection) {
  const anchorPosition = getAnchorPosition(annotationData, selection)
  const focusPosition = getFocusPosition(annotationData, selection)
  return [anchorPosition, focusPosition]
}
