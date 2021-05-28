import clearTextSelection from '../clearTextSelection'
import DelimiterDetectAdjuster from '../DelimiterDetectAdjuster'
import hasCharacters from '../hasCharacters'
import getNewSpan from '../getNewSpan'
import expandSpan from '../expandSpan'
import shrinkSpan from '../EditDenotation/SpanEditor/shrinkSpan'
import PositionsOnAnnotation from '../PositionsOnAnnotation'
import BlankSkipAdjuster from '../EditDenotation/SpanEditor/BlankSkipAdjuster'

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
        this._create(selectionWrapper)
        return
      }

      if (
        selectionWrapper.isParentOfFocusNodeDenotationSpan ||
        selectionWrapper.isParentOfFocusNodeStyleSpan
      ) {
        if (selectionWrapper.ancestorBlockSpanOfFocusNode) {
          this._shrink(selectionWrapper)
        } else {
          this._create(selectionWrapper)
        }

        return
      }

      if (selectionWrapper.isParentOfFocusNodeBlockSpan) {
        this._shrink(selectionWrapper)
        return
      }
    }

    if (
      selectionWrapper.isParentOfAnchorNodeDenotationSpan ||
      selectionWrapper.isParentOfAnchorNodeStyleSpan
    ) {
      if (
        selectionWrapper.isParentOfFocusNodeTextBox ||
        selectionWrapper.isParentOfFocusNodeDenotationSpan ||
        selectionWrapper.isParentOfFocusNodeStyleSpan
      ) {
        if (selectionWrapper.ancestorBlockSpanOfAnchorNode) {
          if (selectionWrapper.doesFitInOneBlockSpan) {
            // Shrink if the selection fits into a single block span.
            this._shrink(selectionWrapper)
          } else {
            // Expand when the selection exceeds a single block span.
            this._expand(selectionWrapper)
          }
        } else if (selectionWrapper.ancestorBlockSpanOfFocusNode) {
          this._shrink(selectionWrapper)
        } else {
          this._create(selectionWrapper)
        }

        return
      }

      // When collapsing a block containing the beginning or end of the text,
      // and also when the beginning or end of the text is a denotation or style span,
      // the anchor node is within the denotation or style span.
      if (selectionWrapper.isParentOfFocusNodeBlockSpan) {
        this._shrink(selectionWrapper)
        return
      }
    }

    if (selectionWrapper.isParentOfAnchorNodeBlockSpan) {
      if (
        selectionWrapper.isParentOfFocusNodeTextBox ||
        selectionWrapper.isParentOfFocusNodeDenotationSpan ||
        selectionWrapper.isParentOfFocusNodeStyleSpan
      ) {
        this._expand(selectionWrapper)
        return
      }

      // When you shrink a block containing the beginning or end of the text,
      // the anchor node is in the block.
      if (selectionWrapper.isParentOfFocusNodeBlockSpan) {
        const { anchor } = new PositionsOnAnnotation(
          this._annotationData.span,
          selectionWrapper
        )
        const blockSpanOnFocus = this._annotationData.span.get(
          selectionWrapper.parentOfFocusNode.id
        )

        // Shrink the block span
        // only when the anchor position matches the begin or end position of the block span.
        if (
          anchor === blockSpanOnFocus.begin ||
          anchor === blockSpanOnFocus.end
        ) {
          this._shrink(selectionWrapper)
          return
        }
      }
    }

    clearTextSelection()
  }

  _create(selectionWrapper) {
    if (
      hasCharacters(this._annotationData, this._spanConfig, selectionWrapper)
    ) {
      this._selectionModel.removeAll()
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

  _expand(selectionWrapper) {
    const spanId = selectionWrapper.ancestorBlockSpanOfAnchorNode.id

    expandSpan(
      this._selectionModel,
      this._annotationData,
      new DelimiterDetectAdjuster(),
      spanId,
      selectionWrapper,
      this._spanConfig,
      (begin, end) => {
        this._commander.invoke(
          this._commander.factory.moveBlockSpanCommand(spanId, begin, end)
        )
      }
    )

    clearTextSelection()
  }

  _shrink(selectionWrapper) {
    const spanId = selectionWrapper.ancestorBlockSpanOfFocusNode.id

    shrinkSpan(
      this._editor,
      this._annotationData,
      this._selectionModel,
      this._commander,
      new DelimiterDetectAdjuster(),
      spanId,
      selectionWrapper,
      this._spanConfig,
      (begin, end) => {
        this._commander.invoke(
          this._commander.factory.moveBlockSpanCommand(spanId, begin, end)
        )
      }
    )

    clearTextSelection()
  }

  get _spanAdjuster() {
    return this._buttonController.valueOf('boundary-detection')
      ? new DelimiterDetectAdjuster()
      : new BlankSkipAdjuster()
  }
}
