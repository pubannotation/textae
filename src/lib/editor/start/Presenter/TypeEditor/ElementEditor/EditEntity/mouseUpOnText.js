import getSelectionSnapShot from './getSelectionSnapShot'

export default function(selectEnd, spanConfig, event) {
  // Span listens for mouse up events.
  // Click events on spans do not stop propagation.
  // If a click event occurs on a span, ignore that event.
  if (event.target.classList.contains('textae-editor__span')) {
    return
  }

  const selection = window.getSelection()

  // if text is seleceted
  if (!selection.isCollapsed) {
    selectEnd.onText({
      spanConfig,
      selection: getSelectionSnapShot()
    })
  }
}
