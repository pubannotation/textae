import jQuerySugar from '../jQuerySugar'
import label from './label'
import getAnnotationFromServer from './getAnnotationFromServer'
import CursorChanger from '../../util/CursorChanger'
import getDialog from './getDialog'
import $ from 'jquery'
import _ from 'underscore'

module.exports = function(api, confirmDiscardChangeMessage, setDataSourceUrl, editor) {
  let getJsonFromFile = function(file, fileType) {
      let firstFile = file.files[0],
        reader = new FileReader(),
        params = {
          annotation: null,
          config: null,
          source: firstFile.name + '(local file)'
        }

      if (['annotation', 'config'].indexOf(fileType) === -1) {
        throw new Error('Cannot read data type of ' + fileType)
      }

      reader.onload = function() {
        // Load json or .txt
        let loadData
        if (isJSON(this.result)) {
          loadData = JSON.parse(this.result)
        } else if (isTxtFile(firstFile.name)) {
          // If this is .txt, New annotation json is made from .txt
          loadData = {
            text: this.result
          }
        }

        params[fileType] = loadData
        api.emit('load--' + fileType, params)
      }
      reader.readAsText(firstFile)
    },
    getAnnotationFromFile = (file) => {
      getJsonFromFile(file, 'annotation')
    },
    getConfigFromFile = (file) => {
      getJsonFromFile(file, 'config')
    },
    RowDiv = _.partial(jQuerySugar.Div, 'textae-editor__load-dialog__row'),
    RowLabel = _.partial(jQuerySugar.Label, 'textae-editor__load-dialog__label'),
    OpenButton = _.partial(jQuerySugar.Button, 'Open'),
    isUserComfirm = function() {
      return !$dialog.params.hasAnythingToSaveConfiguration || window.confirm(confirmDiscardChangeMessage)
    },
    $configButtonUrl = new OpenButton('url--config'),
    $configButtonLocal = new OpenButton('local--config'),
    $content = $('<div>')
      .append(
        new RowDiv().append(
          new RowLabel(label.URL),
          $('<input type="text" class="textae-editor__load-dialog__file-name--config url--config" />'),
          $configButtonUrl
        )
      )
      .on('input', 'input.url--config', function() {
        jQuerySugar.enabled($configButtonUrl, this.value)
      })
      .on('click', '[type="button"].url--config', function() {
        // if (isUserComfirm()) {
        //   getAnnotationFromServer(jQuerySugar.getValueFromText($configurationContent, 'url--config'), new CursorChanger(editor), api, setDataSourceUrl)
        // }
        // closeDialog($content)
      })
      .append(
        new RowDiv().append(
          new RowLabel(label.LOCAL),
          $('<input class="textae-editor__load-dialog__file--config" type="file" />'),
          $configButtonLocal
        )
      )
      .on('change', '.textae-editor__load-dialog__file--config', function() {
        jQuerySugar.enabled($configButtonLocal, this.files.length > 0)
      })
      .on('click', '[type="button"].local--config', function() {
        if (isUserComfirm()) {
          getConfigFromFile($content.find('.textae-editor__load-dialog__file--config')[0])
        }
        closeDialog($content)
      })

  // Capture the local variable by inner funcitons.
  var $dialog = getDialog('textae.dialog.load', 'Load Configurations', $content[0], editor)

  return $dialog
}


function isJSON(arg) {
  arg = (typeof arg === "function") ? arg() : arg
  if (typeof arg !== "string") {
    return false
  }
  try {
    arg = (!JSON) ? eval("(" + arg + ")") : JSON.parse(arg)
    return true
  } catch (e) {
    return false
  }
}


function isTxtFile($fileName) {
  const f = $fileName.split('.')
  if (f[f.length - 1].toLowerCase() === 'txt') {
    return true
  } else {
    return false
  }
}

function closeDialog($content) {
  $content.trigger('dialog.close')
}

