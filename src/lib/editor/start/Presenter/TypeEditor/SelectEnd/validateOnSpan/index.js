import commonValidate from '../commonValidate'
import isFocusNodeInSpan from './isFocusNodeInSpan'

export default function(annotationData, spanConfig, selection) {
  // This order is important, because showAlertIfOtherSpan is show alert.
  return (
    isFocusNodeInSpan(selection) &&
    commonValidate(annotationData, spanConfig, selection)
  )
}
