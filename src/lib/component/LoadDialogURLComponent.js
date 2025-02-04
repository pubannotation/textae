import delegate from 'delegate'
import anemone from './anemone'
import enableHTMLelment from './enableHTMLElement'

export default class LoadDialogURLComponent {
  #url

  constructor(url) {
    this.#url = url
  }

  get template() {
    return anemone`
<div class="textae-editor__load-dialog__row">
  <label>
    URL
  </label>
  <input
    type="text"
    value="${this.#url}"
    class="textae-editor__load-dialog__url-text">
  <input
    type="button"
    class="textae-editor__load-dialog__url-button"
    ${this.#url ? `` : `disabled="disabled"`}
    value="Open">
</div>
`
  }

  bind(element, onOpen) {
    // Disabled the button to load from the URL when no URL.
    delegate(element, '.textae-editor__load-dialog__url-text', 'input', (e) => {
      enableHTMLelment(e.target.nextElementSibling, e.target.value)
    })

    // Load from the URL.
    delegate(element, '.textae-editor__load-dialog__url-button', 'click', (e) =>
      onOpen(e.target.previousElementSibling.value)
    )
  }
}
