import SettingDialog from '../../../component/SettingDialog'
import TypeEditor from './TypeEditor'
import EditMode from './EditMode'
import DisplayInstance from './DisplayInstance'
import ClipBoardHandler from './handlers/ClipBoardHandler'
import CreateEntityHandler from './handlers/CreateEntityHandler'
import ReplicateHandler from './handlers/ReplicateHandler'
import CreateAttributeHandler from './handlers/CreateAttributeHandler'
import removeSelectedElements from './handlers/removeSelectedElements'
import ModificationHandler from './handlers/ModificationHandler'
import SelectHandler from './handlers/SelectHandler'
import ToggleButtonHandler from './handlers/ToggleButtonHandler'
import ModeButtonHandlers from './handlers/ModeButtonHandlers'
import transitSaveButton from './transitSaveButton'
import bindModelChange from './bindModelChange'

export default function(
  editor,
  history,
  annotationData,
  selectionModel,
  command,
  spanConfig,
  clipBoard,
  buttonController,
  typeGap,
  typeContainer,
  writable,
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
      typeContainer,
      autocompletionWs
    ),
    editMode = new EditMode(
      editor,
      annotationData,
      selectionModel,
      typeEditor,
      buttonController.buttonStateHelper
    ),
    displayInstance = new DisplayInstance(
      typeGap,
      editMode
    ),
    createEntityHandler = new CreateEntityHandler(
      command,
      selectionModel,
      typeContainer.entity,
      displayInstance.notifyNewInstance
    ),
    replicateHandler = new ReplicateHandler(
      command,
      annotationData,
      selectionModel,
      buttonController.modeAccordingToButton,
      spanConfig
    ),
    createAttributeHandler = new CreateAttributeHandler(
      command,
      selectionModel,
      typeContainer.attribute
    ),
    clipBoardHandler = new ClipBoardHandler(
      command,
      annotationData,
      selectionModel,
      clipBoard
    ),
    modificationHandler = new ModificationHandler(
      command,
      annotationData,
      buttonController.modeAccordingToButton,
      typeEditor
    ),
    toggleButtonHandler = new ToggleButtonHandler(
      buttonController.modeAccordingToButton,
      editMode
    ),
    modeButtonHandlers = new ModeButtonHandlers(
      editMode
    ),
    selectHandler = new SelectHandler(
      editor[0],
      selectionModel
    ),
    showSettingDialog = new SettingDialog(
      editor,
      typeContainer,
      displayInstance
    ),
    event = {
      copyEntities: clipBoardHandler.copyEntities,
      removeSelectedElements: () => removeSelectedElements(
        command,
        selectionModel,
        selectHandler
      ),
      createEntity: createEntityHandler,
      createAttribute: createAttributeHandler,
      showPallet: typeEditor.showPallet,
      replicate: replicateHandler,
      pasteEntities: clipBoardHandler.pasteEntities,
      changeLabel: typeEditor.changeLabel,
      changeLabelAndPred: typeEditor.changeLabelAndPred,
      cancelSelect,
      negation: modificationHandler.negation,
      speculation: modificationHandler.speculation,
      showSettingDialog: showSettingDialog
    }

  Object.assign(event, selectHandler)
  Object.assign(event, toggleButtonHandler)
  Object.assign(event, modeButtonHandlers)

  transitSaveButton(writable, editMode, buttonController)

  // The jsPlumbConnetion has an original event mecanism.
  // We can only bind the connection directory.
  editor
    .on('textae.editor.jsPlumbConnection.add', (event, jsPlumbConnection) => {
      jsPlumbConnection.bindClickAction(typeEditor.jsPlumbConnectionClicked)
    })

  bindModelChange(annotationData, writable, editMode, mode)

  return {
    event
  }

  function cancelSelect() {
    typeEditor.cancelSelect()

    // Foucs the editor for ESC key
    editor.focus()
  }
}
