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
      editor,
      annotationData,
      selectionModel,
      commander,
      buttonController,
      spanConfig
    )

    const handler = new EditDenotationHandler(
      editor,
      annotationData.typeDefinition.denotation,
      commander,
      annotationData,
      selectionModel,
      denotationPallet
    )

    const getAutocompletionWs = () =>
      autocompletionWs || annotationData.typeDefinition.autocompletionWs

    super(
      editor,
      bindMouseEvents,
      new MouseEventHandler(
        editor,
        annotationData,
        selectionModel,
        denotationPallet,
        spanEditor
      ),
      handler,
      denotationPallet,
      commander,
      getAutocompletionWs,
      annotationData.typeDefinition.denotation
    )
  }
}
