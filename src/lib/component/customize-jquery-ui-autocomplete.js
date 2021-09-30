import $ from 'jquery'
import 'jquery-ui/ui/widget'
import 'jquery-ui/ui/widgets/autocomplete'
import eskape from 'eskape'

/* eslint no-underscore-dangle: 0 */
// Custumize jQuery-ui autocomplete
export default function () {
  // Repalce @ to font awesome icon
  $.ui.autocomplete.prototype._renderItem = ($ul, { id, label }) => {
    const $li = $(eskape`
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
