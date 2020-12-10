import clearTextSelection from '../clearTextSelection'
import DelimiterDetectAdjuster from '../DelimiterDetectAdjuster'
import hasCharacters from '../hasCharacters'
import getNewSpan from '../getNewSpan'

export default class SpanEditor {
  constructor(
    editor,
    annotationData,
    spanConfig,
    commander,
    buttonController,
    selectionModel
  ) {
    this._editor = editor
    this._annotationData = annotationData
    this._spanConfig = spanConfig
    this._commander = commander
    this._buttonController = buttonController
    this._selectionModel = selectionModel
  }

  editFor(selectionWrapper) {
    if (
      selectionWrapper.isParentOfAnchorNodeTextBox ||
      selectionWrapper.isParentOfAnchorNodeDenotationSpan ||
      selectionWrapper.isParentOfAnchorNodeStyleSpan
    ) {
      if (
        selectionWrapper.isParentOfFocusNodeTextBox ||
        selectionWrapper.isParentOfFocusNodeDenotationSpan ||
        selectionWrapper.isParentOfFocusNodeStyleSpan
      ) {
        this._create(selectionWrapper)
      }
    }

    clearTextSelection()
  }

  _create(selectionWrapper) {
    if (
      hasCharacters(this._annotationData, this._spanConfig, selectionWrapper)
    ) {
      this._selectionModel.clear()
      const { begin, end } = getNewSpan(
        this._annotationData,
        new DelimiterDetectAdjuster(),
        selectionWrapper,
        this._spanConfig
      )

      // The span cross exists spans.
      if (
        this._annotationData.span.isBoundaryCrossingWithOtherSpans(begin, end)
      ) {
        return
      }

      if (this._annotationData.span.doesParentSpanExits(begin, end)) {
        return
      }

      const command = this._commander.factory.createBlockSpanCommand({
        begin,
        end
      })

      this._commander.invoke(command)
    }
    clearTextSelection()
  }
}
