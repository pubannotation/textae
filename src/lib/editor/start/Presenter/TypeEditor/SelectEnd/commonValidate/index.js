import hasCharacters from './hasCharacters'
import SelectionWrapper from '../SelectionWrapper'

export default function(annotationData, spanConfig, selection) {
  const selectionWrapper = new SelectionWrapper(selection)

  // This order is not important.
  return (
    selectionWrapper.showAlertIfOtherParagraph() &&
    selectionWrapper.isAnchrNodeInSpanOrParagraph() &&
    hasCharacters(annotationData, spanConfig, selection)
  )
}
