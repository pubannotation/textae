import CompositeCommand from './CompositeCommand'
import ChangeAttributeCommand from './ChangeAttributeCommand'

export default class ChangeObjectOfAttributeCommand extends CompositeCommand {
  constructor(annotationData, pred, oldObj, newObj) {
    super()

    const effectedAttributes = annotationData.attribute
      .getSameAttributes(pred, oldObj)
      .map((a) => new ChangeAttributeCommand(annotationData, a, null, newObj))

    this._subCommands = effectedAttributes
    this._logMessage = `update obj ${newObj} to attributes: ${effectedAttributes
      .map(
        ({ _attribute: attribute }) =>
          `{id: ${attribute.id}, subj: ${attribute.subj}, pred: ${attribute.pred}, obj: ${attribute.obj}}`
      )
      .join(',')}`
  }
}
