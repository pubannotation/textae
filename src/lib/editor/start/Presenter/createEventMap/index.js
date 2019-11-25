import SettingDialog from '../../../../component/SettingDialog'
import ClipBoardHandler from './handlers/ClipBoardHandler'
import createEntityHandler from './handlers/createEntityHandler'
import replicateHandler from './handlers/replicateHandler'
import removeSelectedElements from './handlers/removeSelectedElements'
import ModificationHandler from './handlers/ModificationHandler'
import SelectHandler from './handlers/SelectHandler'
import cancelSelect from './cancelSelect'
import extendModeButtonHandlers from './extendModeButtonHandlers'
import extendToggleButtonHandler from './extendToggleButtonHandler'
import createAttribute from './createAttribute'

export default function(
  commander,
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
  const clipBoardHandler = new ClipBoardHandler(
    commander,
    annotationData,
    selectionModel,
    clipBoard
  )
  const modificationHandler = new ModificationHandler(
    commander,
    buttonController.pushButtons,
    typeEditor
  )
  const selectHandler = new SelectHandler(editor[0], selectionModel)
  const settingDialog = new SettingDialog(
    editor,
    typeDefinition,
    displayInstance
  )
  const event = {
    copyEntities: () => clipBoardHandler.copyEntities(),
    removeSelectedElements: () =>
      removeSelectedElements(commander, selectHandler),
    createEntity: () =>
      createEntityHandler(commander, typeDefinition, () =>
        displayInstance.notifyNewInstance()
      ),
    showPallet: typeEditor.showPallet,
    replicate: () =>
      replicateHandler(
        commander,
        annotationData,
        buttonController.pushButtons,
        spanConfig,
        selectionModel.span.single()
      ),
    pasteEntities: () => clipBoardHandler.pasteEntities(),
    changeLabel: typeEditor.changeLabel,
    changeLabelAndPred: typeEditor.changeLabelAndPred,
    cancelSelect: () => cancelSelect(typeEditor, editor),
    negation: modificationHandler.negation,
    speculation: modificationHandler.speculation,
    createAttribute: () => createAttribute(commander),
    showSettingDialog: () => settingDialog.open()
  }
  Object.assign(event, selectHandler)
  extendToggleButtonHandler(buttonController, editMode, event)
  extendModeButtonHandlers(editMode, event)
  return event
}
