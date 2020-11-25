import EditHandler from './EditHandler'
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
    denotationPallet
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
        denotationPallet,
        spanEditor
      ),
      new EditHandler(
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
