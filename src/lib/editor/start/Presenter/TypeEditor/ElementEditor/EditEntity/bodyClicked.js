import getSelectionSnapShot from './getSelectionSnapShot'

export default function(cancelSelect, selectEnd, spanConfig, event) {
  // Span listens for mouse up events.
  // Click events on spans do not stop propagation.
  // If a click event occurs on a span, ignore that event.
  if (event.target.classList.contains('textae-editor__span')) {
    return
  }

  const selection = window.getSelection()

  // No select
  if (selection.isCollapsed) {
    cancelSelect()
  } else {
    selectEnd.onText({
      spanConfig,
      selection: getSelectionSnapShot()
    })
  }
}
