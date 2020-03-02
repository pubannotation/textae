import showAlertIfOtherParagraph from './showAlertIfOtherParagraph'
import isAnchrNodeInSpanOrParagraph from './isAnchrNodeInSpanOrParagraph'
import hasCharacters from './hasCharacters'

export default function commonValidate(annotationData, spanConfig, selection) {
  // This order is not important.
  return (
    showAlertIfOtherParagraph(selection) &&
    isAnchrNodeInSpanOrParagraph(selection) &&
    hasCharacters(annotationData, spanConfig, selection)
  )
}
