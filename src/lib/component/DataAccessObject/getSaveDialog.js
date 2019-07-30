import Handlebars from 'handlebars'
import jQuerySugar from '../jQuerySugar'
import getDialog from './getDialog'
import $ from 'jquery'
import closeDialog from './closeDialog'
import createDownloadPath from './createDownloadPath'

const source = `<div>
  <div class="textae-editor__save-dialog__row">
    <label class="textae-editor__save-dialog__label">URL</label>
    <input type="text" value="{{url}}" class="textae-editor__save-dialog__server-file-name url">
    <input type="button" class="url" {{#unless url}}disabled="disabled"{{/unless}} value="Save">
  </div>
  <div class="textae-editor__save-dialog__row">
    <label class="textae-editor__save-dialog__label">Local</label>
    <input type="text" value="{{filename}}" class="textae-editor__save-dialog__local-file-name local">
    <a class="download" href="#">Download</a>
  </div>
</div>`
const template = Handlebars.compile(source)

export default function(
  api,
  cursorChanger,
  saveToServer,
  onSave,
  edited,
  filename,
  title,
  setOptionFields,
  url
) {
  const $dialog = getDialog(
    'textae.dialog.save',
    title,
    template({ filename, url })
  )

  $dialog
    .on('input', '[type="text"].url', (e) => {
      const $button = $(e.target.nextElementSibling)
      jQuerySugar.enabled($button, e.target.value)
    })
    .on('click', '[type="button"].url', (e) => {
      saveToServer(
        e.target.previousElementSibling.value,
        JSON.stringify(edited),
        () => {
          onSave()
          cursorChanger.endWait()
          closeDialog($dialog)
        },
        () => {
          api.emit('save error')
          cursorChanger.endWait()
          closeDialog($dialog)
        }
      )
    })
    .on('click', 'a.download', (e) => {
      const downloadPath = createDownloadPath(JSON.stringify(edited))

      $(e.target)
        .attr('href', downloadPath)
        .attr('download', e.target.previousElementSibling.value)

      onSave()
      closeDialog($dialog)
    })

  setOptionFields($dialog)

  return $dialog
}
