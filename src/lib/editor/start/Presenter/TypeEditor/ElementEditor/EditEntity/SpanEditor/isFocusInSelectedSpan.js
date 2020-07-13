import Positions from './Positions'
import isInSelectedSpan from './isInSelectedSpan'

export default function(annotationData, selectionModel, selectionWrapper) {
  return isInSelectedSpan(
    selectionModel,
    new Positions(annotationData, selectionWrapper).focus
  )
}
