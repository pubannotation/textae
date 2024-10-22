import debounce300 from './SettingDialog/reflectImmediately/debounce300'

export default class Autocomplete {
  #inputElement
  #onSearch
  #onSelect
  #onPreview
  #resultsElement
  #results
  #currentFocus
  #originalInput

  constructor(inputElement, onSearch, onSelect, onPreview) {
    this.#inputElement = inputElement
    this.#onSearch = debounce300(onSearch)
    this.#onSelect = onSelect
    this.#onPreview = onPreview

    this.#resultsElement = document.createElement('ul')
    this.#resultsElement.setAttribute('popover', 'auto')
    this.#resultsElement.classList.add('autocomplete')
    inputElement.parentElement.appendChild(this.#resultsElement)

    this.#currentFocus = -1 // Initialize keydown pointer.
    this.#results = []

    this.#inputElement.addEventListener('input', (event) =>
      this.#handleInput(event)
    )
    this.#inputElement.addEventListener('keydown', (event) =>
      this.#handleKeyDown(event)
    )
  }

  #handleInput(event) {
    const term = event.target.value

    if (term.length >= 3) {
      this.#onSearch(term, (results) => this.#onResults(results))
    } else {
      this.#resultsElement.hidePopover()
    }
  }

  #onResults(results) {
    this.#resultsElement.innerHTML = ''
    this.#currentFocus = -1 // Reset currentFocus by every search.
    this.#originalInput = this.#inputElement.value
    this.#results = results

    if (results.length === 0) return

    for (const result of results) {
      const resultElement = document.createElement('li')
      resultElement.textContent = `${result.label} ${result.id}`

      this.#resultsElement.appendChild(resultElement)
    }

    this.#setEventHandlerToResults()
    this.#showPopoverUnderInputElement()
  }

  #setEventHandlerToResults() {
    this.#delegate(this.#resultsElement, 'click', 'li', (e) => {
      const index = Array.from(this.#resultsElement.children).indexOf(e.target)
      this.#onSelect(this.#results[index].id, this.#results[index].label)
      this.#resultsElement.hidePopover()
    })

    this.#delegate(this.#resultsElement, 'mouseover', 'li', (e) => {
      const index = Array.from(this.#resultsElement.children).indexOf(e.target)
      this.#currentFocus = index
      this.#addHighlight()
    })

    this.#delegate(this.#resultsElement, 'mouseout', 'li', () => {
      this.#currentFocus = -1
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
    if (this.#results.length === 0 || this.#inputElement.value.length < 3)
      return

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        this.#moveFocus('next')
        this.#previewCurrentLabel()
        break

      case 'ArrowUp':
        event.preventDefault()
        this.#moveFocus('previous')
        this.#previewCurrentLabel()
        break

      case 'Enter':
        event.preventDefault()
        if (this.#currentFocus >= 0) {
          const currentItem =
            this.#resultsElement.querySelectorAll('li')[this.#currentFocus]
          if (currentItem) {
            currentItem.click()
          }
        }
        break
    }
  }

  #moveFocus(direction) {
    const resultsCount = this.#results.length

    switch (direction) {
      case 'next':
        if (this.#currentFocus < resultsCount - 1) {
          this.#currentFocus++
        } else {
          this.#currentFocus = -1
        }
        break
      case 'previous':
        if (this.#currentFocus > 0) {
          this.#currentFocus--
        } else if (this.#currentFocus === 0) {
          this.#currentFocus = -1
        } else {
          this.#currentFocus = resultsCount - 1
        }
        break
    }

    this.#addHighlight()
  }

  #addHighlight() {
    // Clear previous highlight.
    this.#removeHighlight()

    // Do not highlight when no item selected.
    if (this.#currentFocus === -1) return

    const target =
      this.#resultsElement.querySelectorAll('li')[this.#currentFocus]
    target.classList.add('active')
  }

  #removeHighlight() {
    const target = this.#resultsElement.querySelector('li.active')

    if (target) {
      target.classList.remove('active')
    }
  }

  #previewCurrentLabel() {
    const isSelected = this.#currentFocus >= 0

    if (isSelected) {
      const currentResult = this.#results[this.#currentFocus]
      this.#onPreview(
        currentResult.id,
        currentResult.label,
        this.#originalInput
      )
    } else {
      // If no item is focused, show the original input.
      this.#onPreview(null, null, this.#originalInput)
    }
  }
}
