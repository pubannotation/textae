import clearTextSelection from '../../clearTextSelection'
import create from './create'
import shrinkSpan from '../../shrinkSpan'
import getExpandTargetSpan from './getExpandTargetSpan'
import expandSpan from '../../expandSpan'
import hasCharacters from '../../hasCharacters'
import getIsDelimiterFunc from '../../../getIsDelimiterFunc'

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

  _anchorNodeInTextBoxFocusNodeInTextBox(selectionWrapper) {
    // The parent of the focusNode is the text.
    this._create(selectionWrapper)
  }

  _anchorNodeInTextBoxFocusNodeInDenotationSpan(selectionWrapper) {
    this._shrinkSelectSpanOrOneUpFocusParentDenotationSpan(selectionWrapper)
  }

  _anchorNodeInTextBoxFocusNodeInBlockSpan() {
    clearTextSelection()
  }

  _anchorNodeInTextBoxFocusNodeInStyleSpan(selectionWrapper) {
    // There is a Span between the StyleSpan and the text.
    // Shrink Span when mousedown on the text or a span and mouseup on the styleSpan.
    if (selectionWrapper.ancestorDenotationSpanOfFocusNode) {
      const spanId = selectionWrapper.ancestorDenotationSpanOfFocusNode.id
      this._shrink(selectionWrapper, spanId)
      return
    }

    this._create(selectionWrapper)
  }

  _anchorNodeInDenotationSpanFocusNodeInTextBox(selectionWrapper) {
    const spanId = getExpandTargetSpan(this._selectionModel, selectionWrapper)
    this._expand(selectionWrapper, spanId)
  }

  _anchorNodeInDenotationSpanFocusNodeInDenotationSpan(selectionWrapper) {
    // The anchor node and the focus node are in the same span.
    if (selectionWrapper.isParentOfBothNodesSame) {
      const parentSpan = this._annotationData.span.get(
        selectionWrapper.parentOfAnchorNode.id
      )
      const positionsOnAnnotation = selectionWrapper.positionsOnAnnotation

      // Shrink the span
      // if the anchor position is the same as the begin or end of the parent span.
      if (
        positionsOnAnnotation.anchor === parentSpan.begin ||
        positionsOnAnnotation.anchor === parentSpan.end
      ) {
        // The start or end of the selected region is at the same position
        // as the start or end of the parent span.
        // Shrink the span at the front or back end of the text.
        if (this._isFocusInSelectedSpan(selectionWrapper)) {
          this._shrinkSelectedSpan(selectionWrapper)
        } else {
          this._shrink(selectionWrapper, parentSpan.id)
        }
      } else {
        this._create(selectionWrapper)
      }
      return
    }

    // The anchor node is in the parent span and the focus node is in the child span.
    if (
      selectionWrapper.parentOfFocusNode.closest(
        `#${selectionWrapper.parentOfAnchorNode.id}`
      )
    ) {
      this._shrinkSelectSpanOrOneUpFocusParentDenotationSpan(selectionWrapper)
      return
    }

    // The anchor node is in the child span and the focus node is in the parent span.
    if (
      selectionWrapper.parentOfAnchorNode.closest(
        `#${selectionWrapper.parentOfFocusNode.id}`
      )
    ) {
      if (this._isFocusInSelectedSpan(selectionWrapper)) {
        this._shrinkSelectedSpan(selectionWrapper)
      } else {
        const spanId = getExpandTargetSpan(
          this._selectionModel,
          selectionWrapper
        )

        this._expand(selectionWrapper, spanId)
      }

      return
    }

    // Make the sibling Span the parent Span that shares the end.
    if (selectionWrapper.isParentsParentOfAnchorNodeAndFocusedNodeSame) {
      const spanId = selectionWrapper.parentOfAnchorNode.id

      this._expand(selectionWrapper, spanId)
      return
    }

    // When you mouse down in one span and mouse up in another span
    clearTextSelection()
  }

  _anchorNodeInDenotationSpanFocusNodeInBlockSpan(selectionWrapper) {
    const spanId = getExpandTargetSpan(this._selectionModel, selectionWrapper)
    this._expand(selectionWrapper, spanId)
  }

  _anchorNodeInDenotationSpanFocusNodeInStyleSpan(selectionWrapper) {
    // Mousedown on the child Span of a parent and child Span,
    // and then mouseup on the StyleSpan in the parent Span.
    if (selectionWrapper.isParentsParentOfAnchorNodeAndFocusedNodeSame) {
      const spanId = selectionWrapper.parentOfAnchorNode.id

      this._expand(selectionWrapper, spanId)
      return
    }

    // There is a Span between the StyleSpan and the text.
    // Shrink Span when mousedown on the text or a span and mouseup on the styleSpan.
    if (selectionWrapper.ancestorDenotationSpanOfFocusNode) {
      const spanId = selectionWrapper.ancestorDenotationSpanOfFocusNode.id

      this._shrink(selectionWrapper, spanId)
      return
    }
  }

  _anchorNodeInBlockSpanFocusNodeInTextBox() {
    clearTextSelection()
  }

  _anchorNodeInBlockSpanFocusNodeInDenotationSpan(selectionWrapper) {
    this._shrinkSelectSpanOrOneUpFocusParentDenotationSpan(selectionWrapper)
  }

  _anchorNodeInBlockSpanFocusNodeInBlockSpan(selectionWrapper) {
    this._create(selectionWrapper)
  }

  _anchorNodeInBlockSpanFocusNodeInStyleSpan() {
    clearTextSelection()
  }

  _anchorNodeInStyleSpanFocusNodeInTextBox(selectionWrapper) {
    // If the anchor node is a style span but has a parent span, extend the parent span.
    if (selectionWrapper.ancestorDenotationSpanOfAnchorNode) {
      const spanId = selectionWrapper.ancestorDenotationSpanOfAnchorNode.id
      this._expand(selectionWrapper, spanId)
      return
    }

    this._create(selectionWrapper)
  }

  _anchorNodeInStyleSpanFocusNodeInDenotationSpan(selectionWrapper) {
    if (this._isFocusInSelectedSpan(selectionWrapper)) {
      this._shrinkSelectedSpan(selectionWrapper)
      return
    }

    // When an anchor node has an ancestral span and the focus node is its sibling,
    // expand the ancestral span.
    if (
      selectionWrapper.ancestorDenotationSpanOfAnchorNode &&
      selectionWrapper.ancestorDenotationSpanOfAnchorNode.parentElement ===
        selectionWrapper.parentOfFocusNode
    ) {
      const spanId = selectionWrapper.ancestorDenotationSpanOfAnchorNode.id
      this._expand(selectionWrapper, spanId)
      return
    }

    // When you mouse down on a parent style span and mouse up on the child span,
    // you shrink the child span.
    if (selectionWrapper.isFocusOneDownUnderAnchor) {
      this._shrink(selectionWrapper, selectionWrapper.parentOfFocusNode.id)
      return
    }

    // If the child's style span and the end of the parent's denotation span coincide,
    // the mouse-down event will be fired on the child's style span.
    if (selectionWrapper.isAnchorOneDownUnderFocus) {
      // If the anchor position coincides with the begin or end of the denotation span,
      // the denotation span will be shrunk.
      const { anchor } = selectionWrapper.positionsOnAnnotation
      const denotationSpanOnFocus = this._annotationData.span.get(
        selectionWrapper.parentOfFocusNode.id
      )
      if (
        anchor === denotationSpanOnFocus.begin ||
        anchor === denotationSpanOnFocus.end
      ) {
        this._shrink(selectionWrapper, selectionWrapper.parentOfFocusNode.id)
        return
      }
    }

    clearTextSelection()
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

  _isFocusInSelectedSpan(selectionWrapper) {
    const span = this._selectionModel.span.single

    if (!span) {
      return false
    }

    const { focus } = selectionWrapper.positionsOnAnnotation
    return span.begin < focus && focus < span.end
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
    if (spanId) {
      expandSpan(
        this._selectionModel,
        this._annotationData,
        this._buttonController.spanAdjuster,
        spanId,
        selectionWrapper,
        this._spanConfig,
        (begin, end) => {
          this._commander.invoke(
            this._commander.factory.moveDenotationSpanCommand(
              spanId,
              begin,
              end
            )
          )
        }
      )
    }

    clearTextSelection()
  }

  _shrinkSelectSpanOrOneUpFocusParentDenotationSpan(selectionWrapper) {
    if (this._isFocusInSelectedSpan(selectionWrapper)) {
      // If a span is selected, it is able to begin drag out of an outer span of the span and shrink the span.
      // The focus node should be at the selected node.
      // cf.
      // 1. Select an inner span.
      // 2. Begin Drug from out of an outside span to the selected span.
      // Shrink the selected span.
      this._shrinkSelectedSpan(selectionWrapper)
    } else if (selectionWrapper.isFocusOneDownUnderAnchor) {
      // To shrink the span , belows are needed:
      // 1. The anchorNode out of the span and in the parent of the span.
      // 2. The foucusNode is in the span.
      this._shrink(selectionWrapper, selectionWrapper.parentOfFocusNode.id)
    }

    // When the mouse-up span is the grandchild or below the mouse-down span or text
    clearTextSelection()
  }

  _shrinkSelectedSpan(selectionWrapper) {
    this._shrink(selectionWrapper, this._selectionModel.span.singleId)
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
