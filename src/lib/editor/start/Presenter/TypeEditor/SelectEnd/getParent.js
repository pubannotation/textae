export {
  getAnchorNodeParent,
  getFocusNodeParent
}

function getAnchorNodeParent(selection) {
  return $(selection.anchorNode.parentNode)
}

function getFocusNodeParent(selection) {
  return $(selection.focusNode.parentNode)
}
