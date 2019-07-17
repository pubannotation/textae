import getSelectionSnapShot from './getSelectionSnapShot'

export default function(spanConfig, selectEnd, selectSpan, event) {
  const selection = window.getSelection()

  // No select
  if (selection.isCollapsed) {
    selectSpan(event)
    return false
  } else {
    selectEnd.onSpan({
      spanConfig: spanConfig,
      selection: getSelectionSnapShot()
    })
    // Cancel selection of a paragraph.
    // And do non propagate the parent span.
    event.stopPropagation()
  }
}
