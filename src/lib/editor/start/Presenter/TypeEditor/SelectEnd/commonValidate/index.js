import showAlertIfOtherParagraph from './showAlertIfOtherParagraph'
import getBeginEnd from '../getBeginEnd'
import hasSpanOrParagraphs from '../hasSpanOrParagraphs'
import getAnchorNodeParent from '../getAnchorNodeParent'

export default function commonValidate(annotationData, spanConfig, selection) {
  // This order is not important.
  return (
    showAlertIfOtherParagraph(selection) &&
    isAnchrNodeInSpanOrParagraph(selection) &&
    hasCharacters(annotationData, spanConfig, selection)
  )
}

function isAnchrNodeInSpanOrParagraph(selection) {
  return hasSpanOrParagraphs(getAnchorNodeParent(selection))
}

// A span cannot be created include nonEdgeCharacters only.
function hasCharacters(annotationData, spanConfig, selection) {
  if (!selection) return false

  const [begin, end] = getBeginEnd(annotationData, selection)
  const selectedString = annotationData.sourceDoc.substring(begin, end)
  const stringWithoutBlankCharacters = spanConfig.removeBlankChractors(
    selectedString
  )

  return stringWithoutBlankCharacters.length > 0
}
