export default function(model, buttonEnableStates, clipBoard) {
  // Short cut name
  const s = model.selectionModel,
    hasCopy = () => clipBoard.clipBoard.length > 0,
    eOrR = () => s.entity.some() || s.relation.some()

  // Check all associated anntation elements.
  // For exapmle, it should be that buttons associate with entitis is enable,
  // when deselect the span after select a span and an entity.
  const predicates = new Map(
    [
      ['replicate', () => Boolean(s.span.single())],
      ['entity', s.span.some],
      ['delete', s.some], // It works well on relation-edit-mode if relations are deselect brefore an entity is select.
      ['copy', () => s.span.some() || s.entity.some()],
      ['paste', () => hasCopy() && s.span.some()],
      ['pallet', eOrR],
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
