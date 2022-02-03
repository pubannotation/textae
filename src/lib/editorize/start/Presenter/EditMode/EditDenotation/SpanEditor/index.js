import alertifyjs from 'alertifyjs'
import clearTextSelection from '../../clearTextSelection'
import create from './create'
import shrinkSpan from '../../shrinkSpan'
import hasCharacters from '../../hasCharacters'
import getIsDelimiterFunc from '../../../getIsDelimiterFunc'
import SelectionWrapper from '../../SelectionWrapper'
import isPositionBetweenSpan from './isPositionBetweenSpan'
import getRightSpanElement from '../../../../../getRightSpanElement'
import validateNewDennotationSpan from './validateNewDennotationSpan'

export default class SpanEditor {
  constructor(
    editorHTMLElemnt,
    annotationData,
    selectionModel,
    commander,
    buttonController,
    spanConfig
  ) {
    this._editorHTMLElement = editorHTMLElemnt
    this._annotationData = annotationData
    this._selectionModel = selectionModel
    this._commander = commander
    this._buttonController = buttonController
    this._spanConfig = spanConfig
  }

  editFor(selectionWrapper) {
    if (selectionWrapper.isParentOfAnchorNodeTextBox) {
      if (selectionWrapper.isParentOfFocusNodeTextBox) {
        this._anchorNodeInTextBoxFocusNodeInTextBox(selectionWrapper)
        return
      }
      if (selectionWrapper.isParentOfFocusNodeDenotationSpan) {
        this._anchorNodeInTextBoxFocusNodeInDenotationSpan(selectionWrapper)
        return
      }
      if (selectionWrapper.isParentOfFocusNodeBlockSpan) {
        this._anchorNodeInTextBoxFocusNodeInBlockSpan(selectionWrapper)
        return
      }
      if (selectionWrapper.isParentOfFocusNodeStyleSpan) {
        this._anchorNodeInTextBoxFocusNodeInStyleSpan(selectionWrapper)
        return
      }
    }
    if (selectionWrapper.isParentOfAnchorNodeDenotationSpan) {
      if (selectionWrapper.isParentOfFocusNodeTextBox) {
        this._anchorNodeInDenotationSpanFocusNodeInTextBox(selectionWrapper)
        return
      }
      if (selectionWrapper.isParentOfFocusNodeDenotationSpan) {
        this._anchorNodeInDenotationSpanFocusNodeInDenotationSpan(
          selectionWrapper
        )
        return
      }
      if (selectionWrapper.isParentOfFocusNodeBlockSpan) {
        this._anchorNodeInDenotationSpanFocusNodeInBlockSpan(selectionWrapper)
        return
      }
      if (selectionWrapper.isParentOfFocusNodeStyleSpan) {
        this._anchorNodeInDenotationSpanFocusNodeInStyleSpan(selectionWrapper)
        return
      }
    }
    if (selectionWrapper.isParentOfAnchorNodeBlockSpan) {
      if (selectionWrapper.isParentOfFocusNodeTextBox) {
        this._anchorNodeInBlockSpanFocusNodeInTextBox(selectionWrapper)
        return
      }
      if (selectionWrapper.isParentOfFocusNodeDenotationSpan) {
        this._anchorNodeInBlockSpanFocusNodeInDenotationSpan(selectionWrapper)
        return
      }
      if (selectionWrapper.isParentOfFocusNodeBlockSpan) {
        this._anchorNodeInBlockSpanFocusNodeInBlockSpan(selectionWrapper)
        return
      }
      if (selectionWrapper.isParentOfFocusNodeStyleSpan) {
        this._anchorNodeInBlockSpanFocusNodeInStyleSpan(selectionWrapper)
        return
      }
    }
    if (selectionWrapper.isParentOfAnchorNodeStyleSpan) {
      if (selectionWrapper.isParentOfFocusNodeTextBox) {
        this._anchorNodeInStyleSpanFocusNodeInTextBox(selectionWrapper)
        return
      }
      if (selectionWrapper.isParentOfFocusNodeDenotationSpan) {
        this._anchorNodeInStyleSpanFocusNodeInDenotationSpan(selectionWrapper)
        return
      }
      if (selectionWrapper.isParentOfFocusNodeBlockSpan) {
        this._anchorNodeInStyleSpanFocusNodeInBlockSpan(selectionWrapper)
        return
      }
      if (selectionWrapper.isParentOfFocusNodeStyleSpan) {
        this._anchorNodeInStyleSpanFocusNodeInStyleSpan(selectionWrapper)
        return
      }
    }
  }

