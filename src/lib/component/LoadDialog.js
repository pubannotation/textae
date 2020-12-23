import delegate from 'delegate'
import Dialog from './Dialog'
import enableHTMLelment from './enableHTMLelement'

function template(context) {
  const { url } = context

  return `<div>
<div class="textae-editor__load-dialog__row">
  <label class="textae-editor__load-dialog__label">URL</label>
  <input type="text" value="${url}" class="textae-editor__load-dialog__file-name url">
  <input type="button" class="url" ${
    url ? `` : `disabled="disabled"`
  } value="Open">
</div>
<div class="textae-editor__load-dialog__row">
  <label class="textae-editor__load-dialog__label">Local</label>
  <input class="textae-editor__load-dialog__file" type="file">
  <input type="button" class="local" disabled="disabled" value="Open">
</div>
</div>`
}

const CONFIRM_DISCARD_CHANGE_MESSAGE =
  'There is a change that has not been saved. If you procceed now, you will lose it.'

export default class LoadDialog extends Dialog {
  constructor(title, url, loadFromServer, readFromFile, hasChange) {
    super(title, template({ url }), 'Cancel')

    // Disabled the button to load from the URL when no URL.
    delegate(super.el, '[type="text"].url', 'input', (e) => {
      enableHTMLelment(e.target.nextElementSibling, e.target.value)
    })

    // Disabled the button to load from a file when no file.
    delegate(super.el, '.textae-editor__load-dialog__file', 'change', (e) => {
      enableHTMLelment(e.target.nextElementSibling, e.target.files.length > 0)
    })

    const isUserConfirm = () =>
      !hasChange || window.confirm(CONFIRM_DISCARD_CHANGE_MESSAGE)

    // Load from the URL.
    delegate(super.el, '[type="button"].url', 'click', (e) => {
      if (isUserConfirm()) {
        loadFromServer(e.target.previousElementSibling.value)
      }
      super.close()
    })

    // Load from a file.
    delegate(super.el, '[type="button"].local', 'click', (e) => {
      const file = e.target.previousElementSibling

      if (isUserConfirm()) {
        readFromFile(file)
      }

      super.close()
    })
  }
}
