import dismissBrowserSelection from '../../dismissBrowserSelection'

export default function() {
  let selection = window.getSelection(),
    snapShot = {
      anchorNode: selection.anchorNode,
      anchorOffset: selection.anchorOffset,
      focusNode: selection.focusNode,
      focusOffset: selection.focusOffset,
      range: selection.getRangeAt(0)
    }

  dismissBrowserSelection()

  // Return the snap shot of the selection.
  return snapShot
}
