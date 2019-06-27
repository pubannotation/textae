import spanClicked from './spanClicked'
import bodyClicked from './bodyClicked'
import typeLabelClicked from './typeLabelClicked'
import entityClicked from './entityClicked'
import entityPaneClicked from './entityPaneClicked'

export default function(editor, cancelSelect, selectEnd, spanConfig, selectSpan, selectionModel) {
  editor
    .on('mouseup', '.textae-editor__body', () => bodyClicked(cancelSelect, selectEnd, spanConfig))
    .on('mouseup', '.textae-editor__type', () => editor.focus())
    .on('mouseup', '.textae-editor__span', (e) => spanClicked(spanConfig, selectEnd, selectSpan, e))
    .on('mouseup', '.textae-editor__type-label', (e) => typeLabelClicked(selectionModel, e))
    .on('mouseup', '.textae-editor__entity-pane', (e) => entityPaneClicked(selectionModel, e))
    .on('mouseup', '.textae-editor__entity', (e) => entityClicked(selectionModel, e))
}
