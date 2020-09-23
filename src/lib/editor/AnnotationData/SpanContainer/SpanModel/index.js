import idFactory from '../../../idFactory'
import getBigBrotherSpan from './getBigBrotherSpan'

export default class {
  constructor(editor, span, spanContainer) {
    this._editor = editor
    this._span = span
    this._spanContainer = spanContainer

    this.severTies()
  }

  get id() {
    return idFactory.makeSpanDomId(this._editor, this._span)
  }

  get begin() {
    return this._span.begin
  }

  get end() {
    return this._span.end
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

  get gridElement() {
    return document.querySelector(`#G${this.id}`)
  }
}
