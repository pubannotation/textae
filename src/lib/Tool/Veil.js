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

  setObserver(editor) {
    // Do not create HTML elements in the constructor
    // so that this class can be initialized before document.body is created.
    // Instead, we create it here.
    if (!this._el) {
      this._el = dohtml.create(
        `<div class="textae-editor-veil" style="display: none;"></div>`
      )
      document.body.appendChild(this._el)
    }

    new MutationObserver((mutationRecords) => {
      mutationRecords.forEach(({ target: element }) => {
        if (element.classList.contains('textae-editor--wait')) {
          this._waitingEditors.add(element)
        } else {
          this._waitingEditors.delete(element)
        }
      })

      if (this._waitingEditors.size > 0) {
        this._el.style.display = 'block'
      } else {
        this._el.style.display = 'none'
      }
    }).observe(editor[0], config)
  }
}
