import $ from 'jquery'
import 'jquery-ui/ui/widgets/autocomplete'

/* eslint no-underscore-dangle: 0 */
// Custumize jQuery-ui autocomplete
export default function () {
  // Repalce @ to font awesome icon
  $.ui.autocomplete.prototype._renderItem = ($ul, item) => {
    const $li = $(`
      <li>
        <div>
          ${item.label} <i class="fa fa-globe"></i>${item.id}
        </div>
      </li>`)

    $ul.append($li)

    return $li
  }

  $.ui.autocomplete.prototype._resizeMenu = () => {
    // Prepend resize menu
  }
}
