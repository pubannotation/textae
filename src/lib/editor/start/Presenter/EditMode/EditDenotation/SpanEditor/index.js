import clearTextSelection from '../../clearTextSelection'
import create from './create'
import shrinkSpan from '../../shrinkSpan'
import getExpandTargetSpanFromAnchorNode from './getExpandTargetSpanFromAnchorNode'
import expandSpan from '../../expandSpan'
import hasCharacters from '../../hasCharacters'
import getIsDelimiterFunc from '../../../getIsDelimiterFunc'
import SelectionWrapper from '../../SelectionWrapper'
import getExpandTargetSpanFromFocusNode from './getExpandTargetSpanFromFocusNode'
import isNodeStyleSpan from '../../isNodeStyleSpan'
import isNodeDenotationSpan from '../../isNodeDenotationSpan'
import isPositionBetweenSpan from './isPositionBetweenSpan'

export default class SpanEditor {
  constructor(
    editor,
    annotationData,
    selectionModel,
    commander,
    buttonController,
    spanConfig
  ) {
    this._editor = editor
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

  expandForTouchDevice() {
    const expandedSpan = this._getExpandedSpan()
    if (expandedSpan) {
      const { spanId, begin, end } = expandedSpan

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
        this._commander.factory.moveDenotationSpanCommand(spanId, begin, end)
      )
    }
  }

