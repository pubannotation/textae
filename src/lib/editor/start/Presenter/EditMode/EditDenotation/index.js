import EditHandler from './EditHandler'
import MouseEventHandler from './MouseEventHandler'
import SpanEditor from './SpanEditor'
import Edit from '../Edit'
import bindMouseEvents from './bindMouseEvents'
import EditAttribute from './EditAttribute'
import DeleteAttribute from './DeleteAttribute'

export default class EditDenotation extends Edit {
  constructor(
    editor,
    annotationData,
    selectionModel,
    commander,
    buttonController,
    typeDefinition,
    spanConfig,
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
    const editAttribute = new EditAttribute(
      commander,
      editor,
      annotationData,
      selectionModel,
      denotationPallet
    )
    const deleteAttribute = new DeleteAttribute(commander, annotationData)

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
