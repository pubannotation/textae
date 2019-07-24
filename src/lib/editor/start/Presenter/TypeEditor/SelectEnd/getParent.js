export { getAnchorNodeParent, getFocusNodeParent }
import $ from 'jquery'

function getAnchorNodeParent(selection) {
  return $(selection.anchorNode.parentNode)
}

function getFocusNodeParent(selection) {
  return $(selection.focusNode.parentNode)
}
