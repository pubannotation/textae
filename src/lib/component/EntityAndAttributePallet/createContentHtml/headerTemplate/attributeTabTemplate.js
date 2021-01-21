export default function ({ droppable, pred }, index, selectedPred) {
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
