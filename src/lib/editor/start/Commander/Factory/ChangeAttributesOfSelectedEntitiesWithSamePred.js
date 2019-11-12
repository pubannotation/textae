import CompositeCommand from './CompositeCommand'
import AttributeChangeCommand from './AttributeChangeCommand'

export default class extends CompositeCommand {
  constructor(annotationData, selectedEntities, pred, newObj) {
    super()

    const selectedEntitiesWithSamePred = selectedEntities
      .map((entityId) => annotationData.entity.get(entityId))
      .filter((entity) =>
        entity.attributes.find((attribute) => attribute.pred === pred)
      )

    const effectedAttributes = []
    for (const entity of selectedEntitiesWithSamePred) {
      const attribute = entity.attributes.find(
        (a) => a.pred == pred && a.obj !== newObj
      )

      effectedAttributes.push(
        new AttributeChangeCommand(annotationData, attribute, null, newObj)
      )
    }

    this._subCommands = effectedAttributes
    this._logMessage = `update obj ${newObj} to attributes: ${effectedAttributes
      .map(
        ({ attribute }) =>
          `{id: ${attribute.id}, subj: ${attribute.subj}, pred: ${attribute.pred}, obj: ${attribute.obj}}`
      )
      .join(',')}`
  }
}
