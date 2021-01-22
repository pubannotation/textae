import toShrotcutKey from '../../../toShrotcutKey'

export default function ({ pred }, index, array, selectedPred) {
  // Moving an attribute to before or after the current position does not change the position.
  const droppable =
    pred !== selectedPred && index > 1 && array[index - 1].pred !== selectedPred

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
      ${toShrotcutKey(index)}${pred}
    </p>
  `
}
