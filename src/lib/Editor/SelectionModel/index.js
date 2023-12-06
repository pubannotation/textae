import SelectedItemsWithAttributes from './SelectedItemsWithAttributes'
import SelectedItems from './SelectedItems'

export default class SelectionModel {
  #annotationModel
  #eventEmitter

  constructor(eventEmitter, annotationModel) {
    this.#eventEmitter = eventEmitter
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

  add(annotationType, ids) {
    console.assert(this[annotationType])

    for (const id of ids) {
      this[annotationType].add(id)
    }

    if (
      annotationType === 'entity' &&
      this.#isDenotation(ids[ids.length - 1])
    ) {
      this.#eventEmitter.emit(
        'textae-event.selection-model.last-selected-denotation-id.change',
        ids[ids.length - 1]
      )
    }
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

    if (this.#isDenotation(id)) {
      this.#eventEmitter.emit(
        'textae-event.selection-model.last-selected-denotation-id.change',
        id
      )
    }
  }

  selectDenotation(id) {
    if (!this.#isDenotation(id)) {
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

  #isDenotation(id) {
    return this.#annotationModel.entity.hasDenotation(id)
  }
}
