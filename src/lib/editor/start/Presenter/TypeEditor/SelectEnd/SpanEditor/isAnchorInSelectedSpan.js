import isInSelectedSpan from './isInSelectedSpan'
import getAnchorPosition from '../getAnchorPosition'

export default function(annotationData, selectionModel, selection) {
  return isInSelectedSpan(
    annotationData,
    selectionModel,
    getAnchorPosition(annotationData, selection)
  )
}
