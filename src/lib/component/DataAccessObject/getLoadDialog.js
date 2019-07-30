import Handlebars from 'handlebars'
import jQuerySugar from '../jQuerySugar'
import getDialog from './getDialog'
import $ from 'jquery'
import closeDialog from './closeDialog'

const source = `<div>
  <div class="textae-editor__load-dialog__row">
    <label class="textae-editor__load-dialog__label">URL</label>
    <input type="text" value="{{url}}" class="textae-editor__load-dialog__file-name url">
    <input type="button" class="url" {{#unless url}}disabled="disabled"{{/unless}} value="Open">
  </div>
  <div class="textae-editor__load-dialog__row">
    <label class="textae-editor__load-dialog__label">Local</label>
    <input class="textae-editor__load-dialog__file" type="file">
    <input type="button" class="local" disabled="disabled" value="Open">
  </div>
</div>`
const template = Handlebars.compile(source)

export default function(
  api,
  setDataSourceUrl,
  cursorChanger,
  isUserConfirm,
  getFromServer,
  getJsonFromFile,
  title,
  url
) {
  const $dialog = getDialog('textae.dialog.load', title, template({ url }))

  $dialog
    .on('input', '[type="text"].url', (e) => {
      const $button = $(e.target.nextElementSibling)
      jQuerySugar.enabled($button, e.target.value)
    })
    .on('click', '[type="button"].url', (e) => {
      if (isUserConfirm()) {
        getFromServer(
          e.target.previousElementSibling.value,
          cursorChanger,
          api,
          setDataSourceUrl
        )
      }
      closeDialog($dialog)
    })
    .on('change', '.textae-editor__load-dialog__file', (e) => {
      const $button = $(e.target.nextElementSibling)
      jQuerySugar.enabled($button, e.target.files.length > 0)
    })
    .on('click', '[type="button"].local', (e) => {
      const file = e.target.previousElementSibling

      if (isUserConfirm()) {
        getJsonFromFile(api, file)
      }

      closeDialog($dialog)
    })

  return $dialog
}
