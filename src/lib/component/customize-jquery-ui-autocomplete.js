import $ from 'jquery'
import 'jquery-ui/ui/widgets/autocomplete'

/* eslint no-underscore-dangle: 0 */
// Custumize jQuery-ui autocomplete
export default function () {
  // Repalce @ to font awesome icon
  $.ui.autocomplete.prototype._renderItem = ($ul, item) => {
    const [label, url] = item.label.split('@')

    const $li = $(`
      <li>
        <div>
          ${label} <i class="fa fa-globe"></i>${url}
        </div>
      </li>`)

    $ul.append($li)

    return $li
  }

  $.ui.autocomplete.prototype._resizeMenu = () => {
    // Prepend resize menu
  }
}
