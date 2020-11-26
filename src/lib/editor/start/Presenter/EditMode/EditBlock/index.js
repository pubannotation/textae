import SpanEditor from './SpanEditor'
import bindMouseEvents from './bindMouseEvents'
import MouseEventHandler from './MouseEventHandler'
import Edit from '../Edit'
import EditHandler from './EditHandler'
import EntityPallet from '../../../../../component/EntityPallet'
import initPallet from '../initPallet'

export default class EditBlock extends Edit {
  constructor(
    editor,
    annotationData,
    selectionModel,
    spanConfig,
    commander,
    buttonController,
    typeDefinition,
    originalData,
    getAutocompletionWs
  ) {
    const blockPallet = new EntityPallet(
      editor,
      originalData,
      typeDefinition,
      typeDefinition.block,
      selectionModel.entity,
      'block'
    )

    const handler = new EditHandler(
      editor,
      typeDefinition,
      commander,
      annotationData,
      selectionModel
    )

    initPallet(
      blockPallet,
      editor,
      commander,
      'block',
      handler,
      getAutocompletionWs,
      typeDefinition.block
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
      new MouseEventHandler(editor, annotationData, selectionModel, spanEditor),
      handler,
      blockPallet
    )
  }
}
