import commonValidate from '../commonValidate'
import SelectionWrapper from '../SelectionWrapper'

export default function(annotationData, spanConfig, selection) {
  // This order is important, because showAlertIfOtherSpan is show alert.
  return (
    new SelectionWrapper(selection).isFocusNodeInSpan() &&
    commonValidate(annotationData, spanConfig, selection)
  )
}
