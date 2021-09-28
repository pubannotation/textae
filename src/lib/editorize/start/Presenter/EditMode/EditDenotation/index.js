import EditDenotationHandler from './EditDenotationHandler'
import MouseEventHandler from './MouseEventHandler'
import SpanEditor from './SpanEditor'
import Edit from '../Edit'
import bindMouseEvents from './bindMouseEvents'
import TypeValuesPallet from '../../../../../component/TypeValuesPallet'
import isRangeInTextBox from '../isRangeInTextBox'
import OrderedPositions from '../OrderedPositions'
import SelectionWrapper from '../SelectionWrapper'

export default class EditDenotation extends Edit {
  constructor(
    editorHTMLElement,
    eventEmitter,
    annotationData,
    selectionModel,
    commander,
    buttonController,
    spanConfig,
    originalData,
    autocompletionWs
  ) {
    const denotationPallet = new TypeValuesPallet(
      editorHTMLElement,
      eventEmitter,
      originalData,
      annotationData,
      annotationData.typeDefinition.denotation,
      selectionModel.entity,
      commander,
      'Entity configuration'
    )

    const spanEditor = new SpanEditor(
      editorHTMLElement,
      annotationData,
      selectionModel,
      commander,
      buttonController,
      spanConfig
    )

    const getAutocompletionWs = () =>
      autocompletionWs || annotationData.typeDefinition.autocompletionWs

    const handler = new EditDenotationHandler(
      editorHTMLElement,
      annotationData.typeDefinition.denotation,
      commander,
      annotationData,
      selectionModel,
      denotationPallet,
      getAutocompletionWs
    )

    const mouseEventHandler = new MouseEventHandler(
      editorHTMLElement,
      annotationData,
      selectionModel,
      denotationPallet,
      spanEditor
    )

    super(
      editorHTMLElement,
      bindMouseEvents,
      mouseEventHandler,
      handler,
      denotationPallet,
      commander,
      getAutocompletionWs,
      annotationData.typeDefinition.denotation
    )

    this._spanEdtior = spanEditor
    this._mouseEventHandler = mouseEventHandler
    this._buttonController = buttonController
    this._textBox = editorHTMLElement.querySelector('.textae-editor__text-box')
    this._spanModelContainer = annotationData.span
  }

  createSpan() {
    this._spanEdtior.cerateSpanForTouchDevice()
  }

  expandSpan() {
    this._spanEdtior.expandForTouchDevice()
  }

  shrinkSpan() {
    this._spanEdtior.shrinkForTouchDevice()
  }

  applyTextSelection() {
    if (isRangeInTextBox(window.getSelection(), this._textBox)) {
      const { begin, end } = new OrderedPositions(
        new SelectionWrapper(this._spanModelContainer).positionsOnAnnotation
      )
      const isSelectionTextCrossingAnySpan =
        this._spanModelContainer.isBoundaryCrossingWithOtherSpans(begin, end)
      this._buttonController.updateManipulateSpanButtons(
        !isSelectionTextCrossingAnySpan,
        isSelectionTextCrossingAnySpan,
        isSelectionTextCrossingAnySpan
      )
    } else {
      this._buttonController.updateManipulateSpanButtons(false, false, false)
    }
  }
}
