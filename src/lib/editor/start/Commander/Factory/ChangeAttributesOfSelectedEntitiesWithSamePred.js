import CompositeCommand from './CompositeCommand'
import AttributeChangeCommand from './AttributeChangeCommand'

export default class extends CompositeCommand {
  constructor(annotationData, selectionModel, pred, newObj) {
    super()

    const selectedEntities = selectionModel.entity.all
    const selectedEntitiesWithSamePred = selectedEntities.filter((entity) =>
      entity.attributes.find((attribute) => attribute.pred === pred)
    )

    const effectedAttributes = []
    for (const entity of selectedEntitiesWithSamePred) {
      const attribute = entity.attributes.find(
        (a) => a.pred == pred && a.obj !== newObj
      )

      if (attribute) {
        effectedAttributes.push(
          new AttributeChangeCommand(annotationData, attribute, null, newObj)
        )
      }
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
