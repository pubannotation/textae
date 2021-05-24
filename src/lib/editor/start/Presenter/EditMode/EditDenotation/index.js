import EditDenotationHandler from './EditDenotationHandler'
import MouseEventHandler from './MouseEventHandler'
import SpanEditor from './SpanEditor'
import Edit from '../Edit'
import bindMouseEvents from './bindMouseEvents'
import AttributeEditor from '../AttributeEditor'
import EntityAndAttributePallet from '../../../../../component/EntityAndAttributePallet'

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
    const spanEditor = new SpanEditor(
      editor,
      annotationData,
      selectionModel,
      commander,
      buttonController,
      spanConfig
    )
    const denotationPallet = new EntityAndAttributePallet(
      editor,
      originalData,
      annotationData,
      annotationData.typeDefinition.denotation,
      selectionModel.entity,
      commander,
      'Entity configuration'
    )

    const attributeEditor = new AttributeEditor(
      commander,
      annotationData,
      selectionModel.entity,
      denotationPallet
    )

    const handler = new EditDenotationHandler(
      editor,
      annotationData.typeDefinition.denotation,
      commander,
      annotationData,
      selectionModel,
      attributeEditor
    )

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
      () => autocompletionWs || annotationData.typeDefinition.autocompletionWs,
      annotationData.typeDefinition.denotation
    )
  }
}
