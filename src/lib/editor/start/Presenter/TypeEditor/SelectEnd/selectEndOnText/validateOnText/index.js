import commonValidate from '../../commonValidate'
import isFocusNodeInParagraph from './isFocusNodeInParagraph'

export default function(annotationData, spanConfig, selection) {
  // This order is important, because showAlertIfOtherSpan is show alert.
  return (
    isFocusNodeInParagraph(selection) &&
    commonValidate(annotationData, spanConfig, selection)
  )
}
