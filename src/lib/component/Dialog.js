import dohtml from 'dohtml'
import $ from 'jquery'
import 'jquery-ui/ui/widgets/dialog'

export default class Dialog {
  constructor(title, contentHtml, buttonLabel, option) {
    this._el = dohtml.create(`
    <div title="${title}">
      ${contentHtml}
    </div>
    `)
    this._$dialog = $(this._el)
    this._$dialog.on('dialogclose', () => {
      // Delay destroy to check a click target is child of the dialog.
      requestAnimationFrame(() => this._$dialog.dialog('destroy'))
    })

    if (buttonLabel) {
      option = {
        ...option,
        ...{
          buttons: [
            {
              text: buttonLabel,
              click: () => this.close()
            }
          ]
        }
      }
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
    this._$dialog.dialog({
      ...{
        dialogClass: 'textae-editor__dialog',
        height: 'auto',
        modal: true,
        resizable: false,
        width: 550
      },
      ...this._option
    })
  }

  close() {
    this._$dialog.dialog('close')
  }
}
