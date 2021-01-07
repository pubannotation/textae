import $ from 'jquery'
import 'jquery-ui/ui/widgets/autocomplete'

/* eslint no-underscore-dangle: 0 */
// Custumize jQuery-ui autocomplete
export default function () {
  // Repalce @ to font awesome icon
  $.ui.autocomplete.prototype._renderItem = (ul, item) => {
    const [label, url] = item.label.split('@')

    return $('<li>')
      .append($(`<div>${label} <i class="fa fa-globe"></i>${url}</div>`))
      .appendTo(ul)
  }

  $.ui.autocomplete.prototype._resizeMenu = () => {
    // Prepend resize menu
  }
}
