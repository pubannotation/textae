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
import CreateAttribute from './CreateAttribute'

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
  const createAttribute = new CreateAttribute(
    commander,
    editor,
    annotationData,
    selectionModel
  )
  const event = {
    copyEntities: () => clipBoardHandler.copyEntities(),
    removeSelectedElements: () =>
      removeSelectedElements(commander, selectHandler),
    createEntity: () =>
      createEntityHandler(commander, typeDefinition, () =>
        displayInstance.notifyNewInstance()
      ),
    showPallet: (point) => typeEditor.showPallet(point),
    replicate: () =>
      replicateHandler(
        commander,
        annotationData,
        buttonController.pushButtons,
        spanConfig,
        selectionModel.span.single()
      ),
    pasteEntities: () => clipBoardHandler.pasteEntities(),
    changeLabel: () => typeEditor.changeLabel(),
    cancelSelect: () => cancelSelect(typeEditor, editor),
    negation: modificationHandler.negation,
    speculation: modificationHandler.speculation,
    createAttribute: (options, number) =>
      createAttribute.handle(options, typeDefinition, number),
    showSettingDialog: () => settingDialog.open(),
    select() {
      editor[0].classList.add('textae-editor--active')
    },
    unselect() {
      editor[0].classList.remove('textae-editor--active')
      editor.eventEmitter.emit('textae.editor.unselect')
    }
  }
  Object.assign(event, selectHandler)
  extendToggleButtonHandler(buttonController, editMode, event)
  extendModeButtonHandlers(editMode, event)
  return event
}
