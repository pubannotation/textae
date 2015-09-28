var Dialog = require('./Dialog')

module.exports = function(id, title, size, $content) {
  var $dialog = new Dialog(
    size,
    id,
    title,
    $content
  )

  return _.extend($dialog, {
    id: id
  })
}
