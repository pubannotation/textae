import EditMode from './EditMode'
import bindModelChange from './bindModelChange'
import EventMap from './EventMap'

export default class Presenter {
  constructor(
    editor,
    annotationData,
    selectionModel,
    commander,
    spanConfig,
    clipBoard,
    buttonController,
    view,
    originalData,
    autocompletionWs,
    mode
  ) {
    const typeDefinition = annotationData.typeDefinition

    const editMode = new EditMode(
      editor,
      annotationData,
      selectionModel,
      spanConfig,
      commander,
      buttonController,
      originalData,
      autocompletionWs
    )

    bindModelChange(editor, editMode, mode)

    this.event = new EventMap(
      editor,
      commander,
      selectionModel,
      typeDefinition,
      annotationData,
      buttonController,
      spanConfig,
      clipBoard,
      view,
      editMode
    )
  }
}
