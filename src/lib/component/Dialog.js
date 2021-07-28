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
        ...{
          buttons: [
            {
              text: buttonLabel,
              click: () => this.close()
            }
          ]
        },
        ...option
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
        width: 'calc(100% - 10px)',
        create: (event) => {
          // The maxWidth option of the jQuery UI dialog is not working.
          // See: https://stackoverflow.com/a/20218692/1276969
          $(event.target.parentElement).css(
            'maxWidth',
            `${this._option.maxWidth || 550}px`
          )
        }
      },
      ...this._option
    })
  }

  close() {
    this._$dialog.dialog('close')
  }
}
