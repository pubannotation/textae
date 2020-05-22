export default function(el, emitter) {
  for (const dropTarget of el.querySelectorAll(
    '.textae-editor__type-pallet__drop-target'
  )) {
    // Enable drop targets to fire drop events.
    dropTarget.addEventListener('dragover', (e) => {
      e.preventDefault()
    })

    dropTarget.addEventListener('drop', (e) => {
      const oldIndex = parseInt(e.dataTransfer.getData('oldIndex'))
      const newIndex = parseInt(e.target.dataset.index)

      emitter.emit(
        `textae.entityPallet.attribute.tab.drop`,
        oldIndex,
        oldIndex < newIndex ? newIndex - 1 : newIndex
      )
    })
  }
}
