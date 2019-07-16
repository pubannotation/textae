export default function(selectionModel, buttonEnableStates, clipBoard) {
  // Short cut name
  const hasCopy = () => clipBoard.clipBoard.length > 0
  const eOrR = () => selectionModel.entity.some() || selectionModel.relation.some()

  // Check all associated anntation elements.
  // For exapmle, it should be that buttons associate with entitis is enable,
  // when deselect the span after select a span and an entity.
  const predicates = createPredicates(selectionModel, hasCopy, eOrR)

  return function(buttons) {
    for (let buttonName of buttons) {
      const predicate = predicates.get(buttonName)
      buttonEnableStates.set(buttonName, predicate())
    }
  }
}

function createPredicates(selectionModel, hasCopy, eOrR) {
  return new Map([
    ['replicate', () => Boolean(selectionModel.span.single())],
    ['entity', () => selectionModel.span.some()],
    ['delete', () => selectionModel.some()],
    ['copy', () => selectionModel.span.some() || selectionModel.entity.some()],
    ['paste', () => hasCopy() && selectionModel.span.some()],
    ['change-label', eOrR],
    ['negation', eOrR],
    ['speculation', eOrR]
  ])
}
