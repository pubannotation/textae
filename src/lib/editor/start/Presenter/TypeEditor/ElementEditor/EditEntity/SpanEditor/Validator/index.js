import SelectionWrapper from '../../../SelectionWrapper'
import hasCharacters from './hasCharacters'

export default class {
  constructor(annotationData, spanConfig) {
    this._annotationData = annotationData
    this._spanConfig = spanConfig
  }

  validateOnText(selection) {
    const selectionWrapper = new SelectionWrapper(selection)

    return (
      selectionWrapper.isFocusNodeInTextBox &&
      selectionWrapper.isAnchrNodeInSpanOrTextBox &&
      hasCharacters(this._annotationData, this._spanConfig, selection)
    )
  }

  validateOnSpan(selection) {
    const selectionWrapper = new SelectionWrapper(selection)

    return (
      selectionWrapper.isFocusNodeInSpan &&
      selectionWrapper.isAnchrNodeInSpanOrTextBox &&
      hasCharacters(this._annotationData, this._spanConfig, selection)
    )
  }
}
