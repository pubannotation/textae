import $ from 'jquery'
export default function enableJqueryDraggable(element, editor) {
  $(element).draggable({
    containment: editor
  })
}
