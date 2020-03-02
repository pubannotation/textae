import showAlertIfOtherParagraph from './showAlertIfOtherParagraph'
import hasCharacters from './hasCharacters'
import SelectionWrapper from '../SelectionWrapper'

export default function commonValidate(annotationData, spanConfig, selection) {
  const selectionWrapper = new SelectionWrapper(selection)

  // This order is not important.
  return (
    showAlertIfOtherParagraph(selectionWrapper) &&
    selectionWrapper.isAnchrNodeInSpanOrParagraph() &&
    hasCharacters(annotationData, spanConfig, selection)
  )
}
