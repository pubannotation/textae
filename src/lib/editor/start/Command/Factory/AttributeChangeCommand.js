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
    super(function() {
      // Update models
      const effectedAttributes = []
      for (const id of selectedEntities) {
        const attribute = findAttribute(annotationData, id, oldPred, oldObj)

        // If you select an entity with attributes and an entity without attributes,
        // the attributes may not be found.
        if (attribute) {
          effectedAttributes.push(
            annotationData.attribute.change(attribute.id, newPred, newObj)
          )
        }
      }

      // Set revert
      this.revert = () =>
        new AttributeChangeCommand(
          annotationData,
          selectedEntities,
          newPred,
          newObj,
          oldPred,
          oldObj
        )

      commandLog(
        `change type of an attribute old pred:${oldPred} old obj:${oldObj}. effected attributes: [${effectedAttributes
          .map(
            (a) =>
              `{id: ${a.id}, subj: ${a.subj}, pred: ${a.pred}, obj: ${a.obj}}`
          )
          .join(',')}]`
      )
    })
  }
}
