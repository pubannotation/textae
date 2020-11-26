import EditHandler from './EditHandler'
import MouseEventHandler from './MouseEventHandler'
import SpanEditor from './SpanEditor'
import Edit from '../Edit'
import bindMouseEvents from './bindMouseEvents'
import EditAttribute from './EditAttribute'
import DeleteAttribute from './DeleteAttribute'
import EntityPallet from '../../../../../component/EntityPallet'

export default class EditDenotation extends Edit {
  constructor(
    editor,
    annotationData,
    selectionModel,
    commander,
    buttonController,
    typeDefinition,
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
    const denotationPallet = new EntityPallet(
      editor,
      originalData,
      typeDefinition,
      typeDefinition.denotation,
      selectionModel.entity
    )
    const editAttribute = new EditAttribute(
      commander,
      editor,
      annotationData,
      selectionModel,
      denotationPallet
    )
    const deleteAttribute = new DeleteAttribute(commander, annotationData)

    const handler = new EditHandler(
      editor,
      typeDefinition,
      commander,
      annotationData,
      selectionModel,
      editAttribute,
      deleteAttribute
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
      'denotation',
      () => autocompletionWs || typeDefinition.autocompletionWs,
      typeDefinition.denotation
    )
  }
}
