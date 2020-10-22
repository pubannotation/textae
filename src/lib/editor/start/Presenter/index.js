import TypeEditor from './TypeEditor'
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
    const typeEditor = new TypeEditor(
      editor,
      annotationData,
      selectionModel,
      spanConfig,
      commander,
      buttonController,
      originalData,
      typeDefinition,
      autocompletionWs
    )

    const displayInstance = new DisplayInstance(typeGap)
    const editMode = new EditMode(
      editor,
      annotationData,
      typeEditor,
      displayInstance
    )

    bindModelChange(editor, editMode, mode)

    this.event = new EventMap(
      editor,
      commander,
      selectionModel,
      typeDefinition,
      displayInstance,
      annotationData,
      buttonController,
      spanConfig,
      clipBoard,
      view,
      editMode
    )
  }
}
