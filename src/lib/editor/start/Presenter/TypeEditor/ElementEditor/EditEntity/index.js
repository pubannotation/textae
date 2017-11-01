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
        .on('click', '.textae-editor__attribute-button--edit', (e) => editButtonClicked(editor, annotationData, selectionModel, command, typeContainer, e))
        .on('click', '.textae-editor__attribute-button--delete', (e) => deleteButtonClicked(annotationData, selectionModel, command, e))
      },
      handlers = () => {
        if (selectionModel.entity.all().length >= 1) {
          return new EditEntityHandler(typeContainer, command, annotationData, selectionModel)
        }

        return new EditAttributeHandler(typeContainer, command, annotationData, selectionModel)
      }

  return {
    init,
    handlers: handlers
  }
}

function editButtonClicked(editor, annotationData, selectionModel, command, typeContainer, e) {
  let attributeId = getAttributeIdByClickedButton(e),
    label = annotationData.attribute.get(attributeId).type,
    handler = new EditAttributeHandler(typeContainer, command, annotationData, selectionModel)

  selectAttribute(selectionModel, e)
  editor.api.handlePopupClick('textae.popup.button.change_label.click', null)

  // selectionModel.attribute.remove(attributeId)
}

function selectAttribute(selectionModel, e) {
  let attributeId = getAttributeIdByClickedButton(e)
  selectionModel.clear()
  selectionModel.attribute.add(attributeId)
}

function setAttributeHandler(selectionModel, e) {
  let attributeId = getAttributeIdByClickedButton(e)
  selectionModel.clear()
  selectionModel.attribute.add(attributeId)
}
