import dohtml from 'dohtml'

const config = {
  attributes: true,
  attributeFilter: ['class']
}

export default class Veil {
  #waitingEditors
  #el

  constructor() {
    // Since not all editors will be notified at once, keep the state in a instance variable.
    this.#waitingEditors = new Set()
  }

  setObserver(editorHTMLElement) {
    // Do not create HTML elements in the constructor
    // so that this class can be initialized before document.body is created.
    // Instead, we create it here.
    if (!this.#el) {
      this.#el = dohtml.create(
        `<div class="textae-editor-veil" style="display: none;"></div>`
      )
      document.body.appendChild(this.#el)
    }

    new MutationObserver((mutationRecords) =>
      this._mutationCallback(mutationRecords)
    ).observe(editorHTMLElement, config)
  }

  _mutationCallback(mutationRecords) {
    this._collectWaitingEditors(mutationRecords)

    if (this.#waitingEditors.size > 0) {
      this._show()
    } else {
      this._hide()
    }
  }

  _collectWaitingEditors(mutationRecords) {
    mutationRecords.forEach(({ target }) => {
      if (target.classList.contains('textae-editor--wait')) {
        this.#waitingEditors.add(target)
      } else {
        this.#waitingEditors.delete(target)
      }
    })
  }

  _show() {
    this.#el.style.display = 'block'
  }

  _hide() {
    this.#el.style.display = 'none'
  }
}
