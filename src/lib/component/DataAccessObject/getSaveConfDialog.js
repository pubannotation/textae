import CursorChanger from '../../util/CursorChanger'
import label from './label'
import jQuerySugar from '../jQuerySugar'
import getDialog from './getDialog'
import jsonDiff from '../../util/jsonDiff'
import $ from 'jquery'
import _ from 'underscore'
import createDownloadPath from './createDownloadPath'
import closeDialog from './closeDialog'

module.exports = function(
  api,
  editor,
  saveToServer,
  onSave,
  edited,
  filename,
  title,
  setOptionFields
) {
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
        JSON.stringify(edited),
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
          `<input type="text" value="${filename}" class="textae-editor__save-dialog__local-file-name local">`
        ),
        $('<a class="download" href="#">Download</a>')
      )
    )
    .on('click', 'a.download', function() {
      const downloadPath = createDownloadPath(JSON.stringify(edited))
      $(this)
        .attr('href', downloadPath)
        .attr('download', jQuerySugar.getValueFromText($content, 'local'))
      onSave()
      closeDialog($content)
    })

  // Capture the local variable by inner funcitons.
  const $dialog = getDialog('textae.dialog.save', title, $content[0], editor)

  setOptionFields($dialog)

  return $dialog
}
