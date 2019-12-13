import Handlebars from 'handlebars'
import delegate from 'delegate'
import dohtml from 'dohtml'
import $ from 'jquery'
import getDialog from './getDialog'
import createDownloadPath from './createDownloadPath'
import makeDomEnabled from '../makeDomEnabled'

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
  title,
  filename,
  url,
  data,
  saveToServer,
  setOptionFields,
  onSave
) {
  const el = dohtml.create(template({ filename, url }))

  // Disabled the button to save to the URL when no URL.
  delegate(el, '[type="text"].url', 'input', (e) => {
    const $button = $(e.target.nextElementSibling)
    makeDomEnabled($button[0], e.target.value)
  })

  const $dialog = getDialog('textae.dialog.save', title, el)

  // Save to the URL.
  delegate(el, '[type="button"].url', 'click', (e) => {
    saveToServer(e.target.previousElementSibling.value, JSON.stringify(data))
    $dialog.close()
  })

  // Download as a JSON file.
  delegate(el, 'a.download', 'click', (e) => {
    const aTag = e.target
    const downloadPath = createDownloadPath(JSON.stringify(data))

    aTag.setAttribute('href', downloadPath)
    aTag.setAttribute('download', aTag.previousElementSibling.value)

    onSave()
    $dialog.close()
  })

  setOptionFields(el, () => $dialog.close())

  return $dialog
}
