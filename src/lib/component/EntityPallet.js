import { diff } from 'jsondiffpatch'
import Pallet from './Pallet'
import createPalletElement from './Pallet/createPalletElement'
import bindUserEvents from './Pallet/bindUserEvents'
import createContentHtml from './Pallet/createContentHtml'

export default class extends Pallet {
  constructor(editor, originalData, typeDefinition) {
    super(editor, createPalletElement('entity'))

    this._originalData = originalData
    this._typeDefinition = typeDefinition
    this._typeContainer = typeDefinition.entity

    // Bind user events to the event emitter.
    bindUserEvents(this)
  }

  get _content() {
    return createContentHtml(
      this._typeContainer,
      'entity',
      diff(
        this._originalData.configuration,
        Object.assign(
          {},
          this._originalData.configuration,
          this._typeDefinition.config
        )
      )
    )
  }
}
