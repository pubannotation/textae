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

  _toModel(entity) {
    if (entity.style) {
      return new StyleSpanModel(this._editor, entity.span, this, entity.style)
    } else {
      return new ObjectSpanModel(
        this._editor,
        entity.span,
        this._entityContainer,
        this
      )
    }
  }

  _addToContainer(instance) {
    if (instance instanceof ObjectSpanModel) {
      this._container.set(instance.id, instance)
    }

    if (instance instanceof StyleSpanModel) {
      if (this._typeSets.has(instance.id)) {
        this._typeSets.get(instance.id).appendStyles(instance.styles)
      } else {
        this._typeSets.set(instance.id, instance)
      }
    }

    return instance
  }

  // expected span is like { "begin": 19, "end": 49 }
  add(span) {
    console.assert(span, 'span is necessary.')

    return super.add(
      new ObjectSpanModel(this._editor, span, this._entityContainer, this),
      () => {
        updateSpanTree(this.all)
      }
    )
  }

  addSource(spans) {
    super.addSource(spans)

    updateSpanTree(this.all)
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
    const styleOnlySpans = [...this._typeSets.values()].filter(
      (s) => !this._container.has(s.id)
    )

    return super.all
      .concat(styleOnlySpans)
      .filter((span) => span.parent === null)
      .sort(spanComparator)
  }

  _merageStyle(span) {
    return span
  }

  remove(id) {
    const span = super.remove(id)

    updateSpanTree(this.all)
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
        updateSpanTree(this.all)
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
}
