import delegate from 'delegate'
import Dialog from './Dialog'

export default class PromiseDialog extends Dialog {
  constructor(
    title,
    contentHtml,
    option,
    getResultsFunc,
    deleteButtonSelector
  ) {
    super(title, contentHtml, 'OK', option)

    this._promise = new Promise((resolve) => {
      const onOKButtonClick = () => {
        const results = getResultsFunc()
        if (results) {
          resolve(results)
        }
        super.close()
      }

      // Overwrite the button handler.
      this._option.buttons[0].click = onOKButtonClick

      delegate(
        super.el,
        '.textae-editor__promise-daialog__observable-element',
        'keyup',
        (e) => {
          if (e.keyCode === 13) {
            onOKButtonClick()
          }
        }
      )

      if (deleteButtonSelector) {
        delegate(super.el, deleteButtonSelector, 'click', () => {
          super.close()
          resolve({ newObj: null })
        })
      }
    })
  }

  open() {
    super.open()
    return this._promise
  }
}
