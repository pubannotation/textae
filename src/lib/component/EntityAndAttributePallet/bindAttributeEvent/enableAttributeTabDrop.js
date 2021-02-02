import delegate from 'delegate'

export default function (el, eventEmitter) {
  delegate(el, '.textae-editor__type-pallet__drop-target', 'dragover', (e) => {
    // Display the image after the drop.
    const width = e.target
      .closest('.textae-editor__type-pallet__content')
      .querySelector('.textae-editor__type-pallet__attribute').offsetWidth
    e.target.innerHTML = `<div style="width: ${width}px;"></div>`

    // Enable drop targets to fire drop events.
    e.preventDefault()
  })

  delegate(el, '.textae-editor__type-pallet__drop-target', 'dragleave', (e) => {
    // Hide the image after the drop.
    e.target.innerHTML = ''
  })

  delegate(el, '.textae-editor__type-pallet__drop-target', 'drop', (e) => {
    const oldIndex = parseInt(
      e.dataTransfer.getData('application/x-textae-attribute-tab-old-index')
    )
    const newIndex = parseInt(e.target.dataset.index)

    eventEmitter.emit(
      `textae-event.entityAndAttributePallet.attribute.tab.drop`,
      oldIndex,
      oldIndex < newIndex ? newIndex - 1 : newIndex
    )
  })
}
