import EditRelation from './EditRelation'
import EditEntity from './EditEntity'
import unbindAllEventhandler from './unbindAllEventhandler'
import DefaultHandler from './DefaultHandler'

// Provide handlers to edit elements according to an edit mode.
export default function(editor, annotationData, selectionModel, spanConfig, command, modeAccordingToButton, typeContainer, cancelSelect) {
  let handler = 'default'

  const editEntity = new EditEntity(editor, annotationData, selectionModel, command, modeAccordingToButton, typeContainer, spanConfig, cancelSelect),
  editRelation = new EditRelation(editor, annotationData, selectionModel, command, typeContainer, cancelSelect)

  return {
    getHandler: () => getHandler(handler, editEntity, editRelation),
    start: {
      noEdit: () => {
        unbindAllEventhandler(editor)
        handler = 'default'
      },
      editEntity: () => {
        unbindAllEventhandler(editor)

        editEntity.init()
        handler = 'entity'
      },
      editRelation: () => {
        unbindAllEventhandler(editor)

        editRelation.init()
        handler = 'relation'
      }
    }
  }
}

function getHandler(handler, editEntity, editRelation) {
  switch (handler) {
    case 'entity' : return editEntity.handlers()
    case 'relation' : return editRelation.handlers
    default : return new DefaultHandler()
  }
}
