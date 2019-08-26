import $ from 'jquery'
require('jquery-ui/ui/widgets/draggable')

export default function enableJqueryDraggable(element, editor) {
  $(element).draggable({
    containment: editor
  })
}
