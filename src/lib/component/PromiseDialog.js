import delegate from 'delegate'
import Dialog from './Dialog'

export default class PromiseDialog extends Dialog {
  constructor(title, contentHtml, option, getResultsFunc) {
    const onOKButtonClick = () => {
      const results = getResultsFunc()
      if (results) {
        this.resolveFunc(results)
      }
      super.close()
    }
    const okButton = {
      text: 'OK',
      click: onOKButtonClick
    }
    option.buttons = option.buttons
      ? option.buttons.concat([okButton])
      : [okButton]

    super(title, contentHtml, option)

    this._promise = new Promise((resolveFunc) => {
      this.resolveFunc = resolveFunc
    })

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
  }

  open() {
    super.open()
    return this._promise
  }
}
