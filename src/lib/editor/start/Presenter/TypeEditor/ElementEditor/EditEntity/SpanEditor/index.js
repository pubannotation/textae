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
      this._selectEndOnText()
      event.stopPropagation()
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
      this._selectEndOnSpan()
      // Cancel selection of a text.
      // And do non propagate the parent span.
      event.stopPropagation()
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
      this._selectEndOnStyleSpan()
      // Cancel selection of a text.
      // And do non propagate the parent span.
      e.stopPropagation()
    }
  }

  _selectSpan(event, spanId) {
    selectSpan(this._annotationData, this._selectionModel, event, spanId)
  }

  _selectEndOnText() {
    const selectionWrapper = new SelectionWrapper()

    const isValid =
      selectionWrapper.isFocusNodeInTextBox &&
      (selectionWrapper.isAnchorNodeInTextBox ||
        selectionWrapper.isAnchorNodeInSpan ||
        selectionWrapper.isAnchorNodeInStyleSpan) &&
      this._hasCharacters(selectionWrapper)

    if (isValid) {
      // The parent of the focusNode is the text.
      if (
        selectionWrapper.isAnchorNodeInTextBox ||
        selectionWrapper.isAnchorNodeInStyleSpan
      ) {
        this._create(selectionWrapper)
        return
      }

      if (selectionWrapper.isAnchorNodeInSpan) {
        this._expand(selectionWrapper)
        clearTextSelection()
        return
      }

      if (
        selectionWrapper.isAnchorNodeInStyleSpanAndTheStyleSpanIsDescendantOfSpan
      ) {
        // If the anchor node is a style span but has a parent span, extend the parent span.
        const span = selectionWrapper.ancestorSpanOfAnchorNode
        this._expandOnStyleSpan(selectionWrapper, span)
        clearTextSelection()
        return
      }
    }

    clearTextSelection()
  }

  _selectEndOnSpan() {
    const selectionWrapper = new SelectionWrapper()
    const isValid =
      selectionWrapper.isFocusNodeInSpan &&
      (selectionWrapper.isAnchorNodeInTextBox ||
        selectionWrapper.isAnchorNodeInSpan ||
        selectionWrapper.isAnchorNodeInStyleSpan) &&
      hasCharacters(this._annotationData, this._spanConfig, selectionWrapper)

    if (isValid) {
      if (selectionWrapper.isParentOfAnchorNodeAndFocusedNodeSame) {
        const positions = new Positions(this._annotationData, selectionWrapper)
        const span = this._getAnchorNodeParentSpan(selectionWrapper)
        if (positions.anchor === span.begin || positions.anchor === span.end) {
          this._shrinkPullByTheEar(selectionWrapper)
          clearTextSelection()
        } else {
          this._create(selectionWrapper)
        }
        return
      }

      if (selectionWrapper.isFocusNodeParentIsDescendantOfAnchorNodeParent) {
        this._shrinkCrossTheEar(selectionWrapper)
        clearTextSelection()
        return
      }

      if (
        selectionWrapper.isAnchorNodeInSpan &&
        selectionWrapper.isAnchorNodeParentIsDescendantOfFocusNodeParent
      ) {
        // If you select the parent span on the left edge of the screen and shrink it from the left,
        // the anchorNode is the child span and the focusNode is the parent span.
        // If the focusNode (parent span) is selected, shrink the parent span.
        if (selectionWrapper.isFocusNodeParentSelected) {
          this._shrinkCrossTheEar(selectionWrapper)
        } else {
          this._expand(selectionWrapper)
        }

        clearTextSelection()
        return
      }

      if (
        selectionWrapper.isAnchorNodeInSpan &&
        selectionWrapper.isFocusNodeParentIsDescendantOfAnchorNodeParentOfParent
      ) {
        // When extending the span to the right,
        // if the right edge after stretching is the same as the right edge of the second span,
        // the anchorNode will be the textNode of the first span and the focusNode will be the textNode of the second span.
        // If the Span of the focusNode belongs to the parent of the Span of the anchorNode, the first Span is extensible.
        // The same applies when extending to the left.
        this._expand(selectionWrapper)
        clearTextSelection()
      }
    }

    clearTextSelection()
  }

  _selectEndOnStyleSpan() {
    const selectionWrapper = new SelectionWrapper()
    const isValid =
      selectionWrapper.isFocusNodeInStyleSpan &&
      (selectionWrapper.isAnchorNodeInTextBox ||
        selectionWrapper.isAnchorNodeInSpan ||
        selectionWrapper.isAnchorNodeInStyleSpan) &&
      hasCharacters(this._annotationData, this._spanConfig, selectionWrapper)

    if (isValid) {
      if (
        selectionWrapper.isParentOfAnchorNodeAndFocusedNodeSame ||
        selectionWrapper.isAnchorNodeInTextBox
      ) {
        this._create(selectionWrapper)
        return
      }

      if (selectionWrapper.isAnchorNodeParentIsDescendantOfFocusNodeParent) {
        this._expand(selectionWrapper)
        clearTextSelection()
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
      this._isDetectDelimiterEnable,
      this._isReplicateAuto,
      selectionWrapper,
      this._spanConfig
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
      clearTextSelection()
    }
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
  }

  _shrinkCrossTheEar(selectionWrapper) {
    crossTheEar(
      this._editor,
      this._annotationData,
      this._selectionModel,
      this._commander,
      this._spanAdjuster,
      selectionWrapper,
      this._spanConfig
    )
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
  }

  get _isDetectDelimiterEnable() {
    return this._buttonController.valueOf('boundary-detection')
  }

  get _isReplicateAuto() {
    return this._buttonController.valueOf('replicate-auto')
  }

  get _spanAdjuster() {
    return this._isDetectDelimiterEnable
      ? new DelimiterDetectAdjuster()
      : new BlankSkipAdjuster()
  }
}
