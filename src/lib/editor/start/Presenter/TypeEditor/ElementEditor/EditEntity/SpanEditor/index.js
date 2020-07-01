import clearTextSelection from '../../../clearTextSelection'
import Positions from './Positions'
import DelimiterDetectAdjuster from './DelimiterDetectAdjuster'
import BlankSkipAdjuster from './BlankSkipAdjuster'
import validateOnText from './validateOnText'
import validateOnSpan from './validateOnSpan'
import create from './create'
import expand from './expand'
import crossTheEar from './crossTheEar'
import pullByTheEar from './pullByTheEar'
import isNodeTextBox from '../../isNodeTextBox'
import isNodeSpan from '../../isNodeSpan'
import selectSpan from './selectSpan'
import getSelectionSnapShot from './getSelectionSnapShot'

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
    // if text is seleceted
    if (selection.type === 'Range') {
      this._selectEndOnText(getSelectionSnapShot())
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

    // No select
    if (selection.type === 'Caret') {
      selectSpan(this._annotationData, this._selectionModel, event)
    } else {
      this._selectEndOnSpan(getSelectionSnapShot())
      // Cancel selection of a text.
      // And do non propagate the parent span.
      event.stopPropagation()
    }
  }

  _selectEndOnText(selection) {
    const isValid = validateOnText(
      this._annotationData,
      this._spanConfig,
      selection
    )
    if (isValid) {
      // The parent of the focusNode is the text.
      if (isNodeTextBox(selection.anchorNode.parentNode)) {
        this._create(selection)
      } else if (isNodeSpan(selection.anchorNode.parentNode)) {
        this._expand(selection)
      }
    }
    clearTextSelection()
  }

  _selectEndOnSpan(selection) {
    const isValid = validateOnSpan(
      this._annotationData,
      this._spanConfig,
      selection
    )
    if (isValid) {
      if (selection.anchorNode === selection.focusNode) {
        const positions = new Positions(this._annotationData, selection)
        const span = this._annotationData.span.get(
          selection.anchorNode.parentElement.id
        )
        if (positions.anchor === span.begin || positions.anchor === span.end) {
          this._shrinkPullByTheEar(selection)
        } else {
          this._create(selection)
        }
      } else if (
        selection.focusNode.parentElement.closest(
          `#${selection.anchorNode.parentElement.id}`
        )
      ) {
        this._shrinkCrossTheEar(selection)
      } else if (
        selection.anchorNode.parentElement.closest(
          `#${selection.focusNode.parentElement.id}`
        )
      ) {
        // If you select the parent span on the left edge of the screen and shrink it from the left,
        // the anchorNode is the child span and the focusNode is the parent span.
        // If the focusNode (parent span) is selected, shrink the parent span.
        if (
          selection.focusNode.parentElement.classList.contains('ui-selected')
        ) {
          this._shrinkCrossTheEar(selection)
        } else {
          this._expand(selection)
        }
      } else if (
        selection.focusNode.parentElement.closest(
          `#${selection.anchorNode.parentElement.parentElement.id}`
        )
      ) {
        // When extending the span to the right,
        // if the right edge after stretching is the same as the right edge of the second span,
        // the anchorNode will be the textNode of the first span and the focusNode will be the textNode of the second span.
        // If the Span of the focusNode belongs to the parent of the Span of the anchorNode, the first Span is extensible.
        // The same applies when extending to the left.
        this._expand(selection)
      }
    }

    clearTextSelection()
  }

  _create(selection) {
    this._selectionModel.clear()
    create(
      this._annotationData,
      this._commander,
      this._spanAdjuster,
      this._isDetectDelimiterEnable,
      this._isReplicateAuto,
      selection,
      this._spanConfig
    )
  }

  _expand(selection) {
    expand(
      this._annotationData,
      this._selectionModel,
      this._commander,
      this._spanAdjuster,
      selection,
      this._spanConfig
    )
  }

  _shrinkCrossTheEar(selection) {
    crossTheEar(
      this._editor,
      this._annotationData,
      this._selectionModel,
      this._commander,
      this._spanAdjuster,
      selection,
      this._spanConfig
    )
  }

  _shrinkPullByTheEar(selection) {
    pullByTheEar(
      this._editor,
      this._annotationData,
      this._selectionModel,
      this._commander,
      this._spanAdjuster,
      selection,
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
