import $ from 'jquery'

export default function(selection) {
  return $(selection.anchorNode.parentNode)
}
