import debounce300 from './debounce300'

export default class Autocomplete {
  #inputElement
  #onSearch
  #onSelect
  #onPreview
  #resultsElement
  #results
  #highlightedIndex
  #originalInput

  constructor(inputElement, onSearch, onSelect, onPreview) {
    this.#inputElement = inputElement
    this.#onSearch = debounce300(onSearch)
    this.#onSelect = onSelect
    this.#onPreview = onPreview

    this.#resultsElement = document.createElement('ul')
    this.#resultsElement.setAttribute('popover', 'auto')
    this.#resultsElement.classList.add('textae-editor__dialog__autocomplete')
    inputElement.parentElement.appendChild(this.#resultsElement)

    this.#highlightedIndex = -1 // Initialize keydown pointer.
    this.#results = []

    this.#inputElement.addEventListener('input', (event) =>
      this.#handleInput(event)
    )
    this.#inputElement.addEventListener('keydown', (event) =>
      this.#handleKeyDown(event)
    )

    // Hide popover when input is out of focus.
    this.#inputElement.addEventListener('blur', () =>
      this.#resultsElement.hidePopover()
    )
  }

  set results(results) {
    this.#results = results
    this.#resultsElement.innerHTML = ''

    if (results.length === 0) return

    const elements = []

    for (const [i, result] of results.entries()) {
      const resultElement = document.createElement('li')
      Object.assign(resultElement.dataset, {
        id: result.id,
        label: result.label,
        index: i
      })

      resultElement.classList.add('textae-editor__dialog__autocomplete__item')
      resultElement.textContent = `${result.label} ${result.id}`
      elements.push(resultElement)
    }

    this.#resultsElement.append(...elements)
  }

  #handleInput(event) {
    const term = event.target.value

    if (term.length >= 3) {
      this.#onSearch(term, (results) => this.#onResults(results))
    } else {
      this.#results = [] // Clear results.
      this.#resultsElement.hidePopover()
    }
  }

  #onResults(results) {
    this.#highlightedIndex = -1 // Reset index by every search.
    this.#originalInput = this.#inputElement.value

    this.results = results

    this.#setEventHandlerToResults()
    this.#showPopoverUnderInputElement()
  }

  #setEventHandlerToResults() {
    this.#delegate(this.#resultsElement, 'mousedown', 'li', (e) => {
      this.#onSelect(e.target.dataset.id, e.target.dataset.label)
      this.#resultsElement.hidePopover()
    })

    this.#delegate(this.#resultsElement, 'mouseover', 'li', (e) => {
      this.#highlightedIndex = e.target.dataset.index
      this.#addHighlight()
    })

    this.#delegate(this.#resultsElement, 'mouseout', 'li', () => {
      this.#highlightedIndex = -1
      this.#removeHighlight()
    })
  }

  #delegate(element, event, selector, callback) {
    element.addEventListener(event, (e) => {
      if (e.target.closest(selector)) {
        callback(e)
      }
    })
  }

  #showPopoverUnderInputElement() {
    const rect = this.#inputElement.getBoundingClientRect()

    this.#resultsElement.style.position = 'absolute'
    this.#resultsElement.style.top = `${rect.bottom + window.scrollY}px`
    this.#resultsElement.style.left = `${rect.left + window.scrollX}px`

    this.#resultsElement.showPopover()
  }

  #handleKeyDown(event) {
    if (this.#results.length === 0) return

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        this.#moveNext()
        this.#previewCurrentResult()
        break

      case 'ArrowUp':
        event.preventDefault()
        this.#movePrevious()
        this.#previewCurrentResult()
        break

      case 'Enter': {
        event.preventDefault()
        const currentItem = document.querySelector(
          '.textae-editor__dialog__autocomplete__item--active'
        )

        if (currentItem) {
          this.#onSelect(currentItem.dataset.id, currentItem.dataset.label)
          this.#resultsElement.hidePopover()
        }
        break
      }
    }
  }

  #movePrevious() {
    if (this.#highlightedIndex > 0) {
      this.#highlightedIndex--
    } else if (this.#highlightedIndex === 0) {
      this.#highlightedIndex = -1
    } else {
      this.#highlightedIndex = this.#results.length - 1
    }

    this.#addHighlight()
  }

  #moveNext() {
    if (this.#highlightedIndex < this.#results.length - 1) {
      this.#highlightedIndex++
    } else {
      this.#highlightedIndex = -1
    }

    this.#addHighlight()
  }

  #addHighlight() {
    // Clear previous highlight.
    this.#removeHighlight()

    // Do not highlight when no item selected.
    if (this.#highlightedIndex === -1) return

    const target =
      this.#resultsElement.querySelectorAll('li')[this.#highlightedIndex]
    target.classList.add('textae-editor__dialog__autocomplete__item--active')
  }

  #removeHighlight() {
    const target = this.#resultsElement.querySelector(
      '.textae-editor__dialog__autocomplete__item--active'
    )

    if (target) {
      target.classList.remove(
        'textae-editor__dialog__autocomplete__item--active'
      )
    }
  }

  #previewCurrentResult() {
    const currentResult = document.querySelector(
      '.textae-editor__dialog__autocomplete__item--active'
    )

    if (currentResult) {
      this.#onPreview(
        currentResult.dataset.id,
        currentResult.dataset.label,
        this.#originalInput
      )
    } else {
      // If no item is focused, show the original input.
      this.#onPreview(null, null, this.#originalInput)
    }
  }
}
