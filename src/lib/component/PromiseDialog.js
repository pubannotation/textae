import delegate from 'delegate'
import Dialog from './Dialog'

export default class PromiseDialog extends Dialog {
  constructor(title, contentHtml, option, getResultsFunc) {
    super(title, contentHtml, 'OK', option)

    this._promise = new Promise((resolve) => {
      const onClick = () => {
        const results = getResultsFunc()
        if (results) {
          resolve(results)
        }
        super.close()
      }

      // Overwrite the button handler.
      this._option.buttons[0].click = onClick

      delegate(
        super.el,
        '.textae-editor__promise-daialog__observable-element',
        'keyup',
        (e) => {
          if (e.keyCode === 13) {
            onClick()
          }
        }
      )
    })
  }

  open() {
    super.open()
    return this._promise
  }
}
