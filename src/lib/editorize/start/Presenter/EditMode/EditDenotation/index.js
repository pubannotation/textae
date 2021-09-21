import EditDenotationHandler from './EditDenotationHandler'
import MouseEventHandler from './MouseEventHandler'
import SpanEditor from './SpanEditor'
import Edit from '../Edit'
import bindMouseEvents from './bindMouseEvents'
import TypeValuesPallet from '../../../../../component/TypeValuesPallet'

export default class EditDenotation extends Edit {
  constructor(
    editor,
    annotationData,
    selectionModel,
    commander,
    buttonController,
    spanConfig,
    originalData,
    autocompletionWs
  ) {
    const denotationPallet = new TypeValuesPallet(
      editor,
      originalData,
      annotationData,
      annotationData.typeDefinition.denotation,
      selectionModel.entity,
      commander,
      'Entity configuration'
    )

    const spanEditor = new SpanEditor(
      editor[0],
      annotationData,
      selectionModel,
      commander,
      buttonController,
      spanConfig
    )

    const getAutocompletionWs = () =>
      autocompletionWs || annotationData.typeDefinition.autocompletionWs

    const handler = new EditDenotationHandler(
      editor,
      annotationData.typeDefinition.denotation,
      commander,
      annotationData,
      selectionModel,
      denotationPallet,
      getAutocompletionWs
    )

    const mouseEventHandler = new MouseEventHandler(
      editor[0],
      annotationData,
      selectionModel,
      denotationPallet,
      spanEditor
    )

    super(
      editor,
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
}
