import Pallet from '../../../../component/Pallet'
import ElementEditor from './ElementEditor'
import cancelSelect from './cancelSelect'
import jsPlumbConnectionClicked from './jsPlumbConnectionClicked'
import bindPalletEvents from './bindPalletEvents'
import releasePalletUpateFunction from './releasePalletUpateFunction'
import rebindPalletUpdateFunction from './rebindPalletUpdateFunction'
import getTypeContainerForCurrentEditMode from './getTypeContainerForCurrentEditMode'

export default function(
  editor,
  history,
  annotationData,
  selectionModel,
  spanConfig,
  commander,
  pushButtons,
  originalData,
  typeDefinition,
  dataAccessObject,
  autocompletionWs
) {
  // will init.
  const elementEditor = new ElementEditor(
    editor,
    annotationData,
    selectionModel,
    spanConfig,
    commander,
    pushButtons,
    typeDefinition,
    () => cancelSelect(pallet, selectionModel)
  )

  const pallet = new Pallet(editor, originalData, typeDefinition)
  bindPalletEvents(pallet, elementEditor, autocompletionWs, editor, commander)
  // Bind events to pallet
  // Close pallet when selecting other editor.
  editor.eventEmitter.on('textae.pallet.close', () => pallet.hide())
  // Update save config button when changing history and savigng configuration.
  history.on('change', () => pallet.updateDisplay())
  dataAccessObject.on('configuration.save', () => pallet.updateDisplay())

  const updatePallet = () => pallet.updateDisplay()

  const api = {
    editRelation: elementEditor.start.editRelation,
    editEntity: elementEditor.start.editEntity,
    noEdit: elementEditor.start.noEdit,
    showPallet: (point) => {
      // Add the pallet to the editor to prevent focus out of the editor when radio buttnos on the pallet are clicked.
      if (!editor[0].querySelector('.textae-editor__type-pallet')) {
        editor[0].appendChild(pallet.el)
      }

      const typeContainer = getTypeContainerForCurrentEditMode(
        elementEditor,
        typeDefinition
      )
      pallet.show(point.point, typeContainer, elementEditor.getHandlerType())

      // Rebinding palette update function to TypeContainer in current editing mode.
      rebindPalletUpdateFunction(typeContainer, updatePallet)
      // Save the event emmitter to delete the event listener when the palette is reopend or closed.
      this._typeContainer = typeContainer
    },
    hidePallet: () => {
      // Release event listeners that bound when opening pallet.
      releasePalletUpateFunction(this._typeContainer, updatePallet)
      this._typeContainer = null
      pallet.hide()
    },
    changeLabel: () =>
      elementEditor.getHandler().changeLabelHandler(autocompletionWs),
    changeTypeOfSelectedElement: (newType) =>
      elementEditor.getHandler().changeTypeOfSelectedElement(newType),
    cancelSelect: () => cancelSelect(pallet, selectionModel),
    jsPlumbConnectionClicked: (jsPlumbConnection, event) =>
      jsPlumbConnectionClicked(elementEditor, jsPlumbConnection, event),
    getSelectedIdEditable: () =>
      elementEditor.getHandler().getSelectedIdEditable()
  }

  return api
}
