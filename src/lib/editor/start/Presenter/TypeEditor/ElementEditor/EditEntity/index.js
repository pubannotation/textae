import SelectEnd from '../../SelectEnd'
import spanClicked from './spanClicked'
import SelectSpan from './SelectSpan'
import bodyClicked from './bodyClicked'
import typeLabelClicked from './typeLabelClicked'
import entityClicked from './entityClicked'
import entityPaneClicked from './entityPaneClicked'
import EditEntityHandler from './EditEntityHandler'
import EditAttributeHandler from './EditAttributeHandler'
import deleteButtonClicked from './deleteButtonClicked'
import getAttributeIdByClickedButton from './getAttributeIdByClickedButton'

export default function(editor, annotationData, selectionModel, command, modeAccordingToButton, typeContainer, spanConfig, cancelSelect) {
  const selectEnd = new SelectEnd(editor, annotationData, selectionModel, command, modeAccordingToButton, typeContainer),
    selectSpan = new SelectSpan(editor, annotationData, selectionModel, typeContainer),
    init = () => {
      editor
        .on('mouseup', '.textae-editor__body', () => bodyClicked(cancelSelect, selectEnd, spanConfig))
        .on('mouseup', '.textae-editor__type', () => editor.focus())
        .on('mouseup', '.textae-editor__span', (e) => spanClicked(spanConfig, selectEnd, selectSpan, e))
        .on('mouseup', '.textae-editor__type-label', (e) => typeLabelClicked(selectionModel, e))
        .on('mouseup', '.textae-editor__entity-pane', (e) => entityPaneClicked(selectionModel, e))
        .on('mouseup', '.textae-editor__entity', (e) => entityClicked(selectionModel, e))
        .on('click', '.textae-editor__attribute-button--add', (e) => addButtonClicked(editor, selectionModel, e))
        .on('click', '.textae-editor__attribute-button--edit', (e) => editButtonClicked(editor, selectionModel, e))
        .on('click', '.textae-editor__attribute-button--delete', (e) => deleteButtonClicked(annotationData, selectionModel, command, e))
      },
      entityHandler = () => {
        return new EditEntityHandler(typeContainer, command, annotationData, selectionModel)
      },
      attributeHandler = () => {
        return new EditAttributeHandler(typeContainer, command, annotationData, selectionModel)
      },
      handlers = () => {
        if (selectionModel.entity.all().length >= 1) {
          return entityHandler(typeContainer, command, annotationData, selectionModel)
        }

        return attributeHandler(typeContainer, command, annotationData, selectionModel)
      }

  return {
    init,
    entityHandler: entityHandler,
    attributeHandler: attributeHandler,
    handlers: handlers
  }
}

function addButtonClicked(editor, selectionModel, e) {
  let entityId = e.target.parentNode.querySelector('.textae-editor__entity').getAttribute('title')
  selectionModel.clear()
  selectionModel.entity.add(entityId)
  editor.api.handlePopupClick('textae.popup.button.add_attribute.click', null)
}

function editButtonClicked(editor, selectionModel, e) {
  let attributeId = getAttributeIdByClickedButton(e)
  selectionModel.clear()
  selectionModel.attribute.add(attributeId)
  editor.api.handlePopupClick('textae.popup.button.change_label.click', null)
}
