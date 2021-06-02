import SelectedElements from './SelectedElements'

export default class SelectedElementsWithAttributes extends SelectedElements {
  selectedWithAttributeOf(pred) {
    return this.all.some((entity) =>
      entity.attributes.some((attribute) => attribute.pred === pred)
    )
  }

  onlySelectedWithJustOneAttributeOf(pred) {
    return this.all.every(
      (entity) =>
        entity.attributes.filter((attribute) => attribute.pred === pred)
          .length === 1
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

  findSelectedWithSamePredicateAttribute(pred) {
    return this.all.find((entity) =>
      entity.attributes.find((attribute) => attribute.pred === pred)
    )
  }

  findSelectedAttributeWithSamePredicate(pred) {
    const selectedEntityWithSamePred =
      this.findSelectedWithSamePredicateAttribute(pred)

    if (selectedEntityWithSamePred) {
      return selectedEntityWithSamePred.attributes.find((a) => a.pred === pred)
    }
  }
}
