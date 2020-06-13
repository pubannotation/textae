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
    clipBoardHandler,
    buttonController,
    typeGap,
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
      buttonController.pushButtons,
      originalData,
      typeDefinition,
      autocompletionWs
    )

    const displayInstance = new DisplayInstance(typeGap)
    const editMode = new EditMode(
      editor,
      annotationData,
      selectionModel,
      typeEditor,
      buttonController.buttonStateHelper,
      displayInstance
    )

    editor.eventEmitter
      .on('textae.editMode.transition', (editable, mode) => {
        typeEditor.cancelSelect()
        buttonController.setButtonState(editable, mode)
      })
      .on('textae.editor.body.click', () => typeEditor.cancelSelect())

    bindModelChange(editor, editMode, mode)

    this.event = new EventMap(
      commander,
      selectionModel,
      typeDefinition,
      displayInstance,
      annotationData,
      buttonController,
      spanConfig,
      clipBoardHandler,
      typeEditor,
      editor,
      editMode
    )

    // The jsPlumbConnetion has an original event mecanism.
    // We can only bind the connection directory.
    editor.on('textae.editor.jsPlumbConnection.add', (_, jsPlumbConnection) => {
      jsPlumbConnection.bindClickAction((jsPlumbConnection, event) =>
        typeEditor.jsPlumbConnectionClicked(jsPlumbConnection, event)
      )
    })
  }
}
