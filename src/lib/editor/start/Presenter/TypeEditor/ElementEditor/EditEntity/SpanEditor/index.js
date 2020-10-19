import clearTextSelection from '../../../clearTextSelection'
import Positions from './Positions'
import DelimiterDetectAdjuster from './DelimiterDetectAdjuster'
import BlankSkipAdjuster from './BlankSkipAdjuster'
import create from './create'
import crossTheEar from './crossTheEar'
import pullByTheEar from './pullByTheEar'
import selectSpan from './selectSpan'
import SelectionWrapper from './SelectionWrapper'
import getExpandTargetSpan from './getExpandTargetSpan'
import expand from './expand'
import hasCharacters from './hasCharacters'
import getTargetSpanWhenFocusNodeDifferentFromAnchorNode from './getTargetSpanWhenFocusNodeDifferentFromAnchorNode'
import getIsDelimiterFunc from '../../../../getIsDelimiterFunc'

export default class {
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

  textBoxClicked(event) {
    const selection = window.getSelection()

    if (selection.type === 'Range') {
      const selectionWrapper = new SelectionWrapper()
      if (selectionWrapper.isAnchorNodeInTextBox) {
        this._anchorNodeInTextBoxFocusNodeInTextBox(selectionWrapper)
      } else if (selectionWrapper.isAnchorNodeInSpan) {
        this._anchorNodeInSpanFocusNodeInTextBox(selectionWrapper)
      } else if (selectionWrapper.isAnchorNodeInStyleSpan) {
        this._anchorNodeInStyleSpanFocusNodeInTextBox(selectionWrapper)
      }

      event.stopPropagation()
    } else {
      this._selectionModel.clear()
    }
  }

  spanClicked(event) {
    // When you click on the text, the browser will automatically select the word.
    // Therefore, the editor shrinks spans instead of selecting spans.
    // Deselect the text.
    if (event.button === 2) {
      clearTextSelection()
    }

    const selection = window.getSelection()

    if (selection.type === 'Caret') {
      this._selectSpan(event, event.target.id)
    }

    if (selection.type === 'Range') {
      const selectionWrapper = new SelectionWrapper()
      if (selectionWrapper.isAnchorNodeInTextBox) {
        this._anchorNodeInTextBoxFocusNodeInSpan(selectionWrapper)
      } else if (selectionWrapper.isAnchorNodeInSpan) {
        this._anchorNodeInSpanFocusNodeInSpan(selectionWrapper)
      } else if (selectionWrapper.isAnchorNodeInStyleSpan) {
        this._anchorNodeInStyleSpanFocusNodeInSpan()
      }
    }
  }

  styleSpanClicked(e) {
    // When you click on the text, the browser will automatically select the word.
    // Therefore, the editor shrinks spans instead of selecting spans.
    // Deselect the text.
    if (e.button === 2) {
      clearTextSelection()
    }

    const selection = window.getSelection()

    if (selection.type === 'Caret') {
      const span = e.target.closest('.textae-editor__span')
      if (span) {
        this._selectSpan(e, span.id)
      }
    }

    if (selection.type === 'Range') {
      const selectionWrapper = new SelectionWrapper()
      if (selectionWrapper.isAnchorNodeInTextBox) {
        this._anchorNodeInTextBoxFocusNodeInStyleSpan(selectionWrapper)
      } else if (selectionWrapper.isAnchorNodeInSpan) {
        this._anchorNodeInSpanFocusNodeInStyleSpan(selectionWrapper)
      } else if (selectionWrapper.isAnchorNodeInStyleSpan) {
        this._anchorNodeInStyleSpanFocusNodeInStyleSpan(selectionWrapper)
      }
    }
  }

  _selectSpan(event, spanId) {
    selectSpan(this._annotationData, this._selectionModel, event, spanId)
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
      this._shrinkCrossTheEar(selectionWrapper)
    }
  }

  _anchorNodeInTextBoxFocusNodeInStyleSpan(selectionWrapper) {
    if (this._hasCharacters(selectionWrapper)) {
      // There is a Span between the StyleSpan and the text.
      // Shrink Span when mousedown on the text or a span and mouseup on the styleSpan.
      if (selectionWrapper.ancestorSpanOfFocusNode) {
        this._shrinkCrossTheEarOnStyleSpan(selectionWrapper)
        return
      }

      this._create(selectionWrapper)
      return
    }
  }

  _anchorNodeInSpanFocusNodeInTextBox(selectionWrapper) {
    if (this._hasCharacters(selectionWrapper)) {
      this._expand(selectionWrapper)
    }
  }

  _anchorNodeInSpanFocusNodeInSpan(selectionWrapper) {
    if (this._hasCharacters(selectionWrapper)) {
      if (selectionWrapper.isParentOfAnchorNodeAndFocusedNodeSame) {
        const positions = new Positions(this._annotationData, selectionWrapper)
        const span = this._getAnchorNodeParentSpan(selectionWrapper)
        if (positions.anchor === span.begin || positions.anchor === span.end) {
          this._shrinkPullByTheEar(selectionWrapper)
        } else {
          this._create(selectionWrapper)
        }
        return
      }

      if (selectionWrapper.isFocusNodeParentIsDescendantOfAnchorNodeParent) {
        this._shrinkCrossTheEar(selectionWrapper)
        return
      }

      if (selectionWrapper.isAnchorNodeParentIsDescendantOfFocusNodeParent) {
        // If you select the parent span on the left edge of the screen and shrink it from the left,
        // the anchorNode is the child span and the focusNode is the parent span.
        // If the focusNode (parent span) is selected, shrink the parent span.
        if (selectionWrapper.isFocusNodeParentSelected) {
          this._shrinkCrossTheEar(selectionWrapper)
        } else {
          this._expand(selectionWrapper)
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
          this._expandOnStyleSpan(
            selectionWrapper,
            selectionWrapper.parentOfAnchorNode
          )
          return
        }

        // There is a Span between the StyleSpan and the text.
        // Shrink Span when mousedown on the text or a span and mouseup on the styleSpan.
        if (selectionWrapper.ancestorSpanOfFocusNode) {
          this._shrinkCrossTheEarOnStyleSpan(selectionWrapper)
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
        const span = selectionWrapper.ancestorSpanOfAnchorNode
        this._expandOnStyleSpan(selectionWrapper, span)
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

  _getPosition(selectionWrapper) {
    return new Positions(this._annotationData, selectionWrapper)
  }

  _getAnchorNodeParentSpan(selectionWrapper) {
    return this._annotationData.span.get(selectionWrapper.parentOfAnchorNode.id)
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

  _expand(selectionWrapper) {
    const spanId = getExpandTargetSpan(this._selectionModel, selectionWrapper)

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

  _expandOnStyleSpan(selectionWrapper, span) {
    const spanId = span.id

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

  _shrinkCrossTheEar(selectionWrapper) {
    const spanId = getTargetSpanWhenFocusNodeDifferentFromAnchorNode(
      this._annotationData,
      this._selectionModel,
      selectionWrapper
    )

    crossTheEar(
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

  _shrinkCrossTheEarOnStyleSpan(selectionWrapper) {
    const spanId = selectionWrapper.ancestorSpanOfFocusNode.id

    crossTheEar(
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

  _shrinkPullByTheEar(selectionWrapper) {
    pullByTheEar(
      this._editor,
      this._annotationData,
      this._selectionModel,
      this._commander,
      this._spanAdjuster,
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
