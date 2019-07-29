import CursorChanger from '../../util/CursorChanger'
import label from './label'
import jQuerySugar from '../jQuerySugar'
import getDialog from './getDialog'
import $ from 'jquery'
import _ from 'underscore'

module.exports = function(
  api,
  editor,
  saveToServer,
  onSave,
  edited,
  filename,
  title
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
    .append(
      new RowDiv().append(
        new RowLabel(),
        $(
          '<a class="viewsource" href="#">Click to see the json source in a new window.</a>'
        )
      )
    )
    .on('click', 'a.viewsource', (e) => {
      const downloadPath = createDownloadPath(JSON.stringify(edited))
      window.open(downloadPath, '_blank')
      onSave
      closeDialog($content)
      return false
    })

  // Capture the local variable by inner funcitons.
  const $dialog = getDialog('textae.dialog.save', title, $content[0], editor)

  return $dialog
}

function closeDialog($content) {
  $content.trigger('dialog.close')
}
