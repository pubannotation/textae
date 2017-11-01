import EditRelation from './EditRelation'
import EditEntity from './EditEntity'
import EditAttribute from './EditAttibute'
import unbindAllEventhandler from './unbindAllEventhandler'
import DefaultHandler from './DefaultHandler'

// Provide handlers to edit elements according to an edit mode.
export default function(editor, annotationData, selectionModel, spanConfig, command, modeAccordingToButton, typeContainer, cancelSelect) {
  let handler = new DefaultHandler()

  const editRelation = new EditRelation(editor, annotationData, selectionModel, command, typeContainer, cancelSelect),
    editEntity = new EditEntity(editor, annotationData, selectionModel, command, modeAccordingToButton, typeContainer, spanConfig, cancelSelect),
    editAttribute = new EditAttribute(editor, annotationData, selectionModel, command, typeContainer, cancelSelect)

  return {
    getHandler: () => handler,
    start: {
      noEdit: () => {
        unbindAllEventhandler(editor)
        handler = new DefaultHandler()
      },
      editEntity: () => {
        unbindAllEventhandler(editor)

        editEntity.init()
        editAttribute.init()
        handler = editEntity.handlers
      },
      editRelation: () => {
        unbindAllEventhandler(editor)

        editRelation.init()
        handler = editRelation.handlers
      }
    }
  }
}
