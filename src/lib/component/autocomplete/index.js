import AutocompleteModel from './autocompleteModel'
import createResultElement from './createResultElement'
import debounce300 from '../debounce300'
import delegate from 'delegate'

export default class Autocomplete {
  #inputElement
  #onSelect
  #model
  #resultsElement

  constructor(inputElement, onSearch, onSelect) {
    this.#inputElement = inputElement
    this.#onSelect = onSelect

    this.#model = new AutocompleteModel(
      (term) => onSearch(term, (results) => (this.#model.items = results)),
      (items) => this.#renderItem(items),
      (index) => this.#highlight(index)
    )

    this.#resultsElement = document.createElement('ul')
    this.#resultsElement.setAttribute('popover', 'auto')
    this.#resultsElement.classList.add('textae-editor__dialog__autocomplete')
    inputElement.parentElement.appendChild(this.#resultsElement)

    const handleInput = debounce300((term) => {
      this.#model.term = term
    })

    this.#inputElement.addEventListener('input', ({ target }) =>
      handleInput(target.value)
    )
    this.#inputElement.addEventListener('keydown', (event) =>
      this.#handleKeydown(event)
    )
    this.#inputElement.addEventListener('keyup', (event) =>
      this.#handleEnterKey(event)
    )

    // Hide popover when input is out of focus.
    this.#inputElement.addEventListener('blur', () =>
      this.#resultsElement.hidePopover()
    )

    this.#setEventHandlersToResults()
  }

  #setEventHandlersToResults() {
    delegate(this.#resultsElement, 'li', 'mousedown', ({ delegateTarget }) => {
      this.#onSelect(delegateTarget.dataset.id, delegateTarget.dataset.label)
      this.#resultsElement.hidePopover()
    })

    delegate(this.#resultsElement, 'li', 'mouseover', ({ delegateTarget }) => {
      this.#model.highlightedIndex = Number(delegateTarget.dataset.index)
    })

    delegate(this.#resultsElement, 'li', 'mouseout', () => {
      this.#model.highlightedIndex = -1
    })
  }

  #renderItem(items) {
    this.#resultsElement.innerHTML = ''

    if (items.length === 0) {
      this.#resultsElement.hidePopover()
      return
    }

    const elements = items.map(createResultElement)
    this.#resultsElement.append(...elements)
    this.#showPopoverUnderInputElement()
  }

  #showPopoverUnderInputElement() {
    const rect = this.#inputElement.getBoundingClientRect()

    Object.assign(this.#resultsElement.style, {
      position: 'absolute',
      top: `${rect.bottom + window.scrollY}px`,
      left: `${rect.left + window.scrollX}px`
    })

    this.#resultsElement.showPopover()
  }

  #handleKeydown(event) {
    if (this.#model.itemsCount === 0) return

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        this.#model.moveHighlightIndexNext()
        break

      case 'ArrowUp':
        event.preventDefault()
        this.#model.moveHighlightIndexPrevious()
        break
    }
  }

  #handleEnterKey(event) {
    if (event.key === 'Enter' && this.#model.itemsCount > 0) {
      event.stopPropagation()

      const currentItem = document.querySelector(
        '.textae-editor__dialog__autocomplete__item--highlighted'
      )

      if (currentItem) {
        this.#onSelect(currentItem.dataset.id, currentItem.dataset.label)
      }

      this.#model.items = []
    }
  }

  #highlight(index) {
    this.#unhighlight() // Clear previous highlight.

    const currentItem = this.#resultsElement.querySelector(
      `li:nth-child(${index + 1})`
    )

    if (currentItem) {
      currentItem.classList.add(
        'textae-editor__dialog__autocomplete__item--highlighted'
      )
    }
  }

  #unhighlight() {
    const target = this.#resultsElement.querySelector(
      '.textae-editor__dialog__autocomplete__item--highlighted'
    )

    if (target) {
      target.classList.remove(
        'textae-editor__dialog__autocomplete__item--highlighted'
      )
    }
  }
}
