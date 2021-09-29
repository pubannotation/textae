export default function ({ pred }, index, array, selectedPred) {
  // Moving an attribute to before or after the current position does not change the position.
  const droppable =
    pred !== selectedPred &&
    (array[index - 1] ? array[index - 1].pred !== selectedPred : true)

  return `
    ${
      droppable
        ? `<span class="textae-editor__type-pallet__drop-target" data-index="${index}"></span>`
        : ''
    }
    <p 
      class="textae-editor__type-pallet__attribute${
        pred === selectedPred
          ? ' textae-editor__type-pallet__attribute--selected'
          : ''
      }"
      data-attribute="${pred}"
      data-index="${index}"
      ${pred === selectedPred ? 'draggable="true"' : ''}>
      ${index < 9 ? `${index + 1}:` : ''}${pred}
    </p>
  `
}
