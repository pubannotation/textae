import { EventEmitter } from 'events'
import IdContainer from './IdContainer'
import modelToId from '../modelToId'
import getPaneDomOfType from '../getPaneDomOfType'

const kinds = ['span', 'entity', 'attribute', 'relation']

export default class extends EventEmitter {
  constructor(annotationData) {
    super()

    this.map = new Map(
      kinds.map((kindName) => [kindName, new IdContainer(this, kindName)])
    )
    this.map.forEach((container, name) => {
      this[name] = container
    })

    const eventMap = new Map([
      ['all.change', () => this.clear()],
      ['span.remove', (span) => this.span.remove(modelToId(span))],
      ['entity.remove', (entity) => this.entity.remove(modelToId(entity))],
      [
        'relation.remove',
        (relation) => this.relation.remove(modelToId(relation))
      ]
    ])

    // Bind the selection model to the model.
    for (let eventHandler of eventMap) {
      annotationData.on(eventHandler[0], eventHandler[1])
    }
  }
  clear() {
    this.map.forEach((c) => c.clear())
  }
  some() {
    return Array.from(this.map.values()).reduce((a, b) => a || b.some(), false)
  }
  add(modelType, id) {
    console.assert(this[modelType])
    this[modelType].add(id)
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
  selectSingleSpanById(spanId) {
    if (spanId) {
      this.clear()
      this.span.add(spanId)
    }
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
}
