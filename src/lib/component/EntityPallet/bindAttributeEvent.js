import delegate from 'delegate'

export default function(pallet, el, eventEmitter) {
  // Enable drop targets to fire drop events.
  delegate(el, '.textae-editor__type-pallet__drop-target', 'dragover', (e) => {
    const width = document.querySelector(
      '.textae-editor__type-pallet__attribute'
    ).offsetWidth
    e.target.innerHTML = `<div style="width: ${width}px;"></div>`
    e.preventDefault()
  })

  delegate(el, '.textae-editor__type-pallet__drop-target', 'dragleave', (e) => {
    e.target.innerHTML = ''
  })

  delegate(el, '.textae-editor__type-pallet__drop-target', 'drop', (e) => {
    const oldIndex = parseInt(e.dataTransfer.getData('oldIndex'))
    const newIndex = parseInt(e.target.dataset.index)

    eventEmitter.emit(
      `textae.entityPallet.attribute.tab.drop`,
      oldIndex,
      oldIndex < newIndex ? newIndex - 1 : newIndex
    )
  })

  delegate(el, '.textae-editor__type-pallet__create-predicate', 'click', () =>
    eventEmitter.emit(
      `textae.entityPallet.attribute.create-predicate-button.click`
    )
  )

  delegate(el, '.textae-editor__type-pallet__edit-predicate', 'click', () =>
    eventEmitter.emit(
      `textae.entityPallet.attribute.edit-predicate-button.click`,
      pallet.attrDef
    )
  )

  delegate(el, '.textae-editor__type-pallet__delete-predicate', 'click', () =>
    eventEmitter.emit(
      `textae.entityPallet.attribute.delete-predicate-button.click`,
      pallet.attrDef
    )
  )

  delegate(
    el,
    '.textae-editor__type-pallet__add-attribute-value-button',
    'click',
    () =>
      eventEmitter.emit(
        `textae.entityPallet.attribute.add-value-button.click`,
        pallet.attrDef
      )
  )

  delegate(el, '.textae-editor__type-pallet__edit-value', 'click', (e) =>
    eventEmitter.emit(
      `textae.entityPallet.attribute.edit-value-button.click`,
      pallet.attrDef,
      e.target.dataset.index
    )
  )

  delegate(el, '.textae-editor__type-pallet__remove-value', 'click', (e) =>
    eventEmitter.emit(
      `textae.entityPallet.attribute.remove-value-button.click`,
      pallet.attrDef,
      e.target.dataset.index
    )
  )

  delegate(
    el,
    '.textae-editor__type-pallet__selection-attribute-label',
    'click',
    (e) =>
      eventEmitter.emit(
        `textae.entityPallet.attribute.selection-attribute-label.click`,
        pallet.attrDef,
        e.target.dataset.id
      )
  )

  delegate(el, '.textae-editor__type-pallet__add-attribute', 'click', () =>
    eventEmitter.emit(
      `textae.entityPallet.attribute.add-button.click`,
      pallet.attrDef
    )
  )

  delegate(el, '.textae-editor__type-pallet__edit-object', 'click', () =>
    eventEmitter.emit(
      'textae.entityPallet.attribute.object.edit',
      pallet.attrDef
    )
  )

  delegate(el, '.textae-editor__type-pallet__remove-attribute', 'click', () =>
    eventEmitter.emit(
      `textae.entityPallet.attribute.remove-button.click`,
      pallet.attrDef
    )
  )
}
