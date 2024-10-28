export default class AutocompleteModel {
  #onTermChange
  #onItemsChange
  #onHighlightIndexChange
  #term = ''
  #items = []
  #highlightedIndex = -1

  constructor(onTermChange, onItemsChange, onHighlightIndexChange) {
    this.#onTermChange = onTermChange
    this.#onItemsChange = onItemsChange
    this.#onHighlightIndexChange = onHighlightIndexChange
  }

  get term() {
    return this.#term
  }

  set term(value) {
    this.#term = value

    if (this.#term.length >= 3) {
      this.#onTermChange(this.#term)
    } else {
      this.#items = [] // Clear items.
    }
  }

  get items() {
    return this.#items
  }

  set items(value) {
    this.#items = value
    this.#highlightedIndex = -1 // Clear highlight.
    this.#onItemsChange(this.#items)
  }

  get highlightedIndex() {
    return this.#highlightedIndex
  }

  set highlightedIndex(value) {
    this.#highlightedIndex = value
    this.#onHighlightIndexChange(this.#highlightedIndex)
  }

  moveHighlightIndexPrevious() {
    if (this.highlightedIndex > 0) {
      this.highlightedIndex--
    } else if (this.highlightedIndex === 0) {
      this.highlightedIndex = -1
    } else {
      this.highlightedIndex = this.items.length - 1
    }
  }

  moveHighlightIndexNext() {
    if (this.highlightedIndex < this.items.length - 1) {
      this.highlightedIndex++
    } else {
      this.highlightedIndex = -1
    }
  }
}
