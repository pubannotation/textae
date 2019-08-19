import isInSelectedSpan from './isInSelectedSpan'
import getFocusPosition from '../getFocusPosition'

export default function(annotationData, selectionModel, selection) {
  return isInSelectedSpan(
    annotationData,
    selectionModel,
    getFocusPosition(annotationData, selection)
  )
}
