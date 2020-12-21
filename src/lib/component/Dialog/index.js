import $ from 'jquery'
import 'jquery-ui/ui/widgets/dialog'
import createElement from './createElement'

export default class Dialog {
  constructor(title, contentHtml, button, option) {
    this._el = new createElement(title, contentHtml)
    this._$dialog = $(this._el)
    this._$dialog.on('dialogclose', () => {
      // Delay destroy to check a click target is child of the dialog.
      requestAnimationFrame(() => this._$dialog.dialog('destroy'))
    })

    if (button) {
      option = option || {}
      Object.assign(option, {
        buttons: [
          {
            text: button,
            click: () => this.close()
          }
        ]
      })
    }

    this._option = option
  }

  get el() {
    return this._el
  }

  get button() {
    return this._$dialog
      .dialog('widget')[0]
      .querySelector('.ui-dialog-buttonpane button')
  }

  open() {
    this._$dialog.dialog(
      Object.assign(
        {
          dialogClass: 'textae-editor--dialog',
          height: 'auto',
          modal: true,
          resizable: false,
          width: 550
        },
        this._option
      )
    )
  }

  close() {
    this._$dialog.dialog('close')
  }
}
