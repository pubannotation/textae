import updateSpanTree from './updateSpanTree'
import spanComparator from './spanComparator'
import idFactory from '../../idFactory'
import ObjectSpanModel from './ObjectSpanModel'
import StyleSpanModel from './StyleSpanModel'
import isBoundaryCrossingWithOtherSpans from '../isBoundaryCrossingWithOtherSpans'
import ModelContainer from '../ModelContainer'

export default class extends ModelContainer {
  constructor(editor, emitter, entityContainer) {
    super(emitter, 'span')

    this._editor = editor
    this._entityContainer = entityContainer

    // Keep tyep sets independent of span editing.
    this._typeSets = new Map()
  }

  // expected span is like { "begin": 19, "end": 49 }
  add(newValue) {
    console.assert(newValue, 'span is necessary.')

    // When redoing, the newValue is instance of the ObjectSpanModel already.
    if (newValue instanceof ObjectSpanModel) {
      return super.add(newValue, () => {
        updateSpanTree(this.all, this)
      })
    }

    return super.add(
      new ObjectSpanModel(this._editor, newValue, this._entityContainer, this),
      () => {
        updateSpanTree(this.all, this)
      }
    )
  }

  // It is assumed that the denotations or typesettings
  // in the annotation file will be passed.
  addSource(source, type) {
    for (const element of source) {
      this._addInstanceFromElement(type, element)
    }

    updateSpanTree(this.all, this)
  }

  has(span) {
    const spanId = idFactory.makeSpanDomId(this._editor, span)
    return this._container.has(spanId)
  }

  get(spanId) {
    if (this._container.has(spanId)) {
      return super.get(spanId)
    } else {
      // Returns a typeset only.
      return this._typeSets.get(spanId)
    }
  }

  range(firstId, secondId) {
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

  remove(id) {
    const span = super.remove(id)

    updateSpanTree(this.all, this)
    return span
  }

  clear() {
    super.clear()
    this._typeSets = new Map()
  }

  move(id, newSpan) {
    const oldOne = super.remove(id)
    const newOne = super.add(
      new ObjectSpanModel(this._editor, newSpan, this._entityContainer, this),
      (newOne) => {
        updateSpanTree(this.all, this)
        // Span.entities depends on the property of the entity.
        // Span DOM element is rendered by 'span.add' event.
        // We need to update the span ID of the entity before 'span.add' event.
        oldOne.passesAllEntitiesTo(newOne)
      }
    )

    super._emit('textae.annotationData.span.move')

    return [
      {
        begin: oldOne.begin,
        end: oldOne.end
      },
      newOne.id
    ]
  }

  isBoundaryCrossingWithOtherSpans(span) {
    return isBoundaryCrossingWithOtherSpans(this.all, span)
  }

  get all() {
    const styleOnlySpans = [...this._typeSets.values()].filter(
      (s) => !this._container.has(s.id)
    )
    return super.all.concat(styleOnlySpans)
  }

  get allSpansWithGrid() {
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

  _addInstanceFromElement(type, denotation) {
    switch (type) {
      case 'object span': {
        const objectSpan = new ObjectSpanModel(
          this._editor,
          denotation.span,
          this._entityContainer,
          this
        )

        this._container.set(objectSpan.id, objectSpan)

        break
      }
      case 'style span': {
        const styleSpan = new StyleSpanModel(
          this._editor,
          denotation.span,
          this,
          denotation.style
        )

        // Merge multiple styles for the same range.
        if (this._typeSets.has(styleSpan.id)) {
          this._typeSets.get(styleSpan.id).appendStyles(styleSpan.styles)
        } else {
          this._typeSets.set(styleSpan.id, styleSpan)
        }

        break
      }
      default:
        throw `${type} is unknown type span!`
    }
  }
}
