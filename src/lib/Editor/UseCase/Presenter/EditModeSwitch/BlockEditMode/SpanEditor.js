import alertifyjs from 'alertifyjs'
import clearTextSelection from '../clearTextSelection'
import shrinkSpan from '../shrinkSpan'
import create from './create'
import SelectionWrapper from '../SelectionWrapper'
import getRightSpanElement from '../../../../getRightSpanElement'

export default class SpanEditor {
  #editorHTMLElement
  #annotationModel
  #spanConfig
  #commander
  #menuState
  #selectionModel

  constructor(
    editorHTMLElement,
    annotationModel,
    spanConfig,
    commander,
    menuState,
    selectionModel
  ) {
    this.#editorHTMLElement = editorHTMLElement
    this.#annotationModel = annotationModel
    this.#spanConfig = spanConfig
    this.#commander = commander
    this.#menuState = menuState
    this.#selectionModel = selectionModel
  }

  editFor() {
    const selectionWrapper = new SelectionWrapper()

    if (selectionWrapper.isParentOfAnchorNodeTextBox) {
      if (selectionWrapper.isParentOfFocusNodeTextBox) {
        this.#create()
        return
      }

      if (
        selectionWrapper.isParentOfFocusNodeDenotationSpan ||
        selectionWrapper.isParentOfFocusNodeStyleSpan
      ) {
        if (selectionWrapper.ancestorBlockSpanOfFocusNode) {
          this.#shrink(selectionWrapper)
        } else {
          this.#create()
        }

        return
      }

      if (selectionWrapper.isParentOfFocusNodeBlockSpan) {
        this.#shrink(selectionWrapper)
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
            const { anchor, focus } = this.#annotationModel.textSelection

            const spanOnAnchor = this.#annotationModel.getSpan(
              selectionWrapper.parentOfAnchorNode.id
            )
            const blockSpanOnAnchor = this.#annotationModel.getSpan(
              selectionWrapper.ancestorBlockSpanOfAnchorNode.id
            )

            if (
              anchor < focus &&
              spanOnAnchor.begin === blockSpanOnAnchor.begin
            ) {
              this.#shrink(selectionWrapper)
            } else if (
              focus < anchor &&
              spanOnAnchor.end === blockSpanOnAnchor.end
            ) {
              this.#shrink(selectionWrapper)
            } else {
              clearTextSelection()
            }
          } else {
            // Expand when the selection exceeds a single block span.
            this.#expand(selectionWrapper)
          }
        } else if (selectionWrapper.ancestorBlockSpanOfFocusNode) {
          this.#shrink(selectionWrapper)
        } else {
          this.#create()
        }

        return
      }

      // When collapsing a block containing the beginning or end of the text,
      // and also when the beginning or end of the text is a denotation or style span,
      // the anchor node is within the denotation or style span.
      if (selectionWrapper.isParentOfFocusNodeBlockSpan) {
        this.#shrink(selectionWrapper)
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
          this.#shrink(selectionWrapper)
        } else {
          this.#expand(selectionWrapper)
        }

        return
      }

      // When you shrink a block containing the beginning or end of the text,
      // the anchor node is in the block.
      if (selectionWrapper.isParentOfFocusNodeBlockSpan) {
        const { anchor } = this.#annotationModel.textSelection
        const blockSpanOnFocus = this.#annotationModel.getSpan(
          selectionWrapper.parentOfFocusNode.id
        )

        // Shrink the block span
        // only when the anchor position matches the begin or end position of the block span.
        if (
          anchor === blockSpanOnFocus.begin ||
          anchor === blockSpanOnFocus.end
        ) {
          this.#shrink(selectionWrapper)
          return
        }
      }
    }

    clearTextSelection()
  }

  cerateSpanForTouchDevice() {
    const selectionWrapper = new SelectionWrapper()

    if (selectionWrapper.isParentOfBothNodesTextBox) {
      this.#create()
    }
  }

  expandForTouchDevice() {
    const expandedSpan = this.#getExpandedSpanForTouchDevice()
    if (expandedSpan) {
      const { spanID, begin, end } = expandedSpan

      if (this.#annotationModel.validateNewBlockSpan(begin, end, spanID)) {
        this.#commander.invoke(
          this.#commander.factory.moveBlockSpanCommand(spanID, begin, end)
        )
      }
    }
  }

  shrinkForTouchDevice() {
    const shrunkenSpan = this.#getShrunkenSpanForTouchDevice()
    if (shrunkenSpan) {
      const { spanID, begin, end } = shrunkenSpan
      const nextSpan = getRightSpanElement(this.#editorHTMLElement, spanID)

      // The span cross exists spans.
      if (
        this.#annotationModel.spanInstanceContainer.isBoundaryCrossingWithOtherSpans(
          begin,
          end
        )
      ) {
        alertifyjs.warning(
          'A span cannot be modified to make a boundary crossing.'
        )
        return
      }

      // There is parent span.
      if (
        this.#annotationModel.spanInstanceContainer.hasParentOf(
          begin,
          end,
          spanID
        )
      ) {
        return
      }

      const doesExists = this.#annotationModel.spanInstanceContainer.find(
        'block',
        begin,
        end
      )
      if (begin < end && !doesExists) {
        this.#commander.invoke(
          this.#commander.factory.moveBlockSpanCommand(spanID, begin, end)
        )
      } else {
        this.#commander.invoke(
          this.#commander.factory.removeSpanCommand(spanID)
        )
        if (nextSpan) {
          this.#selectionModel.selectSpan(nextSpan.id)
        }
      }
    }
  }

  #create() {
    if (this.#annotationModel.hasCharacters(this.#spanConfig)) {
      this.#selectionModel.removeAll()
      create(
        this.#annotationModel,
        this.#commander,
        this.#menuState.textSelectionAdjuster,
        this.#spanConfig
      )
    }
    clearTextSelection()
  }

  #expand(selectionWrapper) {
    const spanID = selectionWrapper.ancestorBlockSpanOfAnchorNode.id

    this.#selectionModel.removeAll()

    const { begin, end } = this.#annotationModel.spanInstanceContainer
      .get(spanID)
      .getExpandedInAnchorNodeToFocusNodeDirection(
        this.#menuState.textSelectionAdjuster,
        this.#annotationModel.sourceDoc,
        this.#annotationModel.spanInstanceContainer,
        this.#spanConfig
      )

    if (this.#annotationModel.validateNewBlockSpan(begin, end, spanID)) {
      this.#commander.invoke(
        this.#commander.factory.moveBlockSpanCommand(spanID, begin, end)
      )
    }

    clearTextSelection()
  }

  #shrink(selectionWrapper) {
    const spanID = selectionWrapper.ancestorBlockSpanOfFocusNode.id

    shrinkSpan(
      this.#editorHTMLElement,
      this.#annotationModel,
      this.#annotationModel.sourceDoc,
      this.#selectionModel,
      this.#commander,
      this.#menuState.textSelectionAdjuster,
      spanID,
      this.#spanConfig,
      (begin, end) => {
        this.#commander.invoke(
          this.#commander.factory.moveBlockSpanCommand(spanID, begin, end)
        )
      }
    )

    clearTextSelection()
  }

  #getExpandedSpanForTouchDevice() {
    const selectionWrapper = new SelectionWrapper()

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
        ...this.#annotationModel.spanInstanceContainer
          .get(spanID)
          .getExpandedInAnchorNodeToFocusNodeDirection(
            this.#menuState.textSelectionAdjuster,
            this.#annotationModel.sourceDoc,
            this.#annotationModel.spanInstanceContainer,
            this.#spanConfig
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
        ...this.#annotationModel.spanInstanceContainer
          .get(spanID)
          .getExpandedInFocusNodeToAnchorNodeDirection(
            this.#menuState.textSelectionAdjuster,
            this.#annotationModel.sourceDoc,
            this.#annotationModel.spanInstanceContainer,
            this.#spanConfig
          )
      }
    }
  }

  #getShrunkenSpanForTouchDevice() {
    const selectionWrapper = new SelectionWrapper()

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
        ...this.#annotationModel.spanInstanceContainer
          .get(spanID)
          .getShortenInFocusNodeToAnchorNodeDirection(
            this.#menuState.textSelectionAdjuster,
            this.#annotationModel.sourceDoc,
            this.#annotationModel.spanInstanceContainer,
            this.#spanConfig
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
        ...this.#annotationModel.spanInstanceContainer
          .get(spanID)
          .getShortenInAnchorNodeToFocusNodeDirection(
            this.#menuState.textSelectionAdjuster,
            this.#annotationModel.sourceDoc,
            this.#annotationModel.spanInstanceContainer,
            this.#spanConfig
          )
      }
    }
  }
}
