import BaseCommand from './BaseCommand'
import commandLog from './commandLog'
import findAttribute from './findAttribute'

export default class AttributeChangeCommand extends BaseCommand {
  constructor(
    annotationData,
    selectedEntities,
    oldPred,
    oldObj,
    newPred,
    newObj
  ) {
    super()

    this.selectedEntities = selectedEntities
    this.annotationData = annotationData
    this.oldPred = oldPred
    this.oldObj = oldObj
    this.newPred = newPred
    this.newObj = newObj
  }

  execute() {
    // Update models
    const effectedAttributes = []
    for (const id of this.selectedEntities) {
      const attribute = findAttribute(
        this.annotationData,
        id,
        this.oldPred,
        this.oldObj
      )

      // If you select an entity with attributes and an entity without attributes,
      // the attributes may not be found.
      if (attribute) {
        effectedAttributes.push(
          this.annotationData.attribute.change(
            attribute.id,
            this.newPred,
            this.newObj
          )
        )
      }
    }

    commandLog(
      `change type of an attribute old pred:${this.oldPred} old obj:${
        this.oldObj
      }. effected attributes: [${effectedAttributes
        .map(
          (a) =>
            `{id: ${a.id}, subj: ${a.subj}, pred: ${a.pred}, obj: ${a.obj}}`
        )
        .join(',')}]`
    )
  }

  revert() {
    return new AttributeChangeCommand(
      this.annotationData,
      this.selectedEntities,
      this.newPred,
      this.newObj,
      this.oldPred,
      this.oldObj
    )
  }
}
