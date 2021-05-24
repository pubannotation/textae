import SpanEditor from './SpanEditor'
import bindMouseEvents from './bindMouseEvents'
import MouseEventHandler from './MouseEventHandler'
import Edit from '../Edit'
import EditBlockHandler from './EditBlockHandler'
import EntityAndAttributePallet from '../../../../../component/EntityAndAttributePallet'
import AttributeEditor from '../AttributeEditor'

export default class EditBlock extends Edit {
  constructor(
    editor,
    annotationData,
    selectionModel,
    spanConfig,
    commander,
    buttonController,
    originalData,
    autocompletionWs
  ) {
    const blockPallet = new EntityAndAttributePallet(
      editor,
      originalData,
      annotationData,
      annotationData.typeDefinition.block,
      selectionModel.entity,
      commander,
      'Entity configuration'
    )

    const attributeEditor = new AttributeEditor(
      commander,
      annotationData,
      selectionModel.entity,
      blockPallet
    )

    const handler = new EditBlockHandler(
      editor,
      annotationData.typeDefinition.block,
      commander,
      annotationData,
      selectionModel,
      attributeEditor
    )

    const spanEditor = new SpanEditor(
      editor,
      annotationData,
      spanConfig,
      commander,
      buttonController,
      selectionModel
    )

    super(
      editor,
      bindMouseEvents,
      new MouseEventHandler(
        editor,
        annotationData,
        selectionModel,
        spanEditor,
        blockPallet
      ),
      handler,
      blockPallet,
      commander,
      () => autocompletionWs || annotationData.typeDefinition.autocompletionWs,
      annotationData.typeDefinition.block
    )
  }
}
