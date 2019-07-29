import CursorChanger from '../../util/CursorChanger'
import label from './label'
import jQuerySugar from '../jQuerySugar'
import getDialog from './getDialog'
import jsonDiff from '../../util/jsonDiff'
import $ from 'jquery'
import _ from 'underscore'

module.exports = function(api, editor, saveToServer, onSave) {
  const cursorChanger = new CursorChanger(editor)
  const showSaveSuccess = function() {
    onSave()
    cursorChanger.endWait()
    closeDialog($content)
  }
  const showSaveError = function() {
    api.emit('save error')
    cursorChanger.endWait()
    closeDialog($content)
  }
  const createDownloadPath = function(contents) {
    const blob = new Blob([contents], {
      type: 'application/json'
    })
    return URL.createObjectURL(blob)
  }
  const RowDiv = _.partial(jQuerySugar.Div, 'textae-editor__save-dialog__row')
  const RowLabel = _.partial(
    jQuerySugar.Label,
    'textae-editor__save-dialog__label'
  )
  const $saveButton = new jQuerySugar.Button('Save', 'url')
  const $content = $('<div>')
    .append(
      new RowDiv().append(
        new RowLabel(label.URL),
        $(
          '<input type="text" class="textae-editor__save-dialog__server-file-name url" />'
        ),
        $saveButton
      )
    )
    .on('input', 'input.url', function() {
      jQuerySugar.enabled($saveButton, this.value)
    })
    .on('click', '[type="button"].url', () => {
      saveToServer(
        jQuerySugar.getValueFromText($content, 'url'),
        JSON.stringify($dialog.params.editedConfig),
        showSaveSuccess,
        showSaveError,
        cursorChanger,
        editor
      )
    })
    .append(
      new RowDiv().append(
        new RowLabel(label.LOCAL),
        $(
          '<input type="text" class="textae-editor__save-dialog__local-file-name local">'
        ),
        $('<a class="download" href="#">Download</a>')
      )
    )
    .on('click', 'a.download', function() {
      const downloadPath = createDownloadPath(
        JSON.stringify($dialog.params.editedConfig)
      )
      $(this)
        .attr('href', downloadPath)
        .attr('download', jQuerySugar.getValueFromText($content, 'local'))
      onSave()
      closeDialog($content)
    })
    .append(
      new RowDiv().append(
        $('<p class="textae-editor__save-dialog__diff-title">')
          .text('Configuration differences')
          .append($('<span class="diff-info diff-info--add">added</span>'))
          .append($('<span class="diff-info diff-info--remove">removed</span>'))
      )
    )
    .append($('<div class="textae-editor__save-dialog__diff-viewer">'))

  // Capture the local variable by inner funcitons.
  const $dialog = getDialog(
    'textae.dialog.save',
    'Save Configurations',
    $content[0],
    editor
  )

  // Set the filename when the dialog is opened.
  $dialog.on('dialogopen', () => {
    const diff = jsonDiff(
      $dialog.params.originalConfig,
      $dialog.params.editedConfig
    )
    $dialog.find('[type="text"].local').val('config.json')
    $dialog
      .find('.textae-editor__save-dialog__diff-viewer')
      .html(diff || 'nothing.')
  })

  return $dialog
}

function closeDialog($content) {
  $content.trigger('dialog.close')
}
