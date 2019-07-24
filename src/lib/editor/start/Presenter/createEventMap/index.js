import SettingDialog from '../../../../component/SettingDialog'
import ClipBoardHandler from './handlers/ClipBoardHandler'
import CreateEntityHandler from './handlers/CreateEntityHandler'
import ReplicateHandler from './handlers/ReplicateHandler'
import removeSelectedElements from './handlers/removeSelectedElements'
import ModificationHandler from './handlers/ModificationHandler'
import SelectHandler from './handlers/SelectHandler'
import cancelSelect from './cancelSelect'
import extendModeButtonHandlers from './extendModeButtonHandlers'
import extendToggleButtonHandler from './extendToggleButtonHandler'
import createAttribute from '../createAttribute'

export default function(
  command,
  selectionModel,
  typeDefinition,
  displayInstance,
  annotationData,
  buttonController,
  spanConfig,
  clipBoard,
  typeEditor,
  editor,
  editMode
) {
  const createEntityHandler = new CreateEntityHandler(
    command,
    selectionModel,
    typeDefinition.entity,
    displayInstance.notifyNewInstance
  )
  const replicateHandler = new ReplicateHandler(
    command,
    annotationData,
    selectionModel,
    buttonController.pushButtons,
    spanConfig
  )
  const clipBoardHandler = new ClipBoardHandler(
    command,
    annotationData,
    selectionModel,
    clipBoard
  )
  const modificationHandler = new ModificationHandler(
    command,
    annotationData,
    buttonController.pushButtons,
    typeEditor
  )
  const selectHandler = new SelectHandler(editor[0], selectionModel)
  const showSettingDialog = new SettingDialog(
    editor,
    typeDefinition,
    displayInstance
  )
  const event = {
    copyEntities: clipBoardHandler.copyEntities,
    removeSelectedElements: () =>
      removeSelectedElements(command, selectionModel, selectHandler),
    createEntity: createEntityHandler,
    showPallet: typeEditor.showPallet,
    replicate: replicateHandler,
    pasteEntities: clipBoardHandler.pasteEntities,
    changeLabel: typeEditor.changeLabel,
    changeLabelAndPred: typeEditor.changeLabelAndPred,
    cancelSelect: () => cancelSelect(typeEditor, editor),
    negation: modificationHandler.negation,
    speculation: modificationHandler.speculation,
    createAttribute: () => createAttribute(command, selectionModel),
    showSettingDialog
  }
  Object.assign(event, selectHandler)
  extendToggleButtonHandler(buttonController, editMode, event)
  extendModeButtonHandlers(editMode, event)
  return event
}
