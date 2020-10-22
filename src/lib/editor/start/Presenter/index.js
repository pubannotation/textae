import EditMode from './EditMode'
import DisplayInstance from './EditMode/DisplayInstance'
import bindModelChange from './bindModelChange'
import EventMap from './EventMap'

export default class {
  constructor(
    editor,
    annotationData,
    selectionModel,
    commander,
    spanConfig,
    clipBoard,
    buttonController,
    typeGap,
    view,
    originalData,
    typeDefinition,
    autocompletionWs,
    mode
  ) {
    const editMode = new EditMode(
      editor,
      annotationData,
      selectionModel,
      spanConfig,
      commander,
      buttonController,
      originalData,
      typeDefinition,
      autocompletionWs,
      typeGap
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
