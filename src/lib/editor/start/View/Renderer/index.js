import EntityRenderer from './EntityRenderer'
import bindAnnotationDataEvents from './bindAnnotationDataEvents'

export default class Renderer {
  constructor(editor, annotationData) {
    this._annotationData = annotationData
    const entityRenderer = new EntityRenderer(annotationData)

    bindAnnotationDataEvents(annotationData, editor, entityRenderer)

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
        for (const relation of this._annotationData.relation.all) {
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

    this._annotationData = annotationData
  }
}
