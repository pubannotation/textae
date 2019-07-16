import TypeEditor from './TypeEditor'
import EditMode from './EditMode'
import DisplayInstance from './DisplayInstance'
import transitSaveButton from './transitSaveButton'
import bindModelChange from './bindModelChange'
import createEventMap from './createEventMap'

export default class {
  constructor(
    editor,
    history,
    annotationData,
    selectionModel,
    command,
    spanConfig,
    clipBoard,
    buttonController,
    typeGap,
    typeDefinition,
    autocompletionWs,
    mode
  ) {
    const typeEditor = new TypeEditor(
      editor,
      history,
      annotationData,
      selectionModel,
      spanConfig,
      command,
      buttonController.modeAccordingToButton,
      typeDefinition,
      autocompletionWs
    )

    const editMode = new EditMode(
      editor,
      annotationData,
      selectionModel,
      typeEditor,
      buttonController.buttonStateHelper
    )

    const displayInstance = new DisplayInstance(
      typeGap,
      editMode
    )

    transitSaveButton(editMode, buttonController)
    bindModelChange(annotationData, editMode, mode)

    this.event = createEventMap(command, selectionModel, typeDefinition, displayInstance, annotationData, buttonController, spanConfig, clipBoard, typeEditor, editor, editMode)

    // The jsPlumbConnetion has an original event mecanism.
    // We can only bind the connection directory.
    editor
      .on('textae.editor.jsPlumbConnection.add', (_, jsPlumbConnection) => {
        jsPlumbConnection.bindClickAction(typeEditor.jsPlumbConnectionClicked)
      })
  }
}
