import SelectedItems from './SelectedItems'

export default class SelectedItemsWithAttributes extends SelectedItems {
  selectedWithAttributeOf(pred) {
    return this.all.some((item) =>
      item.attributes.some((attribute) => attribute.pred === pred)
    )
  }

  onlySelectedWithJustOneAttributeOf(pred) {
    return this.all.every(
      (item) =>
        item.attributes.filter((attribute) => attribute.pred === pred)
          .length === 1
    )
  }

  selectedWithoutAttributeOf(pred) {
    return this.all.some(
      (item) => !item.attributes.some((attribute) => attribute.pred === pred)
    )
  }

  isDupulicatedPredAttrributeSelected(pred) {
    return this.all.some(
      (item) =>
        item.attributes.filter((attribute) => attribute.pred === pred).length >
        1
    )
  }

  findSelectedWithSamePredicateAttribute(pred) {
    return this.all.find((item) =>
      item.attributes.find((attribute) => attribute.pred === pred)
    )
  }

  findSelectedAttributeWithSamePredicate(pred) {
    const itemWithSamePred = this.findSelectedWithSamePredicateAttribute(pred)

    if (itemWithSamePred) {
      return itemWithSamePred.attributes.find((a) => a.pred === pred)
    }
  }
}
