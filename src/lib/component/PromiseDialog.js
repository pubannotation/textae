import delegate from 'delegate'
import Dialog from './Dialog'

export default class PromiseDialog extends Dialog {
  constructor(title, contentHtml, option, observableClass, getResultsFunc) {
    super(title, contentHtml, { label: 'OK' }, option)

    this.promise = new Promise((resolve) => {
      const onClick = () => {
        const results = getResultsFunc()
        if (results) {
          resolve(results)
        }
        super.close()
      }

      // Overwrite the button handler.
      this._option.buttons[0].click = onClick

      delegate(super.el, observableClass, 'keyup', (e) => {
        if (e.keyCode === 13) {
          onClick()
        }
      })
    })
  }
}
