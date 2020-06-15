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

export default class {
  constructor(
    editor,
    annotationData,
    selectionModel,
    commander,
    buttonController
  ) {
    this._editor = editor
    this._annotationData = annotationData
    this._selectionModel = selectionModel
    this._commander = commander
    this._buttonController = buttonController
  }

  selectEndOnText(data) {
    const isValid = validateOnText(
      this._annotationData,
      data.spanConfig,
      data.selection
    )
    if (isValid) {
      // The parent of the focusNode is the paragraph.
      // Same paragraph check is done in the validateOnText.
      if (
        data.selection.anchorNode.parentNode.classList.contains(
          'textae-editor__body__text-box__paragraph'
        )
      ) {
        this._create(data)
      } else if (
        data.selection.anchorNode.parentNode.classList.contains(
          'textae-editor__span'
        )
      ) {
        this._expand(data)
      }
    }
    clearTextSelection()
  }

  selectEndOnSpan(data) {
    const isValid = validateOnSpan(
      this._annotationData,
      data.spanConfig,
      data.selection
    )
    if (isValid) {
      if (data.selection.anchorNode === data.selection.focusNode) {
        const positions = new Positions(this._annotationData, data.selection)
        const span = this._annotationData.span.get(
          data.selection.anchorNode.parentElement.id
        )
        if (positions.anchor === span.begin || positions.anchor === span.end) {
          this._shrinkPullByTheEar(
            data,
            data.selection.anchorNode.parentElement.id
          )
        } else {
          this._create(data)
        }
      } else if (
        data.selection.focusNode.parentElement.closest(
          `#${data.selection.anchorNode.parentElement.id}`
        )
      ) {
        this._shrinkCrossTheEar(data)
      } else if (
        data.selection.anchorNode.parentElement.closest(
          `#${data.selection.focusNode.parentElement.id}`
        )
      ) {
        // If you select the parent span on the left edge of the screen and shrink it from the left,
        // the anchorNode is the child span and the focusNode is the parent span.
        // If the focusNode (parent span) is selected, shrink the parent span.
        if (
          data.selection.focusNode.parentElement.classList.contains(
            'ui-selected'
          )
        ) {
          this._shrinkCrossTheEar(data)
        } else {
          this._expand(data)
        }
      } else if (
        data.selection.focusNode.parentElement.closest(
          `#${data.selection.anchorNode.parentElement.parentElement.id}`
        )
      ) {
        // When extending the span to the right,
        // if the right edge after stretching is the same as the right edge of the second span,
        // the anchorNode will be the textNode of the first span and the focusNode will be the textNode of the second span.
        // If the Span of the focusNode belongs to the parent of the Span of the anchorNode, the first Span is extensible.
        // The same applies when extending to the left.
        this._expand(data)
      }
    }

    clearTextSelection()
  }

  _create(data) {
    this._selectionModel.clear()
    create(
      this._annotationData,
      this._commander,
      this._spanAdjuster,
      this._isDetectDelimiterEnable,
      this._isReplicateAuto,
      data.selection,
      data.spanConfig
    )
  }

  _expand(data) {
    expand(
      this._annotationData,
      this._selectionModel,
      this._commander,
      this._spanAdjuster,
      data.selection,
      data.spanConfig
    )
  }

  _shrinkCrossTheEar(data) {
    crossTheEar(
      this._editor,
      this._annotationData,
      this._selectionModel,
      this._commander,
      this._spanAdjuster,
      data.selection,
      data.spanConfig
    )
  }

  _shrinkPullByTheEar(data) {
    pullByTheEar(
      this._editor,
      this._annotationData,
      this._selectionModel,
      this._commander,
      this._spanAdjuster,
      data.selection,
      data.spanConfig
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
