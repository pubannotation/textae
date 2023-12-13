import anemone from '../../../anemone'

export default function ({ pred }, index, array, selectedPred) {
  // Moving an attribute to before or after the current position does not change the position.
  const previous = array[index - 1]
  const droppable =
    pred !== selectedPred && (previous ? previous.pred !== selectedPred : true)

  return () => anemone`
    ${
      droppable
        ? () =>
            `<span class="textae-editor__pallet__drop-target" data-index="${index}"></span>`
        : ''
    }
    <p
      class="textae-editor__pallet__attribute${
        pred === selectedPred
          ? ' textae-editor__pallet__attribute--selected'
          : ''
      }"
      data-attribute="${pred}"
      data-index="${index}"
      ${pred === selectedPred ? 'draggable="true"' : ''}>
      ${index < 9 ? `${index + 1}:` : ''}${pred}
    </p>
  `
}
