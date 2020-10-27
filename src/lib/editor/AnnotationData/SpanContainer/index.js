import updateSpanTree from './updateSpanTree'
import spanComparator from './spanComparator'
import { makeDenotationSpanDomId } from '../../idFactory'
import DenotationSpanModel from './DenotationSpanModel'
import StyleSpanModel from './StyleSpanModel'
import isBoundaryCrossingWithOtherSpans from '../isBoundaryCrossingWithOtherSpans'
import ModelContainer from '../ModelContainer'

export default class SpanContainer extends ModelContainer {
  constructor(editor, emitter, entityContainer) {
    super(emitter, 'span')

    this._editor = editor
    this._entityContainer = entityContainer

    // Keep tyep settings independent of span editing.
    this._typeSettings = new Map()
  }

  // expected span is like { "begin": 19, "end": 49 }
  add(newValue) {
    console.assert(newValue, 'span is necessary.')

    // When redoing, the newValue is instance of the DenotationSpanModel already.
    if (newValue instanceof DenotationSpanModel) {
      return super.add(newValue, () => {
        this._updateSpanTree()
      })
    }

    return super.add(
      new DenotationSpanModel(
        this._editor,
        newValue.begin,
        newValue.end,
        this._entityContainer,
        this
      ),
      () => {
        this._updateSpanTree()
      }
    )
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
    const spanId = makeDenotationSpanDomId(this._editor, begin, end)
    return this._container.has(spanId)
  }

  get(spanId) {
    if (this._container.has(spanId)) {
      return super.get(spanId)
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
    let first = super.get(firstId)
    let second = super.get(secondId)

    // switch if seconfId before firstId
    if (spanComparator(first, second) > 0) {
      const temp = first
      first = second
      second = temp
    }

    return super.all
      .filter((span) => first.begin <= span.begin && span.end <= second.end)
      .map((span) => span.id)
  }

  get topLevel() {
    return this.all.filter((span) => span.parent === this).sort(spanComparator)
  }

  get children() {
    return this.topLevel
  }

  clear() {
    super.clear()
    this._typeSettings = new Map()
  }

  moveObjectSpan(id, begin, end) {
    console.assert(
      id !== makeDenotationSpanDomId(this._editor, begin, end),
      `Do not need move span:  ${id} ${begin} ${end}`
    )

    const oldOne = super.remove(id)
    const newOne = super.add(
      new DenotationSpanModel(
        this._editor,
        begin,
        end,
        this._entityContainer,
        this
      ),
      (newOne) => {
        this._updateSpanTree()
        // Span.entities depends on the property of the entity.
        // Span DOM element is rendered by 'span.add' event.
        // We need to update the span ID of the entity before 'span.add' event.
        oldOne.passesAllEntitiesTo(newOne)
      }
    )

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
      (s) => !this._container.has(s.id)
    )
    return super.all.concat(styleOnlySpans)
  }

  get allObjectSpans() {
    return super.all
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

        this._container.set(objectSpan.id, objectSpan)

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
}
