import $ from 'jquery'
import 'jquery-ui/ui/widgets/autocomplete'
import anemone from './anemone'

/* eslint no-underscore-dangle: 0 */
// Customize jQuery-ui autocomplete
export default function () {
  // Replace @ to font awesome icon
  $.ui.autocomplete.prototype._renderItem = ($ul, { id, label }) => {
    const $li = $(anemone`
      <li>
        <div>
          ${label}
          <i class="fa fa-globe"></i>
          ${id}
        </div>
      </li>`)

    $ul.append($li)

    return $li
  }

  $.ui.autocomplete.prototype._resizeMenu = () => {
    // Prepend resize menu
  }
}
