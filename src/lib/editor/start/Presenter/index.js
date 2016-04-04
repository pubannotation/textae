import SettingDialog from '../../../component/SettingDialog'
import TypeEditor from './TypeEditor'
import EditMode from './EditMode'
import DisplayInstance from './DisplayInstance'
import setDefaultEditability from './setDefaultEditability'
import ClipBoardHandler from './handlers/ClipBoardHandler'
import DefaultEntityHandler from './handlers/DefaultEntityHandler'
import removeSelectedElements from './handlers/removeSelectedElements'
import ModificationHandler from './handlers/ModificationHandler'
import SelectHandler from './handlers/SelectHandler'
import ToggleButtonHandler from './handlers/ToggleButtonHandler'
import ModeButtonHandlers from './handlers/ModeButtonHandlers'
import enableSaveButtorAtEditable from './enableSaveButtorAtEditable'

export default function(
  editor,
  annotationData,
  selectionModel,
  view,
  command,
  spanConfig,
  clipBoard,
  buttonController,
  typeGap,
  typeContainer,
  writable,
  autocompletionWs
) {
  const typeEditor = new TypeEditor(
      editor,
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
    defaultEntityHandler = new DefaultEntityHandler(
      command,
      annotationData,
      selectionModel,
      buttonController.modeAccordingToButton,
      spanConfig,
      typeContainer.entity
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
      displayInstance
    ),
    event = {
      editorSelected,
      editorUnselected,
      copyEntities: clipBoardHandler.copyEntities,
      removeSelectedElements: () => removeSelectedElements(
        command,
        selectionModel,
        selectHandler
      ),
      createEntity: defaultEntityHandler.createEntity,
      showPallet: typeEditor.showPallet,
      replicate: defaultEntityHandler.replicate,
      pasteEntities: clipBoardHandler.pasteEntities,
      changeLabel: typeEditor.changeLabel,
      cancelSelect,
      negation: modificationHandler.negation,
      speculation: modificationHandler.speculation,
      showSettingDialog: showSettingDialog
    }

  Object.assign(event, selectHandler)
  Object.assign(event, toggleButtonHandler)
  Object.assign(event, modeButtonHandlers)

  enableSaveButtorAtEditable(writable, editMode, buttonController)

  return {
    init: function(mode) {
      // The jsPlumbConnetion has an original event mecanism.
      // We can only bind the connection directory.
      editor
        .on('textae.editor.jsPlumbConnection.add', (event, jsPlumbConnection) => {
          jsPlumbConnection.bindClickAction(typeEditor.jsPlumbConnectionClicked)
        })

      defaultEntityHandler.on('createEntity', displayInstance.notifyNewInstance)
      setDefaultEditability(annotationData, editMode, writable, mode)
    },
    event: event
  }

  function editorSelected() {
    editor.eventEmitter.emit('textae.editor.select')
    buttonController.buttonStateHelper.propagate()
  }

  function editorUnselected() {
    typeEditor.hidePallet()
    editor.eventEmitter.emit('textae.editor.unselect')

    // Do not cancelSelect, because mouse up events occurs before blur events.
  }

  function cancelSelect() {
    typeEditor.cancelSelect()

    // Foucs the editor for ESC key
    editor.focus()
  }
}
