import debounce300 from './SettingDialog/reflectImmediately/debounce300'

export default class Autocomplete {
  #inputElement
  #onSearch
  #onSelect
  #resultsElement
  #results
  #currentFocus
  #originalInput

  constructor(inputElement, onSearch, onSelect) {
    this.#inputElement = inputElement
    this.#onSearch = debounce300(onSearch)
    this.#onSelect = onSelect

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

    for (const [i, result] of results.entries()) {
      const resultElement = document.createElement('li')
      const resultContent = document.createElement('div')
      resultContent.textContent = `${result.label} ${result.id}`
      resultElement.appendChild(resultContent)

      resultElement.addEventListener('click', () => {
        this.#onSelect(result.id, result.label)
        this.#resultsElement.hidePopover()
      })

      resultElement.addEventListener('mouseover', () => {
        this.#currentFocus = i
        this.#addHighlight()
      })

      resultElement.addEventListener('mouseout', () => {
        this.#currentFocus = -1
        this.#removeHighlight()
      })

      this.#resultsElement.appendChild(resultElement)
    }

    this.#showPopoverUnderInputElement()
  }

  #showPopoverUnderInputElement() {
    const rect = this.#inputElement.getBoundingClientRect()

    this.#resultsElement.style.position = 'absolute'
    this.#resultsElement.style.top = `${rect.bottom + window.scrollY}px`
    this.#resultsElement.style.left = `${rect.left + window.scrollX}px`
    this.#resultsElement.style.width = `${rect.width}px`

    this.#resultsElement.showPopover()
  }

  #handleKeyDown(event) {
    if (this.#results.length === 0 || this.#inputElement.value.length < 3)
      return

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        this.#moveFocus('next')
        this.#applyCurrentSelect()
        break

      case 'ArrowUp':
        event.preventDefault()
        this.#moveFocus('previous')
        this.#applyCurrentSelect()
        break
    }
  }

  #applyCurrentSelect() {
    const isSelected = this.#currentFocus >= 0

    if (isSelected) {
      const currentResult = this.#results[this.#currentFocus]
      this.#onSelect(currentResult.id, currentResult.label)
    } else {
      // If no item is focused, reset to the original input.
      this.#onSelect(this.#originalInput, '')
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
}
