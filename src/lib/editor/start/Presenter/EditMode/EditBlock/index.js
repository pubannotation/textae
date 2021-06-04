import SpanEditor from './SpanEditor'
import bindMouseEvents from './bindMouseEvents'
import MouseEventHandler from './MouseEventHandler'
import Edit from '../Edit'
import EditBlockHandler from './EditBlockHandler'
import TypeValuesPallet from '../../../../../component/TypeValuesPallet'

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
    const spanEditor = new SpanEditor(
      editor,
      annotationData,
      spanConfig,
      commander,
      buttonController,
      selectionModel
    )

    const blockPallet = new TypeValuesPallet(
      editor,
      originalData,
      annotationData,
      annotationData.typeDefinition.block,
      selectionModel.entity,
      commander,
      'Entity configuration'
    )

    const handler = new EditBlockHandler(
      editor,
      annotationData.typeDefinition.block,
      commander,
      annotationData,
      selectionModel,
      blockPallet
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
