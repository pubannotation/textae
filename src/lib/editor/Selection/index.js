import IdContainer from './IdContainer'
import modelToId from '../modelToId'
import getPaneDomOfType from '../getPaneDomOfType'

const kinds = ['span', 'entity', 'relation']

export default class {
  constructor(eventEmitter, annotationData) {
    this._map = new Map(
      kinds.map((kindName) => [
        kindName,
        new IdContainer(eventEmitter, kindName, annotationData)
      ])
    )
    this._map.forEach((container, name) => {
      this[name] = container
    })

    const eventMap = new Map([
      ['textae.annotationData.all.change', () => this.clear()],
      [
        'textae.annotationData.span.remove',
        (span) => this.span.remove(modelToId(span))
      ],
      [
        'textae.annotationData.entity.remove',
        (entity) => this.entity.remove(modelToId(entity))
      ],
      [
        'textae.annotationData.relation.remove',
        (relation) => this.relation.remove(modelToId(relation))
      ]
    ])

    // Bind the selection model to the model.
    for (const eventHandler of eventMap) {
      eventEmitter.on(eventHandler[0], eventHandler[1])
    }
  }

  add(modelType, id) {
    console.assert(this[modelType])
    this[modelType].add(id)
  }

  get some() {
    return Array.from(this._map.values()).reduce((a, b) => a || b.some, false)
  }

  clear() {
    this._map.forEach((c) => c.clear())
  }

  selectSpan(dom, isMulti) {
    if (dom) {
      if (isMulti) {
        this.span.add(dom.id)
      } else {
        this.selectSingleSpanById(dom.id)
      }
    }
  }

  selectSingleSpanById(spanId) {
    if (spanId) {
      this.clear()
      this.span.add(spanId)
    }
  }

  /**
   * Select entity.
   * @param {string} dom - dom of entity to select or array of ids of entities.
   * @param {bool} isMulti - select multi elements.
   * @return {undefined}
   */
  selectEntity(dom, isMulti) {
    // A entity may be null when the first or the last entity is selected at the Relation Edit Mode.
    if (dom) {
      if (!isMulti) {
        this.clear()
      }

      this.entity.add(dom.title)
    }
  }

  // Select all entities in the label
  selectEntityLabel(dom, isMulti) {
    if (dom) {
      const pane = getPaneDomOfType(dom)
      const allEntityOflabels = pane.children

      if (!isMulti) {
        this.clear()
      }

      this.entity.add(Array.from(allEntityOflabels).map((dom) => dom.title))
    }
  }

  getSelectedEntitiesWithSamePredicateAttribute(attrDef) {
    return this.entity.all.filter((entity) =>
      entity.attributes.find((attribute) => attribute.pred === attrDef.pred)
    )
  }
}
