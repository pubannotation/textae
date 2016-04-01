import Pallet from '../../../../component/Pallet'
import ElementEditor from './ElementEditor'
import changeLabelHandler from './changeLabelHandler'

export default function(
  editor,
  annotationData,
  selectionModel,
  spanConfig,
  command,
  modeAccordingToButton,
  typeContainer,
  autocompletionWs
) {
  // will init.
  let elementEditor = new ElementEditor(
      editor,
      annotationData,
      selectionModel,
      spanConfig,
      command,
      modeAccordingToButton,
      typeContainer, () => cancelSelect(pallet, selectionModel)
    ),
    pallet = new Pallet(
      (label) => {
        const commands = elementEditor.getHandler().changeTypeOfSelectedElement(label)
        command.invoke(commands)
      }, (label) => {
        elementEditor.getHandler().typeContainer.setDefaultType(label)
        // Focus the editor to prevent lost focus when the pallet is closed during selecting radio buttons.
        editor[0].focus()
      }
    ),
    api = {
      editRelation: elementEditor.start.editRelation,
      editEntity: elementEditor.start.editEntity,
      noEdit: elementEditor.start.noEdit,
      showPallet: (point) => {
        // Add the pallet to the editor to prevent focus out of the editor when radio buttnos on the pallet are clicked.
        if (!editor[0].querySelector('.textae-editor__type-pallet')) {
          editor[0].appendChild(pallet.el)
        }
        pallet.show(elementEditor.getHandler().typeContainer, point.point)
      },
      hidePallet: pallet.hide,
      getTypeOfSelected: () => elementEditor.getHandler().getSelectedType(),
      changeLabel: () => changeLabelHandler(editor, elementEditor.getHandler, autocompletionWs),
      changeTypeOfSelectedElement: (newType) => elementEditor.getHandler().changeTypeOfSelectedElement(newType),
      cancelSelect: () => cancelSelect(pallet, selectionModel),
      jsPlumbConnectionClicked: (jsPlumbConnection, event) => jsPlumbConnectionClicked(
        elementEditor,
        jsPlumbConnection,
        event
      ),
      getSelectedIdEditable: () => elementEditor.getHandler().getSelectedIdEditable()
    }

  return api
}

function cancelSelect(pallet, selectionModel) {
  pallet.hide()
  selectionModel.clear()
}

// A relation is drawn by a jsPlumbConnection.
// The EventHandlar for clieck event of jsPlumbConnection.
function jsPlumbConnectionClicked(elementEditor, jsPlumbConnection, event) {
  // Check the event is processed already.
  // Because the jsPlumb will call the event handler twice
  // when a label is clicked that of a relation added after the initiation.
  if (elementEditor.getHandler().jsPlumbConnectionClicked && !event.processedByTextae) {
    elementEditor.getHandler().jsPlumbConnectionClicked(jsPlumbConnection, event)
  }

  event.processedByTextae = true
}
