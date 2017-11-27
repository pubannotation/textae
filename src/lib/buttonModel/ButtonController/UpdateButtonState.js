export default function(selectionModel, buttonEnableStates, clipBoard) {
  // Short cut name
  const hasCopy = () => clipBoard.clipBoard.length > 0,
    eOrR = () => selectionModel.entity.some() || selectionModel.relation.some()

  // Check all associated anntation elements.
  // For exapmle, it should be that buttons associate with entitis is enable,
  // when deselect the span after select a span and an entity.
  const predicates = new Map(
    [
      ['replicate', () => Boolean(selectionModel.span.single())],
      ['entity', () => selectionModel.span.some()],
      ['delete', () => selectionModel.some()], // It works well on relation-edit-mode if relations are deselect brefore an entity is select.
      ['copy', () => selectionModel.span.some() || selectionModel.entity.some()],
      ['paste', () => hasCopy() && selectionModel.span.some()],
      ['change-label', eOrR],
      ['negation', eOrR],
      ['speculation', eOrR]
    ]
  )

  return function(buttons) {
    for (let buttonName of buttons) {
      const predicate = predicates.get(buttonName)
      buttonEnableStates.set(buttonName, predicate())
    }
  }
}
