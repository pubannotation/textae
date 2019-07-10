import EditRelation from './EditRelation'
import EditEntity from './EditEntity'
import unbindAllMouseEventhandler from './unbindAllMouseEventhandler'
import getHandler from './getHandler'
import getHandlerForPallet from './getHandlerForPallet'
import initiateEditAttribute from './initiateEditAttribute'

// Provide handlers to edit elements according to an edit mode.
export default function(editor, annotationData, selectionModel, spanConfig, command, modeAccordingToButton, typeContainer, cancelSelect) {
  let handler = 'default'

  const editEntity = new EditEntity(editor, annotationData, selectionModel, command, modeAccordingToButton, typeContainer, spanConfig, cancelSelect)
  const editRelation = new EditRelation(editor, annotationData, selectionModel, command, typeContainer, cancelSelect)

  return {
    getHandlerType: () => handler,
    getHandler: () => getHandler(handler, editEntity, editRelation),
    getHandlerForPallet: () => getHandlerForPallet(handler, editEntity, editRelation),
    start: {
      noEdit: () => {
        unbindAllMouseEventhandler(editor)
        handler = 'default'
      },
      editEntity: () => {
        unbindAllMouseEventhandler(editor)

        editEntity.init()
        initiateEditAttribute(editor, annotationData, selectionModel, command)

        handler = 'entity'
      },
      editRelation: () => {
        unbindAllMouseEventhandler(editor)

        editRelation.init()
        handler = 'relation'
      }
    }
  }
}

