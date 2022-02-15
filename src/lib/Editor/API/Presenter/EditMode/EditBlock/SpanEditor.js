import alertifyjs from 'alertifyjs'
import clearTextSelection from '../clearTextSelection'
import hasCharacters from '../hasCharacters'
import shrinkSpan from '../shrinkSpan'
import create from './create'
import SelectionWrapper from '../SelectionWrapper'
import validateNewBlockSpan from './validateNewBlockSpan'
import getRightSpanElement from '../../../../getRightSpanElement'

export default class SpanEditor {
  constructor(
    editorHTMLElement,
    annotationData,
    spanConfig,
    commander,
    buttonController,
    selectionModel
  ) {
    this._editorHTMLElement = editorHTMLElement
    this._annotationData = annotationData
    this._spanConfig = spanConfig
    this._commander = commander
    this._buttonController = buttonController
    this._selectionModel = selectionModel
  }

  /**
   *
   * @param {SelectionWrapper} selectionWrapper
   */
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
            const { anchor, focus } = selectionWrapper.positionsOnAnnotation

            const spanOnAnchor = this._annotationData.span.get(
              selectionWrapper.parentOfAnchorNode.id
            )
            const blockSpanOnAnchor = this._annotationData.span.get(
              selectionWrapper.ancestorBlockSpanOfAnchorNode.id
            )

            if (anchor < focus) {
              if (spanOnAnchor.begin === blockSpanOnAnchor.begin) {
                this._shrink(selectionWrapper)
              } else {
                clearTextSelection()
              }
            } else {
              if (spanOnAnchor.end === blockSpanOnAnchor.end) {
                this._shrink(selectionWrapper)
              } else {
                clearTextSelection()
              }
            }
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

  cerateSpanForTouchDevice() {
    const selectionWrapper = new SelectionWrapper(this._annotationData.span)

    if (selectionWrapper.isParentOfBothNodesTextBox) {
      this._create(selectionWrapper)
    }
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
      const { spanID, begin, end } = shrinkedSpan
      const nextSpan = getRightSpanElement(this._editorHTMLElement, spanID)

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
      if (this._annotationData.span.hasParentOf(begin, end, spanID)) {
        return
      }

      const doesExists = this._annotationData.span.hasBlockSpan(begin, end)
      if (begin < end && !doesExists) {
        this._commander.invoke(
          this._commander.factory.moveBlockSpanCommand(spanID, begin, end)
        )
      } else {
        this._commander.invoke(
          this._commander.factory.removeSpanCommand(spanID)
        )
        if (nextSpan) {
          this._selectionModel.selectSpan(nextSpan.id)
        }
      }
    }
  }

  _create(selectionWrapper) {
    if (
      hasCharacters(
        this._annotationData.sourceDoc,
        this._spanConfig,
        selectionWrapper
      )
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
    const spanID = selectionWrapper.ancestorBlockSpanOfAnchorNode.id

    this._selectionModel.removeAll()

    const { begin, end } = this._annotationData.span
      .get(spanID)
      .getExpandedInAnchorNodeToFocusNodeDirection(
        this._buttonController.spanAdjuster,
        selectionWrapper,
        this._annotationData.sourceDoc,
        this._spanConfig
      )

    if (validateNewBlockSpan(this._annotationData, begin, end, spanID)) {
      this._commander.invoke(
        this._commander.factory.moveBlockSpanCommand(spanID, begin, end)
      )
    }

    clearTextSelection()
  }

  _shrink(selectionWrapper) {
    const spanID = selectionWrapper.ancestorBlockSpanOfFocusNode.id

    shrinkSpan(
      this._editorHTMLElement,
      this._annotationData.span,
      this._annotationData.sourceDoc,
      this._selectionModel,
      this._commander,
      this._buttonController.spanAdjuster,
      spanID,
      selectionWrapper,
      this._spanConfig,
      (begin, end) => {
        this._commander.invoke(
          this._commander.factory.moveBlockSpanCommand(spanID, begin, end)
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

    // On mobile devices,
    // do not shrink the block span when the selected text fits into one block span.
    if (
      selectionWrapper.parentOfAnchorNode === selectionWrapper.parentOfFocusNode
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
      const spanID = selectionWrapper.parentOfFocusNode.id

      return {
        spanID,
        ...this._annotationData.span
          .get(spanID)
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
