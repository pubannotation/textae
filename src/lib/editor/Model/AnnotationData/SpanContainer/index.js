import mappingFunction from './mappingFunction'
import createSpanTree from './createSpanTree'
import spanComparator from './spanComparator'
import idFactory from '../../../idFactory'
import SpanModel from './SpanModel'
import ContatinerWithSubContainer from '../ContatinerWithSubContainer'

export default class extends ContatinerWithSubContainer {
  constructor(editor, emitter, parentContainer) {
    super(emitter, parentContainer, 'span', (denotations) =>
      mappingFunction(denotations, editor, this.entityContainer)
    )
    this._editor = editor
    this.spanTopLevel = []
  }

  // private
  updateSpanTree() {
    // the spanTree has parent-child structure.
    return createSpanTree(this, this._editor, super.all)
  }

  // expected span is like { "begin": 19, "end": 49 }
  add(span) {
    console.assert(span, 'span is necessary.')

    return super.add(
      new SpanModel(this._editor, span, this.entityContainer),
      () => {
        this.spanTopLevel = this.updateSpanTree()
      }
    )
  }

  addSource(spans) {
    super.addSource(spans)
    this.spanTopLevel = this.updateSpanTree()
  }

  has(span) {
    const spanId = idFactory.makeSpanId(this._editor, span)
    return this.container.has(spanId)
  }

  get(spanId) {
    return super.get(spanId)
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

  topLevel() {
    return this.spanTopLevel
  }

  get hasMultiEntities() {
    return super.all.some((span) => span.hasMultiEntitiesType)
  }

  remove(id) {
    const span = super.remove(id)
    this.spanTopLevel = this.updateSpanTree()
    return span
  }

  clear() {
    super.clear()
    this.spanTopLevel = []
  }

  move(id, newSpan) {
    const oldOne = super.remove(id)
    const newOne = super.add(
      new SpanModel(this._editor, newSpan, this.entityContainer),
      (newOne) => {
        this.spanTopLevel = this.updateSpanTree()
        // Span.getTypes function depends on the property of the entity.
        // We can not distinguish the span is block span or not unless the span ID of the entity is updated.
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
}
