import debounce300 from './SettingDialog/reflectImmediately/debounce300'
import anemone from './anemone'

export default class Autocomplete {
  constructor(inputElement, onSearch, onSelect) {
    this.inputElement = inputElement
    this.onSearch = debounce300(onSearch)
    this.onSelect = onSelect

    this.resultsList = document.createElement('ul')
    this.resultsList.setAttribute('popover', 'auto')
    this.resultsList.classList.add('autocomplete')

    this.currentFocus = -1 // For key-down operation.
    this.originalInput = ''

    inputElement.parentElement.appendChild(this.resultsList)
    this.inputElement.addEventListener('input', this.handleInput.bind(this))
    this.inputElement.addEventListener('keydown', this.handleKeyDown.bind(this))
  }

  handleInput(event) {
    const term = event.target.value

    if (term.length >= 3) {
      this.onSearch(term, (results) => this.onResults(results))
    } else {
      this.resultsList.hidePopover()
    }
  }

  onResults(results) {
    this.resultsList.innerHTML = ''
    this.currentFocus = -1 // Reset currentFocus by every search.
    this.originalInput = this.inputElement.value

    if (results.length === 0) return

    for (const [i, result] of results.entries()) {
      const listItem = document.createElement('li')
      listItem.innerHTML = anemone`
        <div>
          ${result.label} ${result.id}
        </div>
      `

      listItem.addEventListener('mouseover', () => {
        this.currentFocus = i
        this.addHighlight(this.resultsList.querySelectorAll('li'))
      })

      listItem.addEventListener('mouseout', () => {
        this.currentFocus = -1
        listItem.classList.remove('active')
      })

      listItem.addEventListener('click', () => {
        this.onSelect(result.id, result.label)
        this.resultsList.hidePopover()
      })
      this.resultsList.appendChild(listItem)
    }

    this.currentResults = results
    this.showPopoverUnderInputElement()
  }

  showPopoverUnderInputElement() {
    const rect = this.inputElement.getBoundingClientRect()

    this.resultsList.style.position = 'absolute'
    this.resultsList.style.top = `${rect.bottom + window.scrollY}px`
    this.resultsList.style.left = `${rect.left + window.scrollX}px`
    this.resultsList.style.width = `${rect.width}px`

    this.resultsList.showPopover()
  }

  handleKeyDown(event) {
    const items = this.resultsList.querySelectorAll('li')
    if (items.length === 0) return

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        this.moveFocus('next', items)
        if (this.currentFocus >= 0) {
          const currentResult = this.currentResults[this.currentFocus]
          this.onSelect(currentResult.id, currentResult.label)
        } else {
          // No item is focused, reset to the original input.
          this.onSelect(this.originalInput, '')
        }
        break

      case 'ArrowUp':
        event.preventDefault()
        this.moveFocus('previous', items)
        if (this.currentFocus >= 0) {
          const currentResult = this.currentResults[this.currentFocus]
          this.onSelect(currentResult.id, currentResult.label)
        } else {
          // No item is focused, reset to the original input.
          this.onSelect(this.originalInput, '')
        }
        break

      case 'Enter':
        event.preventDefault()
        if (this.currentFocus >= 0) {
          items[this.currentFocus].click()
        }
        break
    }
  }

  moveFocus(direction, items) {
    const itemsCount = items.length

    switch (direction) {
      case 'next':
        if (this.currentFocus < itemsCount - 1) {
          this.currentFocus++
        } else {
          this.currentFocus = -1
        }
        break
      case 'previous':
        if (this.currentFocus > 0) {
          this.currentFocus--
        } else if (this.currentFocus === 0) {
          this.currentFocus = -1
        } else {
          this.currentFocus = itemsCount - 1
        }
        break
    }

    this.addHighlight(items)
  }

  addHighlight(items) {
    this.removeHighlight(items)

    if (this.currentFocus === -1) return

    items[this.currentFocus].classList.add('active')
  }

  removeHighlight(items) {
    for (const item of items) {
      item.classList.remove('active')
    }
  }
}
