import updateSpanTree from './updateSpanTree'
import spanComparator from './spanComparator'
import {
  makeBlockSpanHTMLElementID,
  makeDenotationSpanHTMLElementID
} from '../../idFactory'
import DenotationSpanModel from './DenotationSpanModel'
import StyleSpanModel from './StyleSpanModel'
import BlockSpanModel from './BlockSpanModel'
import isBoundaryCrossingWithOtherSpans from '../isBoundaryCrossingWithOtherSpans'
import rangeFrom from './rangeFrom'
import getCurrentMaxHeight from './getCurrentMaxHeight'

export default class SpanModelContainer {
  /**
   *
   * @param {import('../createTextBox/TextBox').default} textBox
   */
  constructor(
    editorID,
    editorHTMLElement,
    emitter,
    entityContainer,
    textBox,
    typeGap
  ) {
    this._editorID = editorID
    this._editorHTMLElement = editorHTMLElement
    this._emitter = emitter
    this._entityContainer = entityContainer
    this._textBox = textBox
    this.typeGap = typeGap

    this._denotations = new Map()
    this._blocks = new Map()
    this._styles = new Map()
  }

  // expected span is like { "begin": 19, "end": 49 }
  add(newValue) {
    console.assert(newValue, 'span is necessary.')

    // When redoing, the newValue is instance of the BlockSpanModel
    // or the DeontationSpan already.
    if (newValue instanceof BlockSpanModel) {
      return this._addBlock(newValue)
    } else if (newValue instanceof DenotationSpanModel) {
      return this._addDenotation(newValue)
    } else if (newValue.isBlock) {
      console.assert(
        !this.doesParentOrSameSpanExist(newValue.begin, newValue.end),
        `There are some parent spans of {begin: ${newValue.begin}, end: ${newValue.end}}.`
      )

      const blockSpan = new BlockSpanModel(
        this._editorID,
        this._editorHTMLElement,
        newValue.begin,
        newValue.end,
        this._entityContainer,
        this,
        this._textBox
      )
      return this._addBlock(blockSpan)
    } else {
      console.assert(
        !this.hasDenotationSpan(newValue.begin, newValue.end),
        'There is already a span.'
      )
      const denotationSpan = new DenotationSpanModel(
        this._editorID,
        this._editorHTMLElement,
        newValue.begin,
        newValue.end,
        this._entityContainer,
        this
      )
      return this._addDenotation(denotationSpan)
    }
  }

  // It is assumed that the denotations or typesettings
  // in the annotation file will be passed.
  addSource(source, type) {
    for (const element of source) {
      this._addInstanceFromElement(type, element)
    }

    this._updateSpanTree()
  }

  hasDenotationSpan(begin, end) {
    const spanID = makeDenotationSpanHTMLElementID(this._editorID, begin, end)
    return this._denotations.has(spanID)
  }

  hasBlockSpan(begin, end) {
    const spanID = makeBlockSpanHTMLElementID(this._editorID, begin, end)
    return this._blocks.has(spanID)
  }

  hasBlockSpanBetween(begin, end, option = {}) {
    for (const blockSpan of this._blocks.values()) {
      if (
        begin <= blockSpan.begin &&
        blockSpan.end <= end &&
        option &&
        blockSpan.id !== option.excluded
      ) {
        return true
      }
    }

    return false
  }

  hasParentOf(begin, end, spanID) {
    for (const parent of this.all) {
      if (parent.id === spanID) {
        continue
      }

      if (parent.begin <= begin && end <= parent.end) {
        return true
      }
    }

    return false
  }

  get(spanID) {
    if (this._denotations.has(spanID)) {
      return this._denotations.get(spanID)
    } else if (this._blocks.has(spanID)) {
      return this._blocks.get(spanID)
    } else {
      // Returns a typesetting only.
      return this._styles.get(spanID)
    }
  }

  getStyle(spanID) {
    if (this._styles.has(spanID)) {
      return this._styles.get(spanID).styles
    } else {
      return new Set()
    }
  }

  getDenotationSpan(spanID) {
    if (this._denotations.has(spanID)) {
      return this._denotations.get(spanID)
    }
  }

  rangeDenotationSpan(firstID, secondID) {
    return rangeFrom(this._denotations, firstID, secondID)
  }

  rangeBlockSpan(firstID, secondID) {
    return rangeFrom(this._blocks, firstID, secondID)
  }

  get topLevel() {
    return this.all.filter((span) => span.parent === this).sort(spanComparator)
  }

  get children() {
    return this.topLevel
  }

  clear() {
    this._denotations.clear()
    this._blocks.clear()
    this._styles.clear()
  }

  remove(id) {
    const blockSpan = this._blocks.get(id)
    if (blockSpan) {
      this._removeBlock(blockSpan)
      return
    }

    const denotationSpan = this._denotations.get(id)
    if (denotationSpan) {
      this._removeDenotation(denotationSpan)
      return
    }

    console.assert(false, `There is no target for remove for ${id}!`)
  }

  moveDenotationSpan(id, begin, end) {
    console.assert(
      id !== makeDenotationSpanHTMLElementID(this._editorID, begin, end),
      `Do not need move span:  ${id} ${begin} ${end}`
    )

    const oldSpan = this._denotations.get(id)
    console.assert(oldSpan, `There is no target for move for ${id}!`)

    this._removeDenotation(oldSpan)

    const newOne = new DenotationSpanModel(
      this._editorID,
      this._editorHTMLElement,
      begin,
      end,
      this._entityContainer,
      this
    )
    this._addDenotation(newOne, oldSpan)
    this._emitter.emit('textae-event.annotation-data.span.move')

    return {
      begin: oldSpan.begin,
      end: oldSpan.end,
      id: newOne.id
    }
  }

