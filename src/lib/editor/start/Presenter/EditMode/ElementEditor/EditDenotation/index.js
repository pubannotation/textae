import EditEntityHandler from './EditEntityHandler'
import MouseEventHandler from './MouseEventHandler'
import SpanEditor from './SpanEditor'
import Edit from '../Edit'
import bindMouseEvents from './bindMouseEvents'

export default class EditDenotation extends Edit {
  constructor(
    editor,
    annotationData,
    selectionModel,
    commander,
    buttonController,
    typeDefinition,
    spanConfig,
    editAttribute,
    deleteAttribute,
    entityPallet
  ) {
    const spanEditor = new SpanEditor(
      editor,
      annotationData,
      selectionModel,
      commander,
      buttonController,
      spanConfig
    )
    super(
      editor,
      bindMouseEvents,
      new MouseEventHandler(
        editor,
        annotationData,
        selectionModel,
        entityPallet,
        spanEditor
      ),
      new EditEntityHandler(
        editor,
        typeDefinition,
        commander,
        annotationData,
        selectionModel,
        editAttribute,
        deleteAttribute
      )
    )
  }
}
