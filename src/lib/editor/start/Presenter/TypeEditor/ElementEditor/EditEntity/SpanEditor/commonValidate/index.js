import hasCharacters from './hasCharacters'
import SelectionWrapper from '../../../../ElementEditor/SelectionWrapper'

export default function(annotationData, spanConfig, selection) {
  const selectionWrapper = new SelectionWrapper(selection)

  // This order is not important.
  return (
    selectionWrapper.isAnchrNodeInSpanOrTextBox &&
    hasCharacters(annotationData, spanConfig, selection)
  )
}
