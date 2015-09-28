var Dialog = function(id, title, $content) {
    return $('<div>')
      .attr('id', id)
      .attr('title', title)
      .hide()
      .append($content)
  },
  OpenCloseMixin = function($dialog, openOption) {
    return {
      open: function() {
        $dialog.dialog(openOption)
      },
      close: function() {
        $dialog.dialog('close')
      },
    }
  },
  extendDialog = function(openOption, $dialog) {
    return _.extend(
      $dialog,
      new OpenCloseMixin($dialog, openOption)
    )
  },
  appendDialog = function($dialog) {
    $('body').append($dialog)
    return $dialog
  }

module.exports = function(openOption, id, title, $content) {
  openOption = _.extend({
    resizable: false,
    modal: true
  }, openOption)

  var extendDialogWithOpenOption = _.partial(extendDialog, openOption),
    createAndAppendDialog = _.compose(
      appendDialog,
      extendDialogWithOpenOption,
      Dialog
    )

  return createAndAppendDialog(id, title, $content)
}