  _getExpandedSpan() {
    const selectionWrapper = new SelectionWrapper(this._annotationData.span)

    // When you select text by mouse operation,
    // the anchor node of the selected string is always inside the span to be extended,
    // and the focus node is outside.
    const spanIdFromAnchor = getExpandTargetSpanFromAnchorNode(
      this._selectionModel,
      selectionWrapper
    )

    if (spanIdFromAnchor) {
      return {
        spanId: spanIdFromAnchor,
        ...this._annotationData.span
          .get(spanIdFromAnchor)
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
    const spanIdFromFocus = getExpandTargetSpanFromFocusNode(
      this._selectionModel,
      selectionWrapper
    )

    if (spanIdFromFocus) {
      return {
        spanId: spanIdFromFocus,
        ...this._annotationData.span
          .get(spanIdFromFocus)
          .getExpandedInFocusNodeToAnchorNodeDirection(
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
    const spanId = getExpandTargetSpanFromAnchorNode(
      this._selectionModel,
      selectionWrapper
    )
    if (spanId) {
      this._expand(selectionWrapper, spanId)
    }
  }

  _getShrinkableEndSpanID(selectionWrapper) {
    const { anchor } = selectionWrapper.positionsOnAnnotation
    const { begin, end } = this._annotationData.span.get(
      selectionWrapper.parentOfAnchorNode.id
    )
    if (anchor === begin || anchor === end) {
      // Shrink the span of the ends.
      if (selectionWrapper.isParentOfBothNodesSame) {
        return selectionWrapper.parentOfAnchorNode.id
      }

      // Shrink the parent of the parent-child span at the end.
      if (selectionWrapper.isAnchorNodeParentIsDescendantOfFocusNodeParent) {
        return selectionWrapper.parentOfFocusNode.id
      }
    }
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

    if (selectionWrapper.isAnchorNodeParentIsDescendantOfFocusNodeParent) {
      this._expand(selectionWrapper, selectionWrapper.parentOfAnchorNode.id)
      return
    }

    const shrinkTargetSpanID = this._getShrinkableSpanID(selectionWrapper)
    if (shrinkTargetSpanID) {
      this._shrink(selectionWrapper, shrinkTargetSpanID)
      return
    }

    // Make the sibling Span the parent Span that shares the end.
    if (selectionWrapper.isParentsParentOfAnchorNodeAndFocusedNodeSame) {
      const spanId = selectionWrapper.parentOfAnchorNode.id

      if (spanId) {
        this._expand(selectionWrapper, spanId)
      }
      return
    }

    // When you mouse down in one span and mouse up in another span
    clearTextSelection()
  }

  _anchorNodeInDenotationSpanFocusNodeInBlockSpan(selectionWrapper) {
    const spanId = getExpandTargetSpanFromAnchorNode(
      this._selectionModel,
      selectionWrapper
    )
    if (spanId) {
      this._expand(selectionWrapper, spanId)
    }
  }

  _anchorNodeInDenotationSpanFocusNodeInStyleSpan(selectionWrapper) {
    // Mousedown on the child Span of a parent and child Span,
    // and then mouseup on the StyleSpan in the parent Span.
    if (selectionWrapper.isParentsParentOfAnchorNodeAndFocusedNodeSame) {
      const spanId = selectionWrapper.parentOfAnchorNode.id

      if (spanId) {
        this._expand(selectionWrapper, spanId)
      }
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
      const spanId = selectionWrapper.ancestorDenotationSpanOfAnchorNode.id

      if (spanId) {
        this._expand(selectionWrapper, spanId)
      }
      return
    }

    this._create(selectionWrapper)
  }

  _anchorNodeInStyleSpanFocusNodeInDenotationSpan(selectionWrapper) {
    const shrinkTargetSpanID = this._getShrinkableSpanID(selectionWrapper)
    if (shrinkTargetSpanID) {
      this._shrink(selectionWrapper, shrinkTargetSpanID)
      return
    }

    // When an anchor node has an ancestral span and the focus node is its sibling,
    // expand the ancestral span.
    if (
      selectionWrapper.ancestorDenotationSpanOfAnchorNode &&
      selectionWrapper.ancestorDenotationSpanOfAnchorNode.parentElement ===
        selectionWrapper.parentOfFocusNode.parentElement
    ) {
      const spanId = selectionWrapper.ancestorDenotationSpanOfAnchorNode.id

      if (spanId) {
        this._expand(selectionWrapper, spanId)
      }
      return
    }

    clearTextSelection()
  }

  _getShrinkableSpanID(selectionWrapper) {
    const targetSpanElement = isPositionBetweenSpan(
      this._selectionModel.span.single,
      selectionWrapper.positionsOnAnnotation.focus
    )
      ? this._selectionModel.span.single.element
      : selectionWrapper.ancestorDenotationSpanOfFocusNode

    if (targetSpanElement) {
      const { anchor } = selectionWrapper.positionsOnAnnotation

      // Skip style only span
      let { parentOfAnchorNode } = selectionWrapper
      while (
        isNodeStyleSpan(parentOfAnchorNode) &&
        !isNodeDenotationSpan(parentOfAnchorNode)
      ) {
        parentOfAnchorNode = parentOfAnchorNode.parentElement
      }

      const { begin, end } = this._annotationData.span.get(targetSpanElement.id)
      if (
        (parentOfAnchorNode !== targetSpanElement &&
          parentOfAnchorNode.contains(targetSpanElement)) ||
        anchor === begin ||
        anchor === end
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

  _anchorNodeInStyleSpanFocusNodeInBlockSpan() {
    clearTextSelection()
  }

  _anchorNodeInStyleSpanFocusNodeInStyleSpan(selectionWrapper) {
    if (
      selectionWrapper.isParentOfBothNodesSame ||
      selectionWrapper.isParentsParentOfAnchorNodeAndFocusedNodeSame
    ) {
      this._create(selectionWrapper)
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
        this._isReplicateAuto,
        selectionWrapper,
        this._spanConfig,
        getIsDelimiterFunc(this._buttonController, this._spanConfig)
      )
    }
    clearTextSelection()
  }

  _expand(selectionWrapper, spanId) {
    expandSpan(
      this._selectionModel,
      this._annotationData,
      this._buttonController.spanAdjuster,
      spanId,
      selectionWrapper,
      this._spanConfig,
      (begin, end) => {
        this._commander.invoke(
          this._commander.factory.moveDenotationSpanCommand(spanId, begin, end)
        )
      }
    )

    clearTextSelection()
  }

  _shrink(selectionWrapper, spanId) {
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
          this._commander.factory.moveDenotationSpanCommand(spanId, begin, end)
        )
      }
    )

    clearTextSelection()
  }

  get _isReplicateAuto() {
    return this._buttonController.valueOf('replicate-auto')
  }
}
