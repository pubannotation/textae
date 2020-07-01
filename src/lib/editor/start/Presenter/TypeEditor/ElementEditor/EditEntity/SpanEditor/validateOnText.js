import SelectionWrapper from '../../../ElementEditor/SelectionWrapper'
import hasCharacters from './hasCharacters'

export default function(annotationData, spanConfig, selection) {
  const selectionWrapper = new SelectionWrapper(selection)

  return (
    selectionWrapper.isFocusNodeInTextBox &&
    selectionWrapper.isAnchrNodeInSpanOrTextBox &&
    hasCharacters(annotationData, spanConfig, selection)
  )
}