  moveBlockSpan(id, begin, end) {
    console.assert(
      id !== makeBlockSpanHTMLElementID(this._editorID, begin, end),
      `Do not need move span:  ${id} ${begin} ${end}`
    )

    const oldSpan = this._blocks.get(id)
    this._removeBlock(oldSpan)

    const newOne = new BlockSpanModel(
      this._editorID,
      this._editorHTMLElement,
      begin,
      end,
      this._entityContainer,
      this,
      this._textBox
    )
    this._addBlock(newOne, oldSpan)
    this._emitter.emit('textae-event.annotation-data.span.move')

    return {
      begin: oldSpan.begin,
      end: oldSpan.end,
      id: newOne.id
    }
  }

  _addDenotation(denotationSpan, oldSpan = null) {
    this._addSpan(this._denotations, denotationSpan, oldSpan)
    this._emitter.emit(`textae-event.annotation-data.span.add`, denotationSpan)

    return denotationSpan
  }

  _addBlock(blockSpan, oldSpan = null) {
    this._addSpan(this._blocks, blockSpan, oldSpan)
    this._emitter.emit(`textae-event.annotation-data.span.add`, blockSpan)

    return blockSpan
  }

  _addSpan(container, span, oldSpan = null) {
    container.set(span.id, span)
    this._updateSpanTree()

    if (oldSpan) {
      // Span.entities depends on the property of the entity.
      // Span DOM element is rendered by 'span.add' event.
      // We need to update the span ID of the entity before 'span.add' event.
      oldSpan.passesAllEntitiesTo(span)
    }

    const { clientHeight, clientWidth } = document.documentElement
    span.render(clientHeight, clientWidth)
  }

  _removeDenotation(span) {
    this._denotations.delete(span.id)
    span.erase()
    this._emitter.emit(`textae-event.annotation-data.span.remove`, span)
  }

  _removeBlock(span) {
    this._blocks.delete(span.id)
    span.erase()
    this._emitter.emit(`textae-event.annotation-data.span.remove`, span)
  }

  isBoundaryCrossingWithOtherSpans(begin, end) {
    return isBoundaryCrossingWithOtherSpans(this.all, begin, end)
  }

  doesParentOrSameSpanExist(begin, end) {
    const isParent = (span) => span.begin <= begin && end <= span.end

    return (
      [...this._denotations.values()].some(isParent) ||
      [...this._blocks.values()].some(isParent) ||
      [...this._styles.values()].some(isParent)
    )
  }

  get all() {
    const styleOnlySpans = [...this._styles.values()].filter(
      (s) => !this._denotations.has(s.id)
    )
    return [...this._blocks.values()]
      .concat([...this._denotations.values()])
      .concat(styleOnlySpans)
  }

  get allDenotationSpans() {
    return [...this._denotations.values()]
  }

  get allBlockSpans() {
    return [...this._blocks.values()]
  }

  // It has a common interface with the span model so that it can be the parent of the span model.
  get begin() {
    return 0
  }

  // It has a common interface with the span model so that it can be the parent of the span model
  get element() {
    return this._editorHTMLElement.querySelector(`.textae-editor__text-box`)
  }

  _updateSpanTree() {
    // Register a typesetting in the span tree to put it in the span rendering flow.
    updateSpanTree(this, this.all)
  }

  _addInstanceFromElement(type, denotation) {
    switch (type) {
      case 'denotation': {
        const objectSpan = new DenotationSpanModel(
          this._editorID,
          this._editorHTMLElement,
          denotation.span.begin,
          denotation.span.end,
          this._entityContainer,
          this
        )

        this._denotations.set(objectSpan.id, objectSpan)
        break
      }
      case 'block': {
        const blockSpan = new BlockSpanModel(
          this._editorID,
          this._editorHTMLElement,
          denotation.span.begin,
          denotation.span.end,
          this._entityContainer,
          this,
          this._textBox
        )

        this._blocks.set(blockSpan.id, blockSpan)
        break
      }
      case 'typesetting': {
        const styleSpan = new StyleSpanModel(
          this._editorID,
          this._editorHTMLElement,
          denotation.span.begin,
          denotation.span.end,
          this,
          denotation.style
        )

        // Merge multiple styles for the same range.
        if (this._styles.has(styleSpan.id)) {
          this._styles.get(styleSpan.id).appendStyles(styleSpan.styles)
        } else {
          this._styles.set(styleSpan.id, styleSpan)
        }

        break
      }
      default:
        throw `${type} is unknown type span!`
    }
  }

  arrangeDenotationEntityPosition() {
    for (const span of this.allDenotationSpans) {
      span.updateGridPosition()
    }
  }

  arrangeBlockEntityPosition() {
    for (const span of this.allBlockSpans) {
      span.updateGridPosition()
    }
  }

  arrangeBackgroundOfBlockSpanPosition() {
    for (const span of this.allBlockSpans) {
      span.updateBackgroundPosition()
    }
  }

  get maxHeight() {
    const spans = [...this._blocks.values()].concat([
      ...this._denotations.values()
    ])

    if (spans.length) {
      return getCurrentMaxHeight(spans)
    } else {
      return null
    }
  }
}
