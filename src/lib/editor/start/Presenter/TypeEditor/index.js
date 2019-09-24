import Pallet from '../../../../component/Pallet'
import ElementEditor from './ElementEditor'
import cancelSelect from './cancelSelect'
import jsPlumbConnectionClicked from './jsPlumbConnectionClicked'

export default function(
  editor,
  history,
  annotationData,
  selectionModel,
  spanConfig,
  commander,
  pushButtons,
  typeDefinition,
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

  const pallet = new Pallet(
    editor,
    history,
    commander,
    autocompletionWs,
    elementEditor
  )

  const api = {
    editRelation: elementEditor.start.editRelation,
    editEntity: elementEditor.start.editEntity,
    noEdit: elementEditor.start.noEdit,
    showPallet: (point) => {
      // Add the pallet to the editor to prevent focus out of the editor when radio buttnos on the pallet are clicked.
      if (!editor[0].querySelector('.textae-editor__type-pallet')) {
        editor[0].appendChild(pallet.el)
      }
      pallet.show(point.point)
    },
    hidePallet: pallet.hide,
    changeLabel: () =>
      elementEditor.getHandler().changeLabelHandler(autocompletionWs),
    changeLabelAndPred: null,
    changeTypeOfSelectedElement: (newType) =>
      elementEditor.getHandler().changeTypeOfSelectedElement(newType),
    changeSelectedElement: (newType) =>
      elementEditor.getHandler().changeSelectedElement(newType),
    cancelSelect: () => cancelSelect(pallet, selectionModel),
    jsPlumbConnectionClicked: (jsPlumbConnection, event) =>
      jsPlumbConnectionClicked(elementEditor, jsPlumbConnection, event),
    getSelectedIdEditable: () =>
      elementEditor.getHandler().getSelectedIdEditable()
  }

  return api
}
