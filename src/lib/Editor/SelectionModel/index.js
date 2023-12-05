import SelectedItemsWithAttributes from './SelectedItemsWithAttributes'
import SelectedItems from './SelectedItems'

export default class SelectionModel {
  #annotationModel

  constructor(eventEmitter, annotationModel) {
    this.#annotationModel = annotationModel

    this.span = new SelectedItems(eventEmitter, 'span', annotationModel)
    this.entity = new SelectedItemsWithAttributes(
      eventEmitter,
      'entity',
      annotationModel
    )
    this.relation = new SelectedItemsWithAttributes(
      eventEmitter,
      'relation',
      annotationModel
    )

    // Bind the selection model to the model.
    eventEmitter
      .on('textae-event.annotation-data.span.remove', (span) =>
        this.span.removeInstance(span)
      )
      .on('textae-event.annotation-data.entity.remove', (entity) =>
        this.entity.removeInstance(entity)
      )
      .on('textae-event.annotation-data.relation.remove', (relation) =>
        this.relation.removeInstance(relation)
      )
      .on('textae-event.annotation-data.all.change', () => {
        // When the annotations are reset, the view will remove all HTML elements.
        // The selection model will release the selection instance without any manipulation.
        this.span.triggerChange()
        this.entity.triggerChange()
        this.relation.triggerChange()
      })
  }

  get copyingTargets() {
    // Map entities to types, because entities may be delete.
    return [...this.#selectedEntities].map(({ typeValues }) => typeValues)
  }

  get cuttingTargets() {
    return this.#selectedEntities
  }

  add(annotationType, id) {
    console.assert(this[annotationType])
    this[annotationType].add(id)
  }

  remove(annotationType, id) {
    console.assert(this[annotationType])
    this[annotationType].remove(id)
  }

  removeAll() {
    this.span.removeAll()
    this.entity.removeAll()
    this.relation.removeAll()
  }

  selectSpan(id) {
    this.removeAll()
    this.span.add(id)
  }

  selectSpanRange(rangeOfSpans) {
    this.removeAll()
    for (const id of rangeOfSpans) {
      this.span.add(id)
    }
  }

  selectEntity(id) {
    this.removeAll()
    this.entity.add(id)
  }

  selectDenotation(id) {
    if (!this.#annotationModel.entity.hasDenotation(id)) {
      throw new Error(`Denotation ${id} not found`)
    }

    this.selectEntity(id)
  }

  selectRelation(id) {
    this.removeAll()
    this.relation.add(id)
  }

  get #selectedEntities() {
    return new Set(
      this.span.all
        .map((span) => span.entities)
        .flat()
        .concat(this.entity.all)
    )
  }
}
