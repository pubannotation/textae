import dohtml from 'dohtml'
import { makeDenotationSpanHTMLElementId } from '../../../idFactory'
import createGridHtml from './createGridHtml'
import createRangeToSpan from '../createRangeToSpan'
import getBigBrotherSpan from './getBigBrotherSpan'
import updateGridPosition from './updateGridPosition'

export default class {
  constructor(editor, begin, end, spanContainer) {
    this._editor = editor
    this._begin = begin
    this._end = end
    this._spanContainer = spanContainer

    this.severTies()
  }

  get id() {
    return makeDenotationSpanHTMLElementId(this._editor, this._begin, this._end)
  }

  get begin() {
    return this._begin
  }

  get end() {
    return this._end
  }

  get types() {
    return []
  }

  get entities() {
    return []
  }

  get bigBrother() {
    return getBigBrotherSpan(this, this._spanContainer.topLevel)
  }

  // Return the SpanContainer.
  get root() {
    return this._spanContainer
  }

  get parent() {
    return this._parent
  }

  get children() {
    return this._children
  }

  severTies() {
    // Reset parent
    this._parent = null
    // Reset children
    this._children = []
  }

  beChildOf(parent) {
    parent.children.push(this)
    this._parent = parent
  }

  traverse(preOrderFunction, postOrderFunction) {
    preOrderFunction(this)

    for (const child of this._children) {
      child.traverse(preOrderFunction, postOrderFunction)
    }

    if (postOrderFunction) {
      postOrderFunction(this)
    }
  }

  get element() {
    return document.querySelector(`#${this.id}`)
  }

  renderElement() {
    const element = document.createElement('span')
    element.setAttribute('id', this.id)
    element.setAttribute('title', this.id)

    for (const style of this.styles.values()) {
      element.classList.add(`textae-editor__style`)
      element.classList.add(`textae-editor__style--${style}`)
    }

    const targetRange = createRangeToSpan(this)
    targetRange.surroundContents(element)

    return element
  }

  destroyElement() {
    const spanElement = this.element
    const parent = spanElement.parentNode

    // Move the textNode wrapped this span in front of this span.
    while (spanElement.firstChild) {
      parent.insertBefore(spanElement.firstChild, spanElement)
    }

    parent.removeChild(spanElement)
    parent.normalize()
  }

  get gridElement() {
    return document.querySelector(`#G${this.id}`)
  }

  get isGridRendered() {
    return this.gridElement
  }

  renderGridElement(top, left, width) {
    const html = createGridHtml(this.id, top, left, width)
    return dohtml.create(html)
  }

  updateGridPosition(top, left) {
    updateGridPosition(this.gridElement, top, left)
  }

  destroyGridElement() {
    if (this.isGridRendered) {
      this.gridElement.remove()
    }
  }
}
