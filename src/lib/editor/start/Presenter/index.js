import EditMode from './EditMode'
import DisplayInstance from './DisplayInstance'
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
    const displayInstance = new DisplayInstance(typeGap)
    const editMode = new EditMode(
      editor,
      annotationData,
      displayInstance,
      selectionModel,
      spanConfig,
      commander,
      buttonController,
      originalData,
      typeDefinition,
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
