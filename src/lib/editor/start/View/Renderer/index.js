import SpanRenderer from './SpanRenderer'
import getAnnotationBox from '../../../getAnnotationBox'

export default class Renderer {
  constructor(editor, annotationData) {
    const spanRenderer = new SpanRenderer()

    const updateAttribute = function (pred) {
      for (const entity of annotationData.entity.all.filter((e) =>
        e.typeValues.hasSpecificPredicateAttribute(pred)
      )) {
        entity.updateElement()
      }
    }

    editor.eventEmitter
      .on('textae-event.annotation-data.all.change', () => {
        getAnnotationBox(editor).innerHTML = ''
        for (const span of annotationData.span.topLevel) {
          spanRenderer.render(span)
        }

        for (const relation of annotationData.relation.all) {
          relation.renderElement()
        }
      })
      .on('textae-event.annotation-data.span.add', (span) =>
        spanRenderer.render(span)
      )
      .on('textae-event.annotation-data.span.remove', (span) => {
        spanRenderer.remove(span)
        span.destroyGridElement()
      })
      .on('textae-event.annotation-data.entity.add', (entity) => {
        entity.renderAtTheGrid()
      })
      .on('textae-event.annotation-data.entity.remove', (entity) => {
        entity.remove()
      })
      .on('textae-event.annotation-data.entity.move', (entities) => {
        for (const entity of entities) {
          entity.remove()
          entity.renderAtTheGrid()
        }
      })
      .on('textae-event.commander.attributes.change', (attributes) => {
        for (const subjectModel of attributes.reduce(
          (prev, curr) => prev.add(curr.subjectModel),
          new Set()
        )) {
          subjectModel.updateElement()
        }
      })

    editor.eventEmitter
      .on('textae-event.type-definition.entity.change', (typeName) => {
        for (const entity of annotationData.entity.all) {
          // If the type name ends in a wildcard, look for the DOMs to update with a forward match.
          if (
            entity.typeName === typeName ||
            (typeName.lastIndexOf('*') === typeName.length - 1 &&
              entity.typeName.indexOf(typeName.slice(0, -1) === 0))
          ) {
            entity.updateElement()
          }
        }
      })
      .on('textae-event.type-definition.attribute.change', (pred) =>
        updateAttribute(pred)
      )
      .on('textae-event.type-definition.attribute.move', (pred) =>
        updateAttribute(pred)
      )
      .on('textae-event.type-definition.relation.change', (typeName) => {
        for (const relation of annotationData.relation.all) {
          // If the type name ends in a wildcard, look for the DOMs to update with a forward match.
          if (
            relation.typeName === typeName ||
            (typeName.lastIndexOf('*') === typeName.length - 1 &&
              relation.typeName.indexOf(typeName.slice(0, -1) === 0))
          ) {
            relation.updateElement()
          }
        }
      })
  }
}
