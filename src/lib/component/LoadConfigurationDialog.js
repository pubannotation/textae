import delegate from 'delegate'

import isJSON from '../isJSON'
import Dialog from './Dialog'
import enableHTMLelment from './enableHTMLElement'
import initJSONEditor from './initJSONEditor'
import isUserConfirm from './isUserConfirm'
import LoadDialogLocalComponent from './LoadDialogLocalComponent'
import LoadDialogURLComponent from './LoadDialogURLComponent'

function template(context) {
  const { url, local } = context

  return `
<div class="textae-editor__load-dialog__container">
  ${url}
  ${local}
  <div class="textae-editor__load-dialog__row json">
    <label>
      JSON
    </label>
    <textarea class="textae-editor__load-dialog__textarea"></textarea>
    <input type="button" value="Edit" class="edit" disabled="disabled">
    <input type="button" value="Open" class="instant" disabled="disabled">
  </div>
</div>`
}

export default class LoadConfigurationDialog extends Dialog {
  #localComponent

  constructor(
    title,
    url,
    loadFromServer,
    readFromFile,
    readFromText,
    hasChange
  ) {
    const urlComponent = new LoadDialogURLComponent(url)
    const localComponent = new LoadDialogLocalComponent()

    super(
      title,
      template({
        url: urlComponent.template,
        local: localComponent.template
      })
    )

    this.#localComponent = localComponent

    urlComponent.bind(super.el, (url) => {
      if (isUserConfirm(hasChange)) {
        loadFromServer(url)
      }
      super.close()
    })

    this.#localComponent.bind(super.el, (droppedFile) => {
      if (isUserConfirm(hasChange)) {
        readFromFile(droppedFile)
      }

      super.close()
    })

    delegate(
      super.el,
      '.textae-editor__load-dialog__textarea',
      'input',
      (e) => {
        enableHTMLelment(
          super.el.querySelector('[type="button"].instant'),
          e.target.value
        )
        enableHTMLelment(
          super.el.querySelector('[type="button"].edit'),
          e.target.value
        )
      }
    )

    // Load from a textarea
    let jsonEditor = null
    delegate(super.el, '[type="button"].instant', 'click', () => {
      const text = jsonEditor
        ? jsonEditor.state.doc.toString()
        : super.el.querySelector('.textae-editor__load-dialog__textarea').value
      if (isUserConfirm(hasChange)) {
        readFromText(text)
      }

      super.close()
    })

    // Open JSON editor
    delegate(super.el, '[type="button"].edit', 'click', () => {
      this.#expandDialog()
      const textarea = super.el.querySelector(
        '.textae-editor__load-dialog__textarea'
      )
      if (isJSON(textarea.value)) {
        textarea.value = JSON.stringify(JSON.parse(textarea.value), null, 2)
      }

      const dialogHeight = super.el.closest(
        '.textae-editor__dialog'
      ).clientHeight
      jsonEditor = initJSONEditor(textarea, dialogHeight)

      // Disable edit button to avoid create multiple editors.
      super.el.querySelector('[type="button"].edit').disabled = true
    })
  }

  open() {
    super.open()
    this.#localComponent.intiializeDropzone(super.el)
  }

  #expandDialog() {
    super.el
      .closest('.textae-editor__dialog')
      .classList.add('textae-editor__load-dialog--expanded')
  }
}
