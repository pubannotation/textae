import clearTextSelection from '../../../../clearTextSelection'
import Positions from './Positions'
import DelimiterDetectAdjuster from './DelimiterDetectAdjuster'
import BlankSkipAdjuster from './BlankSkipAdjuster'
import create from './create'
import shrink from './shrink'
import getExpandTargetSpan from './getExpandTargetSpan'
import expand from './expand'
import hasCharacters from './hasCharacters'
import getIsDelimiterFunc from '../../../../../getIsDelimiterFunc'

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
    if (selectionWrapper.isAnchorNodeInTextBox) {
      if (selectionWrapper.isFocusNodeInTextBox) {
        this._anchorNodeInTextBoxFocusNodeInTextBox(selectionWrapper)
      } else if (selectionWrapper.isFocusNodeInSpan) {
        this._anchorNodeInTextBoxFocusNodeInSpan(selectionWrapper)
      } else if (selectionWrapper.isFocusNodeInStyleSpan) {
        this._anchorNodeInTextBoxFocusNodeInStyleSpan(selectionWrapper)
      }
    } else if (selectionWrapper.isAnchorNodeInSpan) {
      if (selectionWrapper.isFocusNodeInTextBox) {
        this._anchorNodeInSpanFocusNodeInTextBox(selectionWrapper)
      } else if (selectionWrapper.isFocusNodeInSpan) {
        this._anchorNodeInSpanFocusNodeInSpan(selectionWrapper)
      } else if (selectionWrapper.isFocusNodeInStyleSpan) {
        this._anchorNodeInSpanFocusNodeInStyleSpan(selectionWrapper)
      }
    } else if (selectionWrapper.isAnchorNodeInStyleSpan) {
      if (selectionWrapper.isFocusNodeInTextBox) {
        this._anchorNodeInStyleSpanFocusNodeInTextBox(selectionWrapper)
      } else if (selectionWrapper.isFocusNodeInSpan) {
        this._anchorNodeInStyleSpanFocusNodeInSpan(selectionWrapper)
      } else if (selectionWrapper.isFocusNodeInStyleSpan) {
        this._anchorNodeInStyleSpanFocusNodeInStyleSpan(selectionWrapper)
      }
    }
  }

  _anchorNodeInTextBoxFocusNodeInTextBox(selectionWrapper) {
    if (this._hasCharacters(selectionWrapper)) {
      // The parent of the focusNode is the text.
      this._create(selectionWrapper)
    }

    clearTextSelection()
  }

  _anchorNodeInTextBoxFocusNodeInSpan(selectionWrapper) {
    if (this._hasCharacters(selectionWrapper)) {
      if (this._isFocusInSelectedSpan(selectionWrapper)) {
        // If a span is selected, it is able to begin drag out of an outer span of the span and shrink the span.
        // The focus node should be at the selected node.
        // cf.
        // 1. Select an inner span.
        // 2. Begin Drug from out of an outside span to the selected span.
        // Shrink the selected span.
        this._shrinkSelectedSpan(selectionWrapper)
      } else if (selectionWrapper.isForcusOneDownUnderAnchor) {
        // To shrink the span , belows are needed:
        // 1. The anchorNode out of the span and in the parent of the span.
        // 2. The foucusNode is in the span.
        this._shrinkParentOfFocusNode(selectionWrapper)
      }
    }
  }

  _anchorNodeInTextBoxFocusNodeInStyleSpan(selectionWrapper) {
    if (this._hasCharacters(selectionWrapper)) {
      // There is a Span between the StyleSpan and the text.
      // Shrink Span when mousedown on the text or a span and mouseup on the styleSpan.
      if (selectionWrapper.ancestorSpanOfFocusNode) {
        const spanId = selectionWrapper.ancestorSpanOfFocusNode.id

        this._shrink(selectionWrapper, spanId)
        return
      }

      this._create(selectionWrapper)
      return
    }
  }

  _anchorNodeInSpanFocusNodeInTextBox(selectionWrapper) {
    if (this._hasCharacters(selectionWrapper)) {
      const spanId = getExpandTargetSpan(this._selectionModel, selectionWrapper)

      this._expand(selectionWrapper, spanId)
    }
  }

  _anchorNodeInSpanFocusNodeInSpan(selectionWrapper) {
    if (this._hasCharacters(selectionWrapper)) {
      if (selectionWrapper.isParentOfAnchorNodeAndFocusedNodeSame) {
        // The parents of the anchor and focus nodes are the same span.
        const parentSpan = this._annotationData.span.get(
          selectionWrapper.parentOfAnchorNode.id
        )
        const positions = new Positions(this._annotationData, selectionWrapper)
        if (
          positions.anchor === parentSpan.begin ||
          positions.anchor === parentSpan.end
        ) {
          // The start or end of the selected region is at the same position
          // as the start or end of the parent span.
          if (this._isFocusInSelectedSpan(selectionWrapper)) {
            this._shrinkSelectedSpan(selectionWrapper)
          } else {
            this._shrinkParentOfFocusNode(selectionWrapper)
          }
        } else {
          this._create(selectionWrapper)
        }
        return
      }

      if (selectionWrapper.isFocusNodeParentIsDescendantOfAnchorNodeParent) {
        if (this._isFocusInSelectedSpan(selectionWrapper)) {
          // If a span is selected, it is able to begin drag out of an outer span of the span and shrink the span.
          // The focus node should be at the selected node.
          // cf.
          // 1. Select an inner span.
          // 2. Begin Drug from out of an outside span to the selected span.
          // Shrink the selected span.
          this._shrinkSelectedSpan(selectionWrapper)
        } else if (selectionWrapper.isForcusOneDownUnderAnchor) {
          // To shrink the span , belows are needed:
          // 1. The anchorNode out of the span and in the parent of the span.
          // 2. The foucusNode is in the span.
          this._shrinkParentOfFocusNode(selectionWrapper)
        }
        return
      }

      if (selectionWrapper.isAnchorNodeParentIsDescendantOfFocusNodeParent) {
        // If you select the parent span on the left edge of the screen and shrink it from the left,
        // the anchorNode is the child span and the focusNode is the parent span.
        // If the focusNode (parent span) is selected, shrink the parent span.
        if (selectionWrapper.isFocusNodeParentSelected) {
          if (this._isFocusInSelectedSpan(selectionWrapper)) {
            // If a span is selected, it is able to begin drag out of an outer span of the span and shrink the span.
            // The focus node should be at the selected node.
            // cf.
            // 1. Select an inner span.
            // 2. Begin Drug from out of an outside span to the selected span.
            // Shrink the selected span.
            this._shrinkSelectedSpan(selectionWrapper)
          } else if (selectionWrapper.isForcusOneDownUnderAnchor) {
            // To shrink the span , belows are needed:
            // 1. The anchorNode out of the span and in the parent of the span.
            // 2. The foucusNode is in the span.
            this._shrink(
              selectionWrapper,
              selectionWrapper.parentOfFocusNode.id
            )
          }
        } else {
          const spanId = getExpandTargetSpan(
            this._selectionModel,
            selectionWrapper
          )

          this._expand(selectionWrapper, spanId)
        }

        return
      }
    }
  }

  _anchorNodeInSpanFocusNodeInStyleSpan(selectionWrapper) {
    if (this._hasCharacters(selectionWrapper)) {
      if (selectionWrapper.isAnchorNodeInSpan) {
        // Mousedown on the child Span of a parent and child Span,
        // and then mouseup on the StyleSpan in the parent Span.
        if (selectionWrapper.isParentsParentOfAnchorNodeAndFocusedNodeSame) {
          const spanId = selectionWrapper.parentOfAnchorNode.id

          this._expand(selectionWrapper, spanId)
          return
        }

        // There is a Span between the StyleSpan and the text.
        // Shrink Span when mousedown on the text or a span and mouseup on the styleSpan.
        if (selectionWrapper.ancestorSpanOfFocusNode) {
          const spanId = selectionWrapper.ancestorSpanOfFocusNode.id

          this._shrink(selectionWrapper, spanId)
          return
        }
      }
    }
  }

  _anchorNodeInStyleSpanFocusNodeInTextBox(selectionWrapper) {
    if (this._hasCharacters(selectionWrapper)) {
      if (
        selectionWrapper.isAnchorNodeInStyleSpanAndTheStyleSpanIsDescendantOfSpan
      ) {
        // If the anchor node is a style span but has a parent span, extend the parent span.
        const spanId = selectionWrapper.ancestorSpanOfAnchorNode.id
        this._expand(selectionWrapper, spanId)
        return
      }

      this._create(selectionWrapper)
    }
  }

  _anchorNodeInStyleSpanFocusNodeInSpan() {
    clearTextSelection()
  }

  _anchorNodeInStyleSpanFocusNodeInStyleSpan(selectionWrapper) {
    if (this._hasCharacters(selectionWrapper)) {
      if (selectionWrapper.isParentOfAnchorNodeAndFocusedNodeSame) {
        this._create(selectionWrapper)
        return
      }
    }

    clearTextSelection()
  }

  _hasCharacters(selectionWrapper) {
    return hasCharacters(
      this._annotationData,
      this._spanConfig,
      selectionWrapper
    )
  }

  _isFocusInSelectedSpan(selectionWrapper) {
    const span = this._selectionModel.span.single

    if (!span) {
      return false
    }

    const position = new Positions(this._annotationData, selectionWrapper).focus
    return span.begin < position && position < span.end
  }

  _create(selectionWrapper) {
    this._selectionModel.clear()
    create(
      this._annotationData,
      this._commander,
      this._spanAdjuster,
      this._isReplicateAuto,
      selectionWrapper,
      this._spanConfig,
      getIsDelimiterFunc(this._buttonController, this._spanConfig)
    )
  }

  _expand(selectionWrapper, spanId) {
    if (spanId) {
      expand(
        this._selectionModel,
        this._annotationData,
        this._commander,
        this._spanAdjuster,
        spanId,
        selectionWrapper,
        this._spanConfig
      )
    }

    clearTextSelection()
  }

  _shrinkSelectedSpan(selectionWrapper) {
    this._shrink(selectionWrapper, this._selectionModel.span.singleId)
  }

  _shrinkParentOfFocusNode(selectionWrapper) {
    this._shrink(selectionWrapper, selectionWrapper.parentOfFocusNode.id)
  }

  _shrink(selectionWrapper, spanId) {
    shrink(
      this._editor,
      this._annotationData,
      this._selectionModel,
      this._commander,
      this._spanAdjuster,
      spanId,
      selectionWrapper,
      this._spanConfig
    )

    clearTextSelection()
  }

  get _isReplicateAuto() {
    return this._buttonController.valueOf('replicate-auto')
  }

  get _spanAdjuster() {
    return this._buttonController.valueOf('boundary-detection')
      ? new DelimiterDetectAdjuster()
      : new BlankSkipAdjuster()
  }
}
