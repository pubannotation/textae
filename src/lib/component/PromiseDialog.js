import delegate from 'delegate'
import Dialog from './Dialog'

export default class PromiseDialog extends Dialog {
  constructor(title, contentHtml, option, getResultsFunc) {
    super(title, contentHtml, 'OK', option)

    this._promise = new Promise((resolveFunc) => {
      const onOKButtonClick = () => {
        const results = getResultsFunc()
        if (results) {
          resolveFunc(results)
        }
        super.close()
      }

      // Overwrite the button handler.
      this._option.buttons[this._option.buttons.length - 1].click =
        onOKButtonClick

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

      this.resolveFunc = resolveFunc
    })
  }

  open() {
    super.open()
    return this._promise
  }
}
