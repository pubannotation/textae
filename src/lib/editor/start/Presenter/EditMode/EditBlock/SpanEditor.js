import clearTextSelection from '../clearTextSelection'
import hasCharacters from '../hasCharacters'
import getNewSpan from '../getNewSpan'
import expandSpan from '../expandSpan'
import shrinkSpan from '../shrinkSpan'

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
        if (selectionWrapper.ancestorBlockSpanOfFocusNode) {
          this._shrink(selectionWrapper)
        } else {
          this._expand(selectionWrapper)
        }

        return
      }

      // When you shrink a block containing the beginning or end of the text,
      // the anchor node is in the block.
      if (selectionWrapper.isParentOfFocusNodeBlockSpan) {
        const { anchor } = selectionWrapper.positionsOnAnnotation
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
      create(
        this._annotationData,
        this._commander,
        this._buttonController.spanAdjuster,
        selectionWrapper,
        this._spanConfig
      )
    }
    clearTextSelection()
  }

  _expand(selectionWrapper) {
    const spanId = selectionWrapper.ancestorBlockSpanOfAnchorNode.id

    expandSpan(
      this._selectionModel,
      this._annotationData,
      this._buttonController.spanAdjuster,
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
      this._buttonController.spanAdjuster,
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
}

function create(
  annotationData,
  commander,
  spanAdjuster,
  selectionWrapper,
  spanConfig
) {
  const { begin, end } = getNewSpan(
    annotationData,
    spanAdjuster,
    selectionWrapper,
    spanConfig
  )

  // The span cross exists spans.
  if (annotationData.span.isBoundaryCrossingWithOtherSpans(begin, end)) {
    return
  }

  if (annotationData.span.doesParentSpanExits(begin, end)) {
    return
  }

  const command = commander.factory.createBlockSpanCommand({
    begin,
    end
  })

  commander.invoke(command)
}
