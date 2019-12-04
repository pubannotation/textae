import delegate from 'delegate'
import checkButtonEnable from './checkButtonEnable'

export default function(pallet, emitter, name) {
  delegate(pallet, `.textae-editor__type-pallet__add-button`, 'click', () =>
    emitter.emit(`textae.${name}Pallet.add-button.click`)
  )

  delegate(pallet, `.textae-editor__type-pallet__read-button`, 'click', () =>
    emitter.emit(`textae.${name}Pallet.read-button.click`)
  )

  delegate(pallet, '.textae-editor__type-pallet__write-button', 'click', () =>
    emitter.emit(`textae.${name}Pallet.write-button.click`)
  )

  delegate(pallet, '.textae-editor__type-pallet__label', 'click', (e) =>
    emitter.emit(
      `textae.${name}Pallet.item.label.click`,
      e.delegateTarget.dataset.id
    )
  )

  delegate(pallet, '.textae-editor__type-pallet__select-all', 'click', (e) => {
    if (!checkButtonEnable(e.target)) {
      return
    }

    emitter.emit(
      `textae.${name}Pallet.item.select-all-button.click`,
      e.delegateTarget.dataset.id
    )
  })

  delegate(pallet, '.textae-editor__type-pallet__edit-type', 'click', (e) => {
    emitter.emit(
      `textae.${name}Pallet.item.edit-button.click`,
      e.target.dataset.id,
      e.target.dataset.color.toLowerCase(),
      e.target.dataset.isDefault === 'true'
    )
  })

  delegate(pallet, '.textae-editor__type-pallet__remove', 'click', (e) => {
    if (!checkButtonEnable(e.target)) {
      return
    }

    emitter.emit(
      `textae.${name}Pallet.item.remove-button.click`,
      e.delegateTarget.dataset.id,
      e.delegateTarget.dataset.label
    )
  })
}
