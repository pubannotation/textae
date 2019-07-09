import spanClicked from './spanClicked'
import bodyClicked from './bodyClicked'
import typeLabelClicked from './typeLabelClicked'
import entityClicked from './entityClicked'
import entityPaneClicked from './entityPaneClicked'

export default function(editor, cancelSelect, selectEnd, spanConfig, selectSpan, selectionModel) {
  // For support context menu.
  // Mouse up event occurs when either left or right button is clicked.
  // Change mouse events to monitor from mouseup to click since v5.0.0.
  editor
    .on('click', '.textae-editor__body', () => bodyClicked(cancelSelect, selectEnd, spanConfig))
    .on('click', '.textae-editor__type', () => editor.focus())
    .on('click', '.textae-editor__span', (e) => spanClicked(spanConfig, selectEnd, selectSpan, e))
    .on('click', '.textae-editor__type-label', (e) => typeLabelClicked(selectionModel, e))
    .on('click', '.textae-editor__entity-pane', (e) => entityPaneClicked(selectionModel, e))
    .on('click', '.textae-editor__entity', (e) => entityClicked(selectionModel, e))
}
