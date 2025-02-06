import delegate from 'delegate'
import Dialog from '../Dialog'
import enableHTMLelment from '../enableHTMLElement'
import isJSON from '../../isJSON'
import initJSONEditor from '../initJSONEditor'
import initInlineEditor from './initInlineEditor'
import isUserConfirm from '../isUserConfirm'
import LoadDialogURLComponent from '../LoadDialogURLComponent'
import LoadDialogLocalComponent from '../LoadDialogLocalComponent'

function template(context) {
  const { url, local } = context

  return `
<div class="textae-editor__load-dialog__container">
  ${url}
  ${local}
  <div class="textae-editor__load-dialog__row">
    <div class="textae-editor__load-dialog__format">
      <label class="textae-editor__load-dialog__format-button">
        <input type="radio" name="format" value="json" checked>JSON
      </label>
      <label class="textae-editor__load-dialog__format-button">
        <input type="radio" name="format" value="inline">Simple Inline Text Annotation Format
      </label>
    </div>
    <textarea class="textae-editor__load-dialog__textarea"></textarea>
    <input type="button" value="Edit" class="edit" disabled="disabled">
    <input type="button" value="Open" class="instant" disabled="disabled">
  </div>
</div>`
}

export default class LoadAnnotationDialog extends Dialog {
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
    let textEditor = null
    delegate(super.el, '[type="button"].instant', 'click', () => {
      const text = textEditor
        ? textEditor.state.doc.toString()
        : super.el.querySelector('.textae-editor__load-dialog__textarea').value
      const format = this.#getFormat()

      if (isUserConfirm(hasChange)) {
        readFromText(text, format)
      }

      super.close()
    })

    // Open JSON editor
    delegate(super.el, '[type="button"].edit', 'click', () => {
      this.#expandDialog()
      const textarea = super.el.querySelector(
        '.textae-editor__load-dialog__textarea'
      )
      const format = this.#getFormat()

      if (format === 'json' && isJSON(textarea.value)) {
        textarea.value = JSON.stringify(JSON.parse(textarea.value), null, 2)
      }

      const dialogHeight = super.el.closest(
        '.textae-editor__dialog'
      ).clientHeight

      textEditor =
        format === 'json'
          ? initJSONEditor(textarea, dialogHeight)
          : initInlineEditor(textarea, dialogHeight)

      // Disable buttons to prevent format change.
      const formatButtons = super.el.querySelectorAll(
        '.textae-editor__load-dialog__format-button input[type="radio"]'
      )
      for (const button of formatButtons) button.disabled = true
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

  #getFormat() {
    return super.el.querySelector('input[name="format"]:checked').value
  }
}
