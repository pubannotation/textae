import jQuerySugar from '../jQuerySugar'
import label from './label'
import getAnnotationFromServer from './getAnnotationFromServer'
import CursorChanger from '../../util/CursorChanger'
import getDialog from './getDialog'
import $ from 'jquery'
import _ from 'underscore'

module.exports = function(api, confirmDiscardChangeMessage, setDataSourceUrl, editor) {
  var getAnnotationFromFile = function(file) {
      var firstFile = file.files[0],
        reader = new FileReader()

      reader.onload = function() {
        // Load json or .txt
        let annotation
        if (isJSON(this.result)) {
          annotation = JSON.parse(this.result)
        } else if (isTxtFile(firstFile.name)) {
          // If this is .txt, New annotation json is made from .txt
          annotation = {
            text: this.result
          }
        }

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
      return !$dialog.params.hasAnythingToSave || window.confirm(confirmDiscardChangeMessage)
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


function isJSON(arg) {
  arg = (typeof arg === "function") ? arg() : arg;
  if (typeof arg !== "string") {
    return false;
  }
  try {
    arg = (!JSON) ? eval("(" + arg + ")") : JSON.parse(arg)
    return true;
  } catch (e) {
    return false;
  }
}


function isTxtFile($fileName) {
  const f = $fileName.split('.');
  if (f[f.length - 1].toLowerCase() === 'txt') {
    return true;
  } else {
    return false;
  }
}
