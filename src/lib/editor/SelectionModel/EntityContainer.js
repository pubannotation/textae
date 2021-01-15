import SelectedElements from './SelectedElements'

export default class EntityContainer extends SelectedElements {
  selectedWithAttributeOf(pred) {
    return this.all.some((entity) =>
      entity.attributes.some((attribute) => attribute.pred === pred)
    )
  }

  selectedWithoutAttributeOf(pred) {
    return this.all.some(
      (entity) =>
        !entity.attributes.some((attribute) => attribute.pred === pred)
    )
  }

  isDupulicatedPredAttrributeSelected(pred) {
    return this.all.some(
      (entity) =>
        entity.attributes.filter((attribute) => attribute.pred === pred)
          .length > 1
    )
  }

  findSelectedWithSamePredicateAttribute(attrDef) {
    return this.all.find((entity) =>
      entity.attributes.find((attribute) => attribute.pred === attrDef.pred)
    )
  }
}
