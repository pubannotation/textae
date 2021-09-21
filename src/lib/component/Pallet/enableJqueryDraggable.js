import $ from 'jquery'
import 'jquery-ui/ui/widgets/draggable'

export default function (element, editor) {
  $(element).draggable({
    containment: editor[0],
    distance: 10
  })
}
