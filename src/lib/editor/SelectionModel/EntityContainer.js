import SelectedElements from './SelectedElements'

export default class EntityContainer extends SelectedElements {
  isSamePredAttrributeSelected(pred) {
    return this.all.some((entity) =>
      entity.attributes.find((attribute) => attribute.pred === pred)
    )
  }

  findSelectedWithSamePredicateAttribute(attrDef) {
    return this.all.find((entity) =>
      entity.attributes.find((attribute) => attribute.pred === attrDef.pred)
    )
  }
}