  cerateSpanForTouchDevice() {
    const selectionWrapper = new SelectionWrapper(this._annotationData.span)

    if (selectionWrapper.isParentOfBothNodesSame) {
      this._create(selectionWrapper)
    }
  }

  expandForTouchDevice() {
    const expandedSpan = this._getExpandedSpanForTouchDevice()
    if (expandedSpan) {
      const { spanID, begin, end } = expandedSpan

      // The span cross exists spans.
      if (
        this._annotationData.span.isBoundaryCrossingWithOtherSpans(begin, end)
      ) {
        return
      }

      // A span cannot be expanded a span to the same as an existing span.
      if (this._annotationData.span.hasDenotationSpan(begin, end)) {
        return
      }

      this._commander.invoke(
        this._commander.factory.moveDenotationSpanCommand(spanID, begin, end)
      )
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
          'A span cannot be shrinked to make a boundary crossing.'
        )
        return
      }

      const doesExists = this._annotationData.span.hasDenotationSpan(begin, end)
      if (begin < end && !doesExists) {
        this._commander.invoke(
          this._commander.factory.moveDenotationSpanCommand(spanID, begin, end)
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

  _getExpandedSpanForTouchDevice() {
    const selectionWrapper = new SelectionWrapper(this._annotationData.span)

    // When there is no denotation span in ancestors of anchor node and focus node,
    // a span to expand does not exist.
    if (
      selectionWrapper.ancestorDenotationSpanOfAnchorNode == null &&
      selectionWrapper.ancestorDenotationSpanOfFocusNode == null
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
      const spanID = selectionWrapper.ancestorDenotationSpanOfAnchorNode.id

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
      const spanID = selectionWrapper.ancestorDenotationSpanOfFocusNode.id

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
      selectionWrapper.ancestorDenotationSpanOfAnchorNode == null &&
      selectionWrapper.ancestorDenotationSpanOfFocusNode == null
    ) {
      return null
    }

    // On mobile devices,
    // do not shrink the denotation span when the selected text fits into one denotation span.
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
      const spanID = selectionWrapper.ancestorDenotationSpanOfAnchorNode.id

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
      const spanID = selectionWrapper.ancestorDenotationSpanOfFocusNode.id

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

  _anchorNodeInTextBoxFocusNodeInTextBox(selectionWrapper) {
    // The parent of the focusNode is the text.
    this._create(selectionWrapper)
  }

  _anchorNodeInTextBoxFocusNodeInDenotationSpan(selectionWrapper) {
    const targetSpanID = this._getShrinkableSpanID(selectionWrapper)
    if (targetSpanID) {
      this._shrink(selectionWrapper, targetSpanID)
      return
    }

    clearTextSelection()
  }

  _anchorNodeInTextBoxFocusNodeInBlockSpan() {
    clearTextSelection()
  }

  _anchorNodeInTextBoxFocusNodeInStyleSpan(selectionWrapper) {
    // There is a Span between the StyleSpan and the text.
    // Shrink Span when mousedown on the text or a span and mouseup on the styleSpan.
    const targetSpanID = this._getShrinkableSpanID(selectionWrapper)
    if (targetSpanID) {
      this._shrink(selectionWrapper, targetSpanID)
      return
    }

    this._create(selectionWrapper)
  }

  _anchorNodeInDenotationSpanFocusNodeInTextBox(selectionWrapper) {
    this._expand(selectionWrapper, selectionWrapper.parentOfAnchorNode.id)
  }

  _anchorNodeInDenotationSpanFocusNodeInDenotationSpan(selectionWrapper) {
    const shrinkableEndSpanID = this._getShrinkableEndSpanID(selectionWrapper)
    if (shrinkableEndSpanID) {
      this._shrink(selectionWrapper, shrinkableEndSpanID)
      return
    }

    // The anchor node and the focus node are in the same span.
    if (selectionWrapper.isParentOfBothNodesSame) {
      this._create(selectionWrapper)
      return
    }

    const shrinkTargetSpanID = this._getShrinkableSpanID(selectionWrapper)
    if (shrinkTargetSpanID) {
      this._shrink(selectionWrapper, shrinkTargetSpanID)
      return
    }

    // Mouse down on the child DenotationSpan
    // and mouse up on the sibling DenotationSpan of the parent DenotationSpan
    // to expand the the child DenotationSpan.
    // The condition for this is that the ancestor of the anchor node
    // and the ancestor of the focus node are the same.
    // Since this is always true, it will always expand when it is neither create nor shrink.
    this._expand(selectionWrapper, selectionWrapper.parentOfAnchorNode.id)
  }

  _anchorNodeInDenotationSpanFocusNodeInBlockSpan(selectionWrapper) {
    if (
      selectionWrapper.parentOfFocusNode.contains(
        selectionWrapper.parentOfAnchorNode
      )
    ) {
      this._expand(selectionWrapper, selectionWrapper.parentOfAnchorNode.id)
      return
    }

    clearTextSelection()
  }

  _anchorNodeInDenotationSpanFocusNodeInStyleSpan(selectionWrapper) {
    const shrinkTargetEndSpanID = this._getShrinkableEndSpanID(selectionWrapper)
    if (shrinkTargetEndSpanID) {
      this._shrink(selectionWrapper, shrinkTargetEndSpanID)
      return
    }

    if (
      selectionWrapper.parentOfAnchorNode ===
      selectionWrapper.ancestorDenotationSpanOfFocusNode
    ) {
      this._create(selectionWrapper)
      return
    }

    const expandTargetSpanID = this._getExpandableSpanID(selectionWrapper)
    if (expandTargetSpanID) {
      this._expand(selectionWrapper, expandTargetSpanID)
      return
    }

    const shrinkTargetSpanID = this._getShrinkableSpanID(selectionWrapper)
    if (shrinkTargetSpanID) {
      this._shrink(selectionWrapper, shrinkTargetSpanID)
      return
    }
  }

  _anchorNodeInBlockSpanFocusNodeInTextBox() {
    clearTextSelection()
  }

  _anchorNodeInBlockSpanFocusNodeInDenotationSpan(selectionWrapper) {
    const shrinkTargetSpanID = this._getShrinkableSpanID(selectionWrapper)
    if (shrinkTargetSpanID) {
      this._shrink(selectionWrapper, shrinkTargetSpanID)
      return
    }

    clearTextSelection()
  }

  _anchorNodeInBlockSpanFocusNodeInBlockSpan(selectionWrapper) {
    this._create(selectionWrapper)
  }

  _anchorNodeInBlockSpanFocusNodeInStyleSpan(selectionWrapper) {
    const shrinkTargetSpanID = this._getShrinkableSpanID(selectionWrapper)
    if (shrinkTargetSpanID) {
      this._shrink(selectionWrapper, shrinkTargetSpanID)
      return
    }

    clearTextSelection()
  }

  _anchorNodeInStyleSpanFocusNodeInTextBox(selectionWrapper) {
    // If the anchor node is a style span but has a parent span, extend the parent span.
    if (selectionWrapper.ancestorDenotationSpanOfAnchorNode) {
      const spanID = selectionWrapper.ancestorDenotationSpanOfAnchorNode.id

      if (spanID) {
        this._expand(selectionWrapper, spanID)
      }
      return
    }

    this._create(selectionWrapper)
  }

  _anchorNodeInStyleSpanFocusNodeInDenotationSpan(selectionWrapper) {
    const shrinkTargetEndSpanID = this._getShrinkableEndSpanID(selectionWrapper)
    if (shrinkTargetEndSpanID) {
      this._shrink(selectionWrapper, shrinkTargetEndSpanID)
      return
    }

    if (
      selectionWrapper.ancestorDenotationSpanOfAnchorNode ===
      selectionWrapper.parentOfFocusNode
    ) {
      this._create(selectionWrapper)
      return
    }

    const shrinkTargetSpanID = this._getShrinkableSpanID(selectionWrapper)
    if (shrinkTargetSpanID) {
      this._shrink(selectionWrapper, shrinkTargetSpanID)
      return
    }

    const expandTargetSpanID = this._getExpandableSpanID(selectionWrapper)
    if (expandTargetSpanID) {
      this._expand(selectionWrapper, expandTargetSpanID)
      return
    }

    clearTextSelection()
  }

  _anchorNodeInStyleSpanFocusNodeInBlockSpan(selectionWrapper) {
    const expandTargetSpanID = this._getExpandableSpanID(selectionWrapper)
    if (expandTargetSpanID) {
      this._expand(selectionWrapper, expandTargetSpanID)
      return
    }

    this._create(selectionWrapper)
  }

  _anchorNodeInStyleSpanFocusNodeInStyleSpan(selectionWrapper) {
    const shrinkTargetSpanID = this._getShrinkableEndSpanID(selectionWrapper)
    if (shrinkTargetSpanID) {
      this._shrink(selectionWrapper, shrinkTargetSpanID)
      return
    }

    if (
      selectionWrapper.isParentOfBothNodesSame ||
      selectionWrapper.isParentsParentOfAnchorNodeAndFocusedNodeSame
    ) {
      this._create(selectionWrapper)
      return
    }

    const expandTargetSpanID = this._getExpandableSpanID(selectionWrapper)
    if (expandTargetSpanID) {
      this._expand(selectionWrapper, expandTargetSpanID)
      return
    }

    clearTextSelection()
  }

  _getShrinkableEndSpanID(selectionWrapper) {
    if (selectionWrapper.ancestorDenotationSpanOfAnchorNode) {
      const { anchor } = selectionWrapper.positionsOnAnnotation

      const { begin, end } = this._annotationData.span.getDenotationSpan(
        selectionWrapper.ancestorDenotationSpanOfAnchorNode.id
      )
      if (anchor === begin || anchor === end) {
        // Shrink the span of the ends.
        if (
          selectionWrapper.ancestorDenotationSpanOfAnchorNode ===
          selectionWrapper.ancestorDenotationSpanOfFocusNode
        ) {
          return selectionWrapper.ancestorDenotationSpanOfAnchorNode.id
        }

        // Shrink the parent of the parent-child span at the end.
        if (
          selectionWrapper.ancestorDenotationSpanOfAnchorNode !==
            selectionWrapper.ancestorDenotationSpanOfFocusNode &&
          selectionWrapper.ancestorDenotationSpanOfFocusNode.contains(
            selectionWrapper.ancestorDenotationSpanOfAnchorNode
          )
        ) {
          return selectionWrapper.ancestorDenotationSpanOfFocusNode.id
        }
      }
    }
  }

  _getShrinkableSpanID(selectionWrapper) {
    const targetSpanElement = selectionWrapper.ancestorDenotationSpanOfFocusNode

    if (targetSpanElement) {
      if (
        selectionWrapper.ancestorDenotationSpanOfAnchorNode !==
          targetSpanElement &&
        (!selectionWrapper.ancestorDenotationSpanOfAnchorNode ||
          selectionWrapper.ancestorDenotationSpanOfAnchorNode.contains(
            targetSpanElement
          ))
      ) {
        return targetSpanElement.id
      }
    }

    // If the parent of the anchor node is a descendant of the focus node,
    // and the focus node is selected, shrink the focus node.
    if (selectionWrapper.isAnchorNodeParentIsDescendantOfFocusNodeParent) {
      if (
        isPositionBetweenSpan(
          this._selectionModel.span.single,
          selectionWrapper.positionsOnAnnotation.focus
        )
      ) {
        return this._selectionModel.span.single.element.id
      }
    }
  }

  _getExpandableSpanID(selectionWrapper) {
    const targetSpanElement =
      selectionWrapper.ancestorDenotationSpanOfAnchorNode

    if (targetSpanElement) {
      const { ancestorDenotationSpanOfFocusNode } = selectionWrapper

      if (ancestorDenotationSpanOfFocusNode) {
        if (
          targetSpanElement !== ancestorDenotationSpanOfFocusNode &&
          (targetSpanElement.parentElement ===
            ancestorDenotationSpanOfFocusNode.parentElement ||
            ancestorDenotationSpanOfFocusNode.contains(targetSpanElement))
        ) {
          return targetSpanElement.id
        }
      } else {
        return targetSpanElement.id
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
        this._isReplicateAuto,
        selectionWrapper,
        this._spanConfig,
        getIsDelimiterFunc(this._buttonController, this._spanConfig)
      )
    }
    clearTextSelection()
  }

  _expand(selectionWrapper, spanID) {
    this._selectionModel.removeAll()

    const { begin, end } = this._annotationData.span
      .get(spanID)
      .getExpandedInAnchorNodeToFocusNodeDirection(
        this._buttonController.spanAdjuster,
        selectionWrapper,
        this._annotationData.sourceDoc,
        this._spanConfig
      )

    if (validateNewDennotationSpan(this._annotationData.span, begin, end)) {
      this._commander.invoke(
        this._commander.factory.moveDenotationSpanCommand(spanID, begin, end)
      )
    }

    clearTextSelection()
  }

  _shrink(selectionWrapper, spanID) {
    shrinkSpan(
      this._editorHTMLElement,
      this._annotationData,
      this._selectionModel,
      this._commander,
      this._buttonController.spanAdjuster,
      spanID,
      selectionWrapper,
      this._spanConfig,
      (begin, end) => {
        this._commander.invoke(
          this._commander.factory.moveDenotationSpanCommand(spanID, begin, end)
        )
      }
    )

    clearTextSelection()
  }

  get _isReplicateAuto() {
    return this._buttonController.isPushed('replicate-auto')
  }
}
