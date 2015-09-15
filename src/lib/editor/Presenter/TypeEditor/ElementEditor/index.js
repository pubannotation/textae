import EditRelation from './EditRelation'
import EditEntity from './EditEntity'
import unbindAllEventhandler from './unbindAllEventhandler'

const DEFAULT_HANDLER = {
  changeTypeOfSelected: null,
  getSelectedIdEditable: returnEmptyArray,
  getSelectedType: null,
  // The Reference to content to be shown in the pallet.
  typeContainer: null,
  // A Swithing point to change a behavior when relation is clicked.
  jsPlumbConnectionClicked: null
}

// Provide handlers to edit elements according to an edit mode.
export default function(editor, model, spanConfig, command, modeAccordingToButton, typeContainer, canselHandler) {
  let handler = Object.assign({}, DEFAULT_HANDLER),
    noEdit = function() {
      return [() => {}, DEFAULT_HANDLER]
    },
    editRelation = new EditRelation(editor, model.selectionModel, model.annotationData, command, typeContainer, canselHandler),
    editEntity = new EditEntity(editor, model, command, modeAccordingToButton, typeContainer, spanConfig, canselHandler)

  return {
    handler: handler,
    start: {
      noEdit: () => {
        let newState = noEdit()
        transit(editor, handler, newState)
      },
      editRelation: () => {
        let newState = editRelation()
        transit(editor, handler, newState)
      },
      editEntity: () => {
        let newState = editEntity()
        transit(editor, handler, newState)
      }
    }
  }
}

function transit(editor, handler, newState) {
  unbindAllEventhandler(editor)
  newState[0]()
  Object.assign(handler, newState[1])
}

function returnEmptyArray() {
  return []
}
