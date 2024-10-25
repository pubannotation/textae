import AutocompleteModel from './autocompleteModel'
import debounce300 from '../debounce300'

export default class Autocomplete {
  #inputElement
  #onSelect
  #onPreview
  #model
  #resultsElement

  constructor(inputElement, onSearch, onSelect, onPreview) {
    this.#inputElement = inputElement
    this.#onSelect = onSelect
    this.#onPreview = onPreview

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
    this.#delegate(this.#resultsElement, 'mousedown', 'li', (e) => {
      this.#onSelect(e.target.dataset.id, e.target.dataset.label)
      this.#resultsElement.hidePopover()
    })

    this.#delegate(this.#resultsElement, 'mouseover', 'li', (e) => {
      this.#model.highlightedIndex = e.target.dataset.index
    })

    this.#delegate(this.#resultsElement, 'mouseout', 'li', () => {
      this.#model.highlightedIndex = -1
    })
  }

  #delegate(element, event, selector, callback) {
    element.addEventListener(event, (e) => {
      if (e.target.closest(selector)) {
        callback(e)
      }
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
        this.#previewCurrentHighlightItem()
        break

      case 'ArrowUp':
        event.preventDefault()
        this.#moveHighlightPrevious()
        this.#previewCurrentHighlightItem()
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

  #previewCurrentHighlightItem() {
    const currentItem = document.querySelector(
      '.textae-editor__dialog__autocomplete__item--highlighted'
    )

    if (currentItem) {
      this.#onPreview(
        currentItem.dataset.id,
        currentItem.dataset.label,
        this.#model.term
      )
    } else {
      // If no item is focused, show the original input.
      this.#onPreview(null, null, this.#model.term)
    }
  }
}
