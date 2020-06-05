import commonValidate from './commonValidate'
import SelectionWrapper from '../../../ElementEditor/SelectionWrapper'

export default function(annotationData, spanConfig, selection) {
  // This order is important, because showAlertIfOtherSpan is show alert.
  return (
    new SelectionWrapper(selection).isFocusNodeInTextBox &&
    commonValidate(annotationData, spanConfig, selection)
  )
}
