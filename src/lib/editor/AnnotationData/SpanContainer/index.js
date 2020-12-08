import updateSpanTree from './updateSpanTree'
import spanComparator from './spanComparator'
import { makeDenotationSpanHTMLElementId } from '../../idFactory'
import DenotationSpanModel from './DenotationSpanModel'
import StyleSpanModel from './StyleSpanModel'
import BlockSpanModel from './BlockSpanModel'
import isBoundaryCrossingWithOtherSpans from '../isBoundaryCrossingWithOtherSpans'
import ModelContainer from '../ModelContainer'
import rangeFrom from './rangeFrom'
import getCurrentMaxHeight from './getCurrentMaxHeight'

export default class SpanContainer extends ModelContainer {
  constructor(editor, emitter, entityContainer, textBox, entityGap) {
    super(emitter, 'span')

    this._editor = editor
    this._entityContainer = entityContainer
    this._textBox = textBox
    this._entityGap = entityGap

    // Aliase to the super class property.
    this._denotations = this._container
    this._blocks = new Map()
    this._typeSettings = new Map()
  }

  // expected span is like { "begin": 19, "end": 49 }
  add(newValue) {
    console.assert(newValue, 'span is necessary.')

    if (newValue.isBlock || newValue instanceof BlockSpanModel) {
      // When redoing, the newValue is instance of the BlockSpanModel already.
      const blockSpan =
        newValue instanceof BlockSpanModel
          ? newValue
          : new BlockSpanModel(
              this._editor,
              newValue.begin,
              newValue.end,
              this._entityContainer,
              this
            )

      this._blocks.set(blockSpan.id, blockSpan)
      this._updateSpanTree()
      this._emit(`textae.annotationData.span.add`, blockSpan)
      this._textBox.forceUpdate()
      return blockSpan
    } else {
      // When redoing, the newValue is instance of the DenotationSpanModel already.
      const denotationSpan =
        newValue instanceof DenotationSpanModel
          ? newValue
          : new DenotationSpanModel(
              this._editor,
              newValue.begin,
              newValue.end,
              this._entityContainer,
              this
            )
      this._denotations.set(denotationSpan.id, denotationSpan)
      this._updateSpanTree()
      super._emit(`textae.annotationData.span.add`, denotationSpan)
      return denotationSpan
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
    const spanId = makeDenotationSpanHTMLElementId(this._editor, begin, end)
    return this._denotations.has(spanId)
  }

  get(spanId) {
    if (this._denotations.has(spanId)) {
      return this._denotations.get(spanId)
    } else if (this._blocks.has(spanId)) {
      return this._blocks.get(spanId)
    } else {
      // Returns a typesetting only.
      return this._typeSettings.get(spanId)
    }
  }

  getStyle(spanId) {
    if (this._typeSettings.has(spanId)) {
      return this._typeSettings.get(spanId).styles
    } else {
      return new Set()
    }
  }

  rangeDenotationSpan(firstId, secondId) {
    return rangeFrom(this._denotations, firstId, secondId)
  }

  rangeBlockSpan(firstId, secondId) {
    return rangeFrom(this._blocks, firstId, secondId)
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
    this._typeSettings.clear()
  }

  remove(id) {
    const instance = this._blocks.get(id)
    if (instance) {
      this._blocks.delete(id)
      this._emit(`textae.annotationData.span.remove`, instance)
      this._textBox.forceUpdate()
      return instance
    }

    return super.remove(id)
  }

  moveDenotationSpan(id, begin, end) {
    console.assert(
      id !== makeDenotationSpanHTMLElementId(this._editor, begin, end),
      `Do not need move span:  ${id} ${begin} ${end}`
    )

    const oldOne = super.remove(id)
    const newOne = new DenotationSpanModel(
      this._editor,
      begin,
      end,
      this._entityContainer,
      this
    )
    this._denotations.set(newOne.id, newOne)

    this._updateSpanTree()

    // Span.entities depends on the property of the entity.
    // Span DOM element is rendered by 'span.add' event.
    // We need to update the span ID of the entity before 'span.add' event.
    oldOne.passesAllEntitiesTo(newOne)

    super._emit(`textae.annotationData.span.add`, newOne)
    super._emit('textae.annotationData.span.move')

    return {
      begin: oldOne.begin,
      end: oldOne.end,
      id: newOne.id
    }
  }

  isBoundaryCrossingWithOtherSpans(begin, end) {
    return isBoundaryCrossingWithOtherSpans(this.all, begin, end)
  }

  get all() {
    const styleOnlySpans = [...this._typeSettings.values()].filter(
      (s) => !this._denotations.has(s.id)
    )
    return [...this._blocks.values()].concat(super.all).concat(styleOnlySpans)
  }

  get allDenotationSpans() {
    return super.all
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
    return this._editor[0].querySelector(`.textae-editor__body__text-box`)
  }

  _updateSpanTree() {
    // Register a typesetting in the span tree to put it in the span rendering flow.
    updateSpanTree(this, this.all)
  }

  _addInstanceFromElement(type, denotation) {
    switch (type) {
      case 'denotation': {
        const objectSpan = new DenotationSpanModel(
          this._editor,
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
          this._editor,
          denotation.span.begin,
          denotation.span.end,
          this._entityContainer,
          this
        )

        this._blocks.set(blockSpan.id, blockSpan)
        break
      }
      case 'typesetting': {
        const styleSpan = new StyleSpanModel(
          this._editor,
          denotation.span.begin,
          denotation.span.end,
          this,
          denotation.style
        )

        // Merge multiple styles for the same range.
        if (this._typeSettings.has(styleSpan.id)) {
          this._typeSettings.get(styleSpan.id).appendStyles(styleSpan.styles)
        } else {
          this._typeSettings.set(styleSpan.id, styleSpan)
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
      span.updateSidekicksOfBlockSpanPosition(this._textBox)
    }
  }

  get maxHeight() {
    return getCurrentMaxHeight(this, this._entityGap.value)
  }
}
