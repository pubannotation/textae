import dohtml from 'dohtml'

const config = {
  attributes: true,
  attributeFilter: ['class']
}

export default class Veil {
  constructor() {
    // Since not all editors will be notified at once, keep the state in a instance variable.
    this._waitingEditors = new Set()
  }

  setObserver(editorHTMLElement) {
    // Do not create HTML elements in the constructor
    // so that this class can be initialized before document.body is created.
    // Instead, we create it here.
    if (!this._el) {
      this._el = dohtml.create(
        `<div class="textae-editor-veil" style="display: none;"></div>`
      )
      document.body.appendChild(this._el)
    }

    new MutationObserver((mutationRecords) =>
      this._mutationCallback(mutationRecords)
    ).observe(editorHTMLElement, config)
  }

  _mutationCallback(mutationRecords) {
    this._collectWaitingEditors(mutationRecords)

    if (this._waitingEditors.size > 0) {
      this._show()
    } else {
      this._hide()
    }
  }

  _collectWaitingEditors(mutationRecords) {
    mutationRecords.forEach(({ target }) => {
      if (target.classList.contains('textae-editor--wait')) {
        this._waitingEditors.add(target)
      } else {
        this._waitingEditors.delete(target)
      }
    })
  }

  _show() {
    this._el.style.display = 'block'
  }

  _hide() {
    this._el.style.display = 'none'
  }
}
