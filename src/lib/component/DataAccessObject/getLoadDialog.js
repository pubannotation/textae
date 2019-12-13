import Handlebars from 'handlebars'
import delegate from 'delegate'
import getDialog from './getDialog'
import $ from 'jquery'
import toDomEelement from '../../toDomEelement'
import CONFIRM_DISCARD_CHANGE_MESSAGE from '../../editor/CONFIRM_DISCARD_CHANGE_MESSAGE'
import makeDomEnabled from '../makeDomEnabled'

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

export default function(title, url, loadFromServer, loadFromFile, hasChange) {
  const el = toDomEelement(template({ url }))

  // Disabled the button to load from the URL when no URL.
  delegate(el, '[type="text"].url', 'input', (e) => {
    const $button = $(e.target.nextElementSibling)
    makeDomEnabled($button[0], e.target.value)
  })

  // Disabled the button to load from a file when no file.
  delegate(el, '.textae-editor__load-dialog__file', 'change', (e) => {
    const $button = $(e.target.nextElementSibling)
    makeDomEnabled($button[0], e.target.files.length > 0)
  })

  const $dialog = getDialog('textae.dialog.load', title, el)
  const isUserConfirm = () =>
    !hasChange || window.confirm(CONFIRM_DISCARD_CHANGE_MESSAGE)

  // Load from the URL.
  delegate(el, '[type="button"].url', 'click', (e) => {
    if (isUserConfirm()) {
      loadFromServer(e.target.previousElementSibling.value)
    }
    $dialog.close()
  })

  // Load from a file.
  delegate(el, '[type="button"].local', 'click', (e) => {
    const file = e.target.previousElementSibling

    if (isUserConfirm()) {
      loadFromFile(file)
    }

    $dialog.close()
  })

  return $dialog
}
