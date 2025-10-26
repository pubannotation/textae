import delegate from 'delegate'
import anemone from '../../../../component/anemone'

export default class TextEditDialog {
  #dialog

  constructor(editorHTMLElement, submitHandler) {
    const dialog = document.createElement('dialog')
    dialog.classList.add('textae-editor__text-edit-dialog')
    editorHTMLElement.appendChild(dialog)
    dialog.addEventListener('close', (event) => {
      const dialog = event.target
      const { returnValue } = dialog
      if (returnValue === 'OK') {
        const form = dialog.querySelector('form')
        const begin = parseInt(form.begin.value, 10)
        const end = parseInt(form.end.value, 10)
        const originalText = form.originalText.value
        const editedText = form.editedText.value
        submitHandler(begin, end, originalText, editedText)
      }
    })

    delegate(
      dialog,
      '.textae-editor__text-edit-dialog__close-button',
      'click',
      (_e) => {
        dialog.close()
      }
    )
    // Disable shortcut key
    delegate(
      dialog,
      '.textae-editor__text-edit-dialog__text-box',
      'keyup',
      (e) => {
        e.stopPropagation()
      }
    )

    this.#dialog = dialog
  }

  open(begin, end, text) {
    this.#dialog.innerHTML = this.#template({ begin, end, text })
    this.#dialog.showModal()
  }

  #template(context) {
    const { text, begin, end } = context
    return anemone`
      <div class="textae-editor__text-edit-dialog__title-bar">
        <h1>Edit text dialog</h1>
        <button class="textae-editor__text-edit-dialog__close-button">X</button>
      </div>
      <h3>Original Text</h3>
      <div>${text}</div>
      <h3>Edit text</h3>
      <form method="dialog">
        <input type="hidden" name="begin" value="${begin}">
        <input type="hidden" name="end" value="${end}">
        <input type="hidden" name="originalText" value="${text}">
        <textarea class="textae-editor__text-edit-dialog__text-box" name="editedText" autofocus>${text}</textarea>
        <br>
        <div class="textae-editor__text-edit-dialog__button-bar">
          <button value="OK">OK</button>
        </div>
      </form>
    `
  }
}
