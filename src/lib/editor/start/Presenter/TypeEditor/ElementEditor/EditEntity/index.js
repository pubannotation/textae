import SelectEnd from '../../SelectEnd'
import spanClicked from './spanClicked'
import SelectSpan from './SelectSpan'
import bodyClicked from './bodyClicked'
import typeLabelClicked from './typeLabelClicked'
import entityClicked from './entityClicked'
import entityPaneClicked from './entityPaneClicked'
import EditEntityHandler from './EditEntityHandler'

export default function(editor, model, command, modeAccordingToButton, typeContainer, spanConfig, cancelSelect) {
  let selectEnd = new SelectEnd(editor, model, command, modeAccordingToButton, typeContainer),
    selectSpan = new SelectSpan(editor, model.annotationData, model.selectionModel, typeContainer),
    selectionModel = model.selectionModel,
    init = () => {
      editor
        .on('mouseup', '.textae-editor__body', () => bodyClicked(cancelSelect, selectEnd, spanConfig))
        .on('mouseup', '.textae-editor__span', (e) => spanClicked(spanConfig, selectEnd, selectSpan, e))
        .on('mouseup', '.textae-editor__type-label', (e) => typeLabelClicked(selectionModel, e))
        .on('mouseup', '.textae-editor__entity-pane', (e) => entityPaneClicked(selectionModel, e))
        .on('mouseup', '.textae-editor__entity', (e) => entityClicked(selectionModel, e))
    },
    getSelectedIdEditable = selectionModel.entity.all

  return {
    init,
    handlers: new EditEntityHandler(typeContainer, command, model.annotationData, selectionModel)
  }
}
