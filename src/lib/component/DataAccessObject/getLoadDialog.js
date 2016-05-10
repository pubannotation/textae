import jQuerySugar from '../jQuerySugar'
import label from './label'
import getAnnotationFromServer from './getAnnotationFromServer'
import CursorChanger from '../../util/CursorChanger'
import getDialog from './getDialog'

module.exports = function(api, confirmDiscardChangeMessage, setDataSourceUrl, editor) {
  var getAnnotationFromFile = function(file) {
      var firstFile = file.files[0],
        reader = new FileReader()

      reader.onload = function() {
        var annotation = JSON.parse(this.result)
        api.emit('load', {
          annotation: annotation,
          source: firstFile.name + '(local file)'
        })
      }
      reader.readAsText(firstFile)
    },
    RowDiv = _.partial(jQuerySugar.Div, 'textae-editor__load-dialog__row'),
    RowLabel = _.partial(jQuerySugar.Label, 'textae-editor__load-dialog__label'),
    OpenButton = _.partial(jQuerySugar.Button, 'Open'),
    isUserComfirm = function() {
      // The params was set hasAnythingToSave.
      return !$dialog.params || window.confirm(confirmDiscardChangeMessage)
    },
    $buttonUrl = new OpenButton('url'),
    $buttonLocal = new OpenButton('local'),
    $content = $('<div>')
    .append(
      new RowDiv().append(
        new RowLabel(label.URL),
        $('<input type="text" class="textae-editor__load-dialog__file-name url" />'),
        $buttonUrl
      )
    )
    .on('input', '[type="text"].url', function() {
      jQuerySugar.enabled($buttonUrl, this.value)
    })
    .on('click', '[type="button"].url', function() {
      if (isUserComfirm()) {
        getAnnotationFromServer(jQuerySugar.getValueFromText($content, 'url'), new CursorChanger(editor), api, setDataSourceUrl)
      }

      $content.trigger('dialog.close')
    })
    .append(
      new RowDiv().append(
        new RowLabel(label.LOCAL),
        $('<input class="textae-editor__load-dialog__file" type="file" />'),
        $buttonLocal
      )
    )
    .on('change', '[type="file"]', function() {
      jQuerySugar.enabled($buttonLocal, this.files.length > 0)
    })
    .on('click', '[type="button"].local', function() {
      if (isUserComfirm()) {
        getAnnotationFromFile($content.find('[type="file"]')[0])
      }

      $content.trigger('dialog.close')
    })

  // Capture the local variable by inner funcitons.
  var $dialog = getDialog('textae.dialog.load', 'Load Annotations', $content[0], editor)

  return $dialog
}
