import SpanEditor from './SpanEditor'
import bindMouseEvents from './bindMouseEvents'
import MouseEventHandler from './MouseEventHandler'
import Edit from '../Edit'
import EditHandler from './EditHandler'

export default class EditBlock extends Edit {
  constructor(
    editor,
    annotationData,
    selectionModel,
    spanConfig,
    commander,
    buttonController,
    typeDefinition
  ) {
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
      new EditHandler(editor, typeDefinition, commander, selectionModel)
    )
  }
}
