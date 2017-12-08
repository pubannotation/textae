import jQuerySugar from '../jQuerySugar'
import getJsonFromFile from './getJsonFromFile'
import label from './label'
import getAnnotationFromServer from './getAnnotationFromServer'
import CursorChanger from '../../util/CursorChanger'
import getDialog from './getDialog'
import $ from 'jquery'
import _ from 'underscore'

module.exports = function(api, confirmDiscardChangeMessage, setDataSourceUrl, editor) {
    let RowDiv = _.partial(jQuerySugar.Div, 'textae-editor__load-dialog__row'),
    RowLabel = _.partial(jQuerySugar.Label, 'textae-editor__load-dialog__label'),
    OpenButton = _.partial(jQuerySugar.Button, 'Open'),
    isUserComfirm = function() {
      return !$dialog.params.hasAnythingToSaveAnnotation || window.confirm(confirmDiscardChangeMessage)
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
      closeDialog($content)
    })
    .append(
      new RowDiv().append(
        new RowLabel(label.LOCAL),
        $('<input class="textae-editor__load-dialog__file" type="file" />'),
        $buttonLocal
      )
    )
    .on('change', '.textae-editor__load-dialog__file', function() {
      jQuerySugar.enabled($buttonLocal, this.files.length > 0)
    })
    .on('click', '[type="button"].local', function() {
      if (isUserComfirm()) {
        getJsonFromFile(api, $content.find('[type="file"]')[0], 'annotation')
      }
      closeDialog($content)
    })

  // Capture the local variable by inner funcitons.
  var $dialog = getDialog('textae.dialog.load', 'Load Annotations', $content[0], editor)

  return $dialog
}

function closeDialog($content) {
  $content.trigger('dialog.close')
}
