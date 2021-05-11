import SelectedElements from './SelectedElements'

export default class EntityContainer extends SelectedElements {
  selectedWithAttributeOf(pred) {
    return this.all.some((entity) =>
      entity.typeValues.attributes.some((attribute) => attribute.pred === pred)
    )
  }

  onlySelectedWithJustOneAttributeOf(pred) {
    return this.all.every(
      (entity) =>
        entity.typeValues.attributes.filter(
          (attribute) => attribute.pred === pred
        ).length === 1
    )
  }

  selectedWithoutAttributeOf(pred) {
    return this.all.some(
      (entity) =>
        !entity.typeValues.attributes.some(
          (attribute) => attribute.pred === pred
        )
    )
  }

  isDupulicatedPredAttrributeSelected(pred) {
    return this.all.some(
      (entity) =>
        entity.typeValues.attributes.filter(
          (attribute) => attribute.pred === pred
        ).length > 1
    )
  }

  findSelectedWithSamePredicateAttribute(pred) {
    return this.all.find((entity) =>
      entity.typeValues.attributes.find((attribute) => attribute.pred === pred)
    )
  }

  findSelectedAttributeWithSamePredicate(pred) {
    const selectedEntityWithSamePred =
      this.findSelectedWithSamePredicateAttribute(pred)

    if (selectedEntityWithSamePred) {
      return selectedEntityWithSamePred.typeValues.attributes.find(
        (a) => a.pred === pred
      )
    }
  }
}
