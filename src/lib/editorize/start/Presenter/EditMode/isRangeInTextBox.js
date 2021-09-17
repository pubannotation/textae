export default function (selection, textBoxHTMLElement) {
  return (
    selection.type === 'Range' &&
    textBoxHTMLElement.contains(selection.anchorNode) &&
    textBoxHTMLElement.contains(selection.focusNode)
  )
}
