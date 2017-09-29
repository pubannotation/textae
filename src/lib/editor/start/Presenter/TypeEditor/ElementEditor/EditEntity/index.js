import SelectEnd from '../../SelectEnd'
import spanClicked from './spanClicked'
import SelectSpan from './SelectSpan'
import bodyClicked from './bodyClicked'
import typeLabelClicked from './typeLabelClicked'
import entityClicked from './entityClicked'
import entityPaneClicked from './entityPaneClicked'
import EditEntityHandler from './EditEntityHandler'
import deleteButtonClicked from './deleteButtonClicked'

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
        .on('click', '.textae-editor__attribute-button--delete', (e) => deleteButtonClicked(annotationData, selectionModel, command, e))
    },
    getSelectedIdEditable = selectionModel.entity.all

  return {
    init,
    handlers: new EditEntityHandler(typeContainer, command, annotationData, selectionModel)
  }
}
