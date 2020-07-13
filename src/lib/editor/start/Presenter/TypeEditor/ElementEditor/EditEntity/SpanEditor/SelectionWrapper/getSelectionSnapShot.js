// Return the snap shot of the selection.
export default function() {
  const selection = window.getSelection()

  return {
    anchorNode: selection.anchorNode,
    anchorOffset: selection.anchorOffset,
    focusNode: selection.focusNode,
    focusOffset: selection.focusOffset,
    range: selection.getRangeAt(0)
  }
}
