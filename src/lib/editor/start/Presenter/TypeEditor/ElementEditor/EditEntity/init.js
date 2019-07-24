import spanClicked from './spanClicked'
import bodyClicked from './bodyClicked'
import typeValeusClicked from './typeValuesClicked'
import entityClicked from './entityClicked'

export default function(
  editor,
  cancelSelect,
  selectEnd,
  spanConfig,
  selectSpan,
  selectionModel
) {
  // For support context menu.
  // Mouse up event occurs when either left or right button is clicked.
  // Change mouse events to monitor from mouseup to click since v5.0.0.
  editor
    .on('click', '.textae-editor__body', (e) =>
      bodyClicked(cancelSelect, selectEnd, spanConfig, e)
    )
    .on('click', '.textae-editor__type', () => editor.focus())
    .on('click', '.textae-editor__type-values', (e) =>
      typeValeusClicked(selectionModel, e)
    )
    .on('click', '.textae-editor__entity', (e) =>
      entityClicked(selectionModel, e)
    )

  // To shrink a span listen the mouseup event.
  editor.on('mouseup', '.textae-editor__span', (e) =>
    spanClicked(spanConfig, selectEnd, selectSpan, e)
  )
}
