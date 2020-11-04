// Set selectedPred and droppable property.
export default function (typeContainer, selectedPred) {
  const attributes = []
  // Moving an attribute to before or after the current position does not change the position.
  let isPrevSelected
  for (const a of typeContainer.attributes) {
    attributes.push({
      pred: a.pred,
      selectedPred: selectedPred === a.pred,
      droppable: selectedPred !== a.pred && !isPrevSelected
    })
    isPrevSelected = selectedPred === a.pred
  }
  return attributes
}
