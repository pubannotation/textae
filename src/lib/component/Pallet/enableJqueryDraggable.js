import $ from 'jquery'
import 'jquery-ui/ui/widgets/draggable'

export default function (element, editorHTMLElement) {
  $(element).draggable({
    containment: editorHTMLElement,
    distance: 10
  })
}
