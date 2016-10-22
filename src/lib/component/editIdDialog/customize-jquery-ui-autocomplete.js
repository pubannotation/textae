/* eslint no-underscore-dangle: 0 */
// Custumize jQuery-ui autocomplete
module.exports = function() {
  // Repalce @ to font awesome icon
  $.ui.autocomplete.prototype._renderItem = function(ul, item) {
    const [label, url] = item.label.split('@')

    return $("<li>")
      .append($(`<div>${label} <i class="fa fa-globe"></i>${url}</div>`))
      .appendTo(ul)
  }

  $.ui.autocomplete.prototype._resizeMenu = function() {
    // Prepend resize menu
  }
}
