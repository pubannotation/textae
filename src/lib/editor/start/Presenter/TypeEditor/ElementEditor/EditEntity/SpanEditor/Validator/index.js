import hasCharacters from './hasCharacters'

export default class {
  constructor(annotationData, spanConfig) {
    this._annotationData = annotationData
    this._spanConfig = spanConfig
  }

  validateOnText(selectionWrapper) {
    return (
      selectionWrapper.isFocusNodeInTextBox &&
      selectionWrapper.isAnchrNodeInSpanOrStyleSpanOrTextBox &&
      hasCharacters(this._annotationData, this._spanConfig, selectionWrapper)
    )
  }

  validateOnSpan(selectionWrapper) {
    return (
      selectionWrapper.isFocusNodeInSpan &&
      selectionWrapper.isAnchrNodeInSpanOrTextBox &&
      hasCharacters(this._annotationData, this._spanConfig, selectionWrapper)
    )
  }

  validateOnStyleSpan(selectionWrapper) {
    return (
      selectionWrapper.isFocusNodeInStyleSpan &&
      selectionWrapper.isAnchrNodeInStyleSpanOrTextBox &&
      hasCharacters(this._annotationData, this._spanConfig, selectionWrapper)
    )
  }
}
