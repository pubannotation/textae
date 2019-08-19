import $ from 'jquery'

export default function(selection) {
  return $(selection.focusNode.parentNode)
}
