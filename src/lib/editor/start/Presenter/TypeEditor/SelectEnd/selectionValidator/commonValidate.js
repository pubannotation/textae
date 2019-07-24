import showAlertIfOtherParagraph from './showAlertIfOtherParagraph'
import * as hasClass from '../hasClass'
import * as getParent from '../getParent'
import * as selectPosition from '../selectPosition'

export default function commonValidate(annotationData, spanConfig, selection) {
  // This order is not important.
  return (
    showAlertIfOtherParagraph(selection) &&
    isAnchrNodeInSpanOrParagraph(selection) &&
    hasCharacters(annotationData, spanConfig, selection)
  )
}

function isAnchrNodeInSpanOrParagraph(selection) {
  return hasClass.hasSpanOrParagraphs(getParent.getAnchorNodeParent(selection))
}

// A span cannot be created include nonEdgeCharacters only.
function hasCharacters(annotationData, spanConfig, selection) {
  if (!selection) return false

  var [begin, end] = selectPosition.getBeginEnd(annotationData, selection),
    selectedString = annotationData.sourceDoc.substring(begin, end),
    stringWithoutBlankCharacters = spanConfig.removeBlankChractors(
      selectedString
    )

  return stringWithoutBlankCharacters.length > 0
}
