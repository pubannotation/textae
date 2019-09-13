import findAttribute from './findAttribute'
import CompositeCommand from './CompositeCommand'
import AttributeChangeCommand from './AttributeChangeCommand'
import withOutSamePredicateAttribute from './withOutSamePredicateAttribute'

export default class extends CompositeCommand {
  constructor(
    annotationData,
    selectedEntities,
    oldPred,
    oldObj,
    newPred,
    newObj
  ) {
    super()

    // Has no effect unless changed
    if (oldPred === newPred && oldObj === newObj) {
      return
    }

    // Update models
    const effectedAttributes = []
    for (const id of selectedEntities) {
      const attribute = findAttribute(annotationData, id, oldPred, oldObj)

      // If you select an entity with attributes and an entity without attributes,
      // the attributes may not be found.
      if (attribute) {
        // An entity cannot have more than one attribute with the same predicate.
        if (withOutSamePredicateAttribute(annotationData, id, newPred)) {
          effectedAttributes.push(
            new AttributeChangeCommand(
              annotationData,
              attribute,
              newPred,
              newObj
            )
          )
        }
      }
    }

    this._subCommands = effectedAttributes
    this._logMessage = `set pred ${newPred}, obj ${newObj} to attributes: ${effectedAttributes
      .map(
        ({ attribute }) =>
          `{id: ${attribute.id}, subj: ${attribute.subj}, pred: ${attribute.pred}, obj: ${attribute.obj}}`
      )
      .join(',')}`
  }
}
