import clearTextSelection from '../../clearTextSelection'
import DelimiterDetectAdjuster from '../EditEntity/SpanEditor/DelimiterDetectAdjuster'
import hasCharacters from '../EditEntity/SpanEditor/hasCharacters'
import getNewSpan from '../EditEntity/SpanEditor/create/getNewSpan'

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
    if (selectionWrapper.isParentOfAnchorNodeTextBox) {
      if (selectionWrapper.isParentOfFocusNodeTextBox) {
        this._create(this._editor, selectionWrapper)
      }
    }

    clearTextSelection()
  }

  _create(editor, selectionWrapper) {
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

      // The span exists already.
      if (this._annotationData.span.hasDenotationSpan(begin, end)) {
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
