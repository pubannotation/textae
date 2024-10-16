export default class Autocomplete {
  constructor(inputElement, onSearch, onSelect) {
    this.inputElement = inputElement
    this.onSearch = onSearch
    this.onSelect = onSelect

    this.resultsList = document.createElement('ul')
    this.resultsList.setAttribute('popover', 'auto')
    this.resultsList.style.margin = '0'

    this.selectedIndex = -1

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
    this.selectedIndex = -1

    if (results.length === 0) {
      this.resultsList.hidePopover()
      return
    }

    results.forEach((result, i) => {
      const listItem = document.createElement('li')
      listItem.innerHTML = `
        <div>
          ${result.label} ${result.id}
        </div>
      `

      listItem.result = result

      listItem.addEventListener('click', () => {
        this.onSelect(result.id, result.label)
        this.resultsList.hidePopover()
      })

      listItem.setAttribute('data-index', i)
      this.resultsList.appendChild(listItem)
    })

    this.showPopoverUnderInputElement()
  }

  showPopoverUnderInputElement() {
    const rect = this.inputElement.getBoundingClientRect()

    this.resultsList.style.position = 'absolute'
    this.resultsList.style.top = `${rect.bottom + window.scrollY}px`
    this.resultsList.style.left = `${rect.left + window.scrollX}px`

    this.resultsList.showPopover()
  }

  handleKeyDown(event) {
    const items = this.resultsList.querySelectorAll('li')
    if (items.length === 0) return

    switch (event.key) {
      case 'ArrowDown':
        this.selectedIndex = (this.selectedIndex + 1) % items.length
        this.updateSelection(items)
        break

      case 'ArrowUp':
        this.selectedIndex =
          (this.selectedIndex - 1 + items.length) % items.length
        this.updateSelection(items)
        break

      case 'Enter':
        if (this.selectedIndex >= 0) {
          const selectedItem = items[this.selectedIndex]
          this.onSelect(selectedItem.result.id, selectedItem.result.label)
          this.resultsList.hidePopover()
        }
        break

      default:
        return
    }

    event.preventDefault()
  }

  updateSelection(items) {
    items.forEach((item, i) => {
      if (this.selectedIndex === i) {
        item.classList.add('selected')
        item.scrollIntoView({ block: 'nearest' })
      } else {
        item.classList.remove('selected')
      }
    })
  }
}
