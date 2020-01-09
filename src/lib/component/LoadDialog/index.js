import delegate from 'delegate'
import Dialog from '../Dialog'
import createContentHtml from './createContentHtml'
import CONFIRM_DISCARD_CHANGE_MESSAGE from '../../editor/CONFIRM_DISCARD_CHANGE_MESSAGE'
import makeDomEnabled from '../makeDomEnabled'

export default class extends Dialog {
  constructor(title, url, loadFromServer, loadFromFile, hasChange) {
    super(title, createContentHtml({ url }), {
      label: 'Cancel'
    })

    // Disabled the button to load from the URL when no URL.
    delegate(super.el, '[type="text"].url', 'input', (e) => {
      makeDomEnabled(e.target.nextElementSibling, e.target.value)
    })

    // Disabled the button to load from a file when no file.
    delegate(super.el, '.textae-editor__load-dialog__file', 'change', (e) => {
      makeDomEnabled(e.target.nextElementSibling, e.target.files.length > 0)
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
        loadFromFile(file)
      }

      super.close()
    })
  }
}
