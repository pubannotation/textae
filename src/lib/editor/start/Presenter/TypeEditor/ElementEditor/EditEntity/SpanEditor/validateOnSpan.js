import SelectionWrapper from '../../SelectionWrapper'
import hasCharacters from './hasCharacters'

export default function(annotationData, spanConfig, selection) {
  const selectionWrapper = new SelectionWrapper(selection)

  return (
    selectionWrapper.isFocusNodeInSpan &&
    selectionWrapper.isAnchrNodeInSpanOrTextBox &&
    hasCharacters(annotationData, spanConfig, selection)
  )
}
