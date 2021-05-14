import EntityRenderer from './EntityRenderer'
import SpanRenderer from './SpanRenderer'
import getAnnotationBox from '../../../getAnnotationBox'

export default class Renderer {
  constructor(editor, annotationData) {
    const entityRenderer = new EntityRenderer(annotationData)
    const spanRenderer = new SpanRenderer()

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
        entityRenderer.remove(entity)
      })
      .on('textae-event.annotation-data.entity.move', (entities) => {
        for (const entity of entities) {
          entityRenderer.remove(entity)
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
      .on('textae-event.type-definition.entity.change', (typeName) =>
        entityRenderer.updateEntityHtmlelement(typeName)
      )
      .on('textae-event.type-definition.attribute.change', (pred) =>
        entityRenderer.updateAttribute(pred)
      )
      .on('textae-event.type-definition.attribute.move', (pred) =>
        entityRenderer.updateAttribute(pred)
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
