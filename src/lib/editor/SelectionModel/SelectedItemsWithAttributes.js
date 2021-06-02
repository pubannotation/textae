import SelectedItems from './SelectedItems'

export default class SelectedItemsWithAttributes extends SelectedItems {
  selectedWithAttributeOf(pred) {
    return this.all.some((element) =>
      element.attributes.some((attribute) => attribute.pred === pred)
    )
  }

  onlySelectedWithJustOneAttributeOf(pred) {
    return this.all.every(
      (element) =>
        element.attributes.filter((attribute) => attribute.pred === pred)
          .length === 1
    )
  }

  selectedWithoutAttributeOf(pred) {
    return this.all.some(
      (element) =>
        !element.attributes.some((attribute) => attribute.pred === pred)
    )
  }

  isDupulicatedPredAttrributeSelected(pred) {
    return this.all.some(
      (element) =>
        element.attributes.filter((attribute) => attribute.pred === pred)
          .length > 1
    )
  }

  findSelectedWithSamePredicateAttribute(pred) {
    return this.all.find((element) =>
      element.attributes.find((attribute) => attribute.pred === pred)
    )
  }

  findSelectedAttributeWithSamePredicate(pred) {
    const selectedElementWithSamePred =
      this.findSelectedWithSamePredicateAttribute(pred)

    if (selectedElementWithSamePred) {
      return selectedElementWithSamePred.attributes.find((a) => a.pred === pred)
    }
  }
}
