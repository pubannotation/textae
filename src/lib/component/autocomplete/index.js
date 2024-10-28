import AutocompleteModel from './autocompleteModel'
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

      if (term.length < 3) {
        this.#resultsElement.hidePopover()
      }
    })

    this.#inputElement.addEventListener('input', (event) =>
      handleInput(event.target.value)
    )
    this.#inputElement.addEventListener('keydown', (event) =>
      this.#handleKeydown(event)
    )

    // Hide popover when input is out of focus.
    this.#inputElement.addEventListener('blur', () =>
      this.#resultsElement.hidePopover()
    )

    this.#setEventHandlerToResults()
  }

  #setEventHandlerToResults() {
    delegate(this.#resultsElement, 'li', 'mousedown', (e) => {
      this.#onSelect(
        e.delegateTarget.dataset.id,
        e.delegateTarget.dataset.label
      )
      this.#resultsElement.hidePopover()
    })

    delegate(this.#resultsElement, 'li', 'mouseover', (e) => {
      this.#model.highlightedIndex = e.delegateTarget.dataset.index
    })

    delegate(this.#resultsElement, 'li', 'mouseout', () => {
      this.#model.highlightedIndex = -1
    })
  }

  #renderItem(items) {
    this.#resultsElement.innerHTML = ''
    this.#model.highlightedIndex = -1 // Clear highlight.

    if (items.length === 0) return

    const elements = items.map((item, i) => {
      const resultElement = document.createElement('li')
      Object.assign(resultElement.dataset, {
        id: item.id,
        label: item.label,
        index: i
      })

      resultElement.classList.add('textae-editor__dialog__autocomplete__item')
      resultElement.textContent = `${item.label} ${item.id}`
      return resultElement
    })

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
    if (this.#model.items.length === 0) return

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        this.#moveHighlightNext()
        break

      case 'ArrowUp':
        event.preventDefault()
        this.#moveHighlightPrevious()
        break

      case 'Enter': {
        event.preventDefault()
        const currentItem = document.querySelector(
          '.textae-editor__dialog__autocomplete__item--highlighted'
        )

        if (currentItem) {
          this.#onSelect(currentItem.dataset.id, currentItem.dataset.label)
          this.#resultsElement.hidePopover()
        }
        break
      }
    }
  }

  #moveHighlightPrevious() {
    if (this.#model.highlightedIndex > 0) {
      this.#model.highlightedIndex--
    } else if (this.#model.highlightedIndex === 0) {
      this.#model.highlightedIndex = -1
    } else {
      this.#model.highlightedIndex = this.#model.items.length - 1
    }
  }

  #moveHighlightNext() {
    if (this.#model.highlightedIndex < this.#model.items.length - 1) {
      this.#model.highlightedIndex++
    } else {
      this.#model.highlightedIndex = -1
    }
  }

  #highlight(index) {
    this.#unhighlight() // Clear previous highlight.

    const currentItem = this.#resultsElement.querySelectorAll('li')[index]

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
