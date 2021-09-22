import EditDenotationHandler from './EditDenotationHandler'
import MouseEventHandler from './MouseEventHandler'
import SpanEditor from './SpanEditor'
import Edit from '../Edit'
import bindMouseEvents from './bindMouseEvents'
import TypeValuesPallet from '../../../../../component/TypeValuesPallet'

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
  }

  createSpan() {
    this._mouseEventHandler.textBoxClicked()
  }

  expandSpan() {
    this._spanEdtior.expandForTouchDevice()
  }

  shrinkSpan() {
    this._spanEdtior.shrinkForTouchDevice()
  }

  applyTextSelection() {
    this._buttonController.applyTextSelection()
  }
}
