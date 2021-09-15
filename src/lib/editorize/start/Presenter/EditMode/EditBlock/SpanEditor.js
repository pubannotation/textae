import alertifyjs from 'alertifyjs'
import clearTextSelection from '../clearTextSelection'
import hasCharacters from '../hasCharacters'
import expandSpan from '../expandSpan'
import shrinkSpan from '../shrinkSpan'
import create from './create'
import SelectionWrapper from '../SelectionWrapper'
import validateNewBlockSpan from './validateNewBlockSpan'
import getRightSpanElement from '../../../../getRightSpanElement'

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

  expandForTouchDevice() {
    const expandedSpan = this._getExpandedSpanForTouchDevice()
    if (expandedSpan) {
      const { spanID, begin, end } = expandedSpan

      if (validateNewBlockSpan(this._annotationData, begin, end, spanID)) {
        this._commander.invoke(
          this._commander.factory.moveBlockSpanCommand(spanID, begin, end)
        )
      }
    }
  }

  shrinkForTouchDevice() {
    const shrinkedSpan = this._getShrinkedSpanForTouchDevice()
    if (shrinkedSpan) {
      const { spanId, begin, end } = shrinkedSpan
      const nextSpan = getRightSpanElement(this._editor, spanId)

      // The span cross exists spans.
      if (
        this._annotationData.span.isBoundaryCrossingWithOtherSpans(begin, end)
      ) {
        alertifyjs.warning(
          'A span cannot be modifyed to make a boundary crossing.'
        )
        return
      }

      // There is parant span.
      if (this._annotationData.span.hasParentOf(begin, end)) {
        return
      }

      const doesExists = this._annotationData.span.hasBlockSpan(begin, end)
      if (begin < end && !doesExists) {
        this._commander.invoke(
          this._commander.factory.moveBlockSpanCommand(spanId, begin, end)
        )
      } else {
        this._commander.invoke(
          this._commander.factory.removeSpanCommand(spanId)
        )
        if (nextSpan) {
          this._selectionModel.selectSpan(nextSpan.id)
        }
      }
    }
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

  _getExpandedSpanForTouchDevice() {
    const selectionWrapper = new SelectionWrapper(this._annotationData.span)

    // When there is no denotation span in ancestors of anchor node and focus node,
    // a span to expand does not exist.
    if (
      selectionWrapper.ancestorBlockSpanOfAnchorNode == null &&
      selectionWrapper.ancestorBlockSpanOfFocusNode == null
    ) {
      return null
    }

    // When you select text by mouse operation,
    // the anchor node of the selected string is always inside the span to be extended,
    // and the focus node is outside.
    if (
      selectionWrapper.parentOfFocusNode.contains(
        selectionWrapper.parentOfAnchorNode
      )
    ) {
      const spanID = selectionWrapper.parentOfAnchorNode.id

      return {
        spanID,
        ...this._annotationData.span
          .get(spanID)
          .getExpandedInAnchorNodeToFocusNodeDirection(
            this._buttonController.spanAdjuster,
            selectionWrapper,
            this._annotationData.sourceDoc,
            this._spanConfig
          )
      }
    }

    // On touch devices, the focus node of the selected string may be inside the span to be extended,
    // and the anchor node may be outside.
    if (
      selectionWrapper.parentOfAnchorNode.contains(
        selectionWrapper.parentOfFocusNode
      )
    ) {
      const spanID = selectionWrapper.parentOfFocusNode.id

      return {
        spanID,
        ...this._annotationData.span
          .get(spanID)
          .getExpandedInFocusNodeToAnchorNodeDirection(
            this._buttonController.spanAdjuster,
            selectionWrapper,
            this._annotationData.sourceDoc,
            this._spanConfig
          )
      }
    }
  }

  _getShrinkedSpanForTouchDevice() {
    const selectionWrapper = new SelectionWrapper(this._annotationData.span)

    // When there is no denotation span in ancestors of anchor node and focus node,
    // a span to shrink does not exist.
    if (
      selectionWrapper.ancestorBlockSpanOfAnchorNode == null &&
      selectionWrapper.ancestorBlockSpanOfFocusNode == null
    ) {
      return null
    }

    // When you select text by mouse operation,
    // the anchor node of the selected string is always inside the span to be extended,
    // and the focus node is outside.
    if (
      selectionWrapper.parentOfFocusNode.contains(
        selectionWrapper.parentOfAnchorNode
      )
    ) {
      return {
        spanId: selectionWrapper.parentOfAnchorNode.id,
        ...this._annotationData.span
          .get(selectionWrapper.parentOfAnchorNode.id)
          .getShortenInFocusNodeToAnchorNodeDirection(
            this._buttonController.spanAdjuster,
            selectionWrapper,
            this._annotationData.sourceDoc,
            this._spanConfig
          )
      }
    }

    // On touch devices, the focus node of the selected string may be inside the span to be extended,
    // and the anchor node may be outside.
    if (
      selectionWrapper.parentOfAnchorNode.contains(
        selectionWrapper.parentOfFocusNode
      )
    ) {
      return {
        spanId: selectionWrapper.parentOfFocusNode.id,
        ...this._annotationData.span
          .get(selectionWrapper.parentOfFocusNode.id)
          .getShotrenInAnchorNodeToFocusNodeDirection(
            this._buttonController.spanAdjuster,
            selectionWrapper,
            this._annotationData.sourceDoc,
            this._spanConfig
          )
      }
    }
  }
}
