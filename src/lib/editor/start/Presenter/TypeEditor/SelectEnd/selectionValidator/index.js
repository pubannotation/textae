import * as hasClass from '../hasClass'
import * as getParent from '../getParent'
import commonValidate from './commonValidate'

export { validateOnText, validateOnSpan }

function validateOnText(annotationData, spanConfig, selection) {
  // This order is important, because showAlertIfOtherSpan is show alert.
  return (
    isFocusNodeInParagraph(selection) &&
    commonValidate(annotationData, spanConfig, selection)
  )
}

function validateOnSpan(annotationData, spanConfig, selection) {
  // This order is important, because showAlertIfOtherSpan is show alert.
  return (
    isFocusNodeInSpan(selection) &&
    commonValidate(annotationData, spanConfig, selection)
  )
}

function isFocusNodeInParagraph(selection) {
  return hasClass.hasParagraphs(getParent.getFocusNodeParent(selection))
}

function isFocusNodeInSpan(selection) {
  return hasClass.hasSpan(getParent.getFocusNodeParent(selection))
}
