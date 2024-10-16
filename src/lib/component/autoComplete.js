export default class Autocomplete {
  constructor(inputElement, onSearch, onSelect) {
    this.inputElement = inputElement
    this.onSearch = onSearch
    this.onSelect = onSelect

    this.resultsList = document.createElement('ul')
    this.resultsList.setAttribute('popover', 'auto')
    this.resultsList.style.margin = '0'

    inputElement.parentElement.appendChild(this.resultsList)
    this.inputElement.addEventListener('input', this.handleInput.bind(this))
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

    if (results.length === 0) {
      this.resultsList.hidePopover()
      return
    }

    for (const result of results) {
      const listItem = document.createElement('li')
      listItem.innerHTML = `
        <div>
          ${result.label} ${result.id}
        </div>
      `

      listItem.addEventListener('click', () => {
        this.onSelect(result.id, result.label)
        this.resultsList.hidePopover()
      })

      this.resultsList.appendChild(listItem)
    }

    this.showPopoverUnderInputElement()
  }

  showPopoverUnderInputElement() {
    const rect = this.inputElement.getBoundingClientRect()

    this.resultsList.style.position = 'absolute'
    this.resultsList.style.top = `${rect.bottom + window.scrollY}px`
    this.resultsList.style.left = `${rect.left + window.scrollX}px`

    this.resultsList.showPopover()
  }
}
