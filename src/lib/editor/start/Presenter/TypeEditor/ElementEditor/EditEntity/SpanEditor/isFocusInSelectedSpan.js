import Positions from './Positions'
import isInSelectedSpan from './isInSelectedSpan'

export default function(annotationData, selectionModel, selection) {
  return isInSelectedSpan(
    annotationData,
    selectionModel,
    new Positions(annotationData, selection).focus
  )
}
