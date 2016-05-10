import CursorChanger from '../../util/CursorChanger'
import * as ajaxAccessor from '../../util/ajaxAccessor'
import getLoadDialog from './getLoadDialog'
import label from './label'
import jQuerySugar from '../jQuerySugar'
import getDialog from './getDialog'

module.exports = function(api, confirmDiscardChangeMessage, setDataSourceUrl, editor) {
  var cursorChanger = new CursorChanger(editor),
    showSaveSuccess = function() {
      api.emit('save')
      cursorChanger.endWait()
    },
    showSaveError = function() {
      api.emit('save error')
      cursorChanger.endWait()
    },
    saveAnnotationToServer = function(url, jsonData) {
      cursorChanger.startWait()
      ajaxAccessor.post(url, jsonData, showSaveSuccess, showSaveError, function() {
        cursorChanger.endWait()
      })
    },
    createDownloadPath = function(contents) {
      var blob = new Blob([contents], {
        type: 'application/json'
      })
      return URL.createObjectURL(blob)
    },
    getFilename = function() {
      var $fileInput = getLoadDialog(api, confirmDiscardChangeMessage, label, setDataSourceUrl, editor).find("input[type='file']"),
        file = $fileInput.prop('files')[0]

      return file ? file.name : 'annotations.json'
    },
    RowDiv = _.partial(jQuerySugar.Div, 'textae-editor__save-dialog__row'),
    RowLabel = _.partial(jQuerySugar.Label, 'textae-editor__save-dialog__label'),
    $saveButton = new jQuerySugar.Button('Save', 'url'),
    $content = $('<div>')
    .append(
      new RowDiv().append(
        new RowLabel(label.URL),
        $('<input type="text" class="textae-editor__save-dialog__server-file-name url" />'),
        $saveButton
      )
    )
    .on('input', 'input.url', function() {
      jQuerySugar.enabled($saveButton, this.value)
    })
    .on('click', '[type="button"].url', function() {
      saveAnnotationToServer(jQuerySugar.getValueFromText($content, 'url'), $dialog.params)
      $content.trigger('dialog.close')
    })
    .append(
      new RowDiv().append(
        new RowLabel(label.LOCAL),
        $('<input type="text" class="textae-editor__save-dialog__local-file-name local">'),
        $('<a class="download" href="#">Download</a>')
      )
    )
    .on('click', 'a.download', function() {
      var downloadPath = createDownloadPath($dialog.params)
      $(this)
        .attr('href', downloadPath)
        .attr('download', jQuerySugar.getValueFromText($content, 'local'))
      api.emit('save')
      $content.trigger('dialog.close')
    })
    .append(
      new RowDiv().append(
        new RowLabel(),
        $('<a class="viewsource" href="#">Click to see the json source in a new window.</a>')
      )
    )
    .on('click', 'a.viewsource', function(e) {
      var downloadPath = createDownloadPath($dialog.params)
      window.open(downloadPath, '_blank')
      api.emit('save')
      $content.trigger('dialog.close')
      return false
    })

  var $dialog = getDialog('textae.dialog.save', 'Save Annotations', $content[0], editor)

  // Set the filename when the dialog is opened.
  $dialog.on('dialogopen', function() {
    var filename = getFilename()
    $dialog
      .find('[type="text"].local')
      .val(filename)
  })

  return $dialog
}
