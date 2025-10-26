import 'jquery-ui/ui/widgets/draggable'

import $ from 'jquery'

export default function (element, editorHTMLElement) {
  $(element).draggable({
    containment: editorHTMLElement
  })
}
