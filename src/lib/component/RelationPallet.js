import { diff } from 'jsondiffpatch'
import Pallet from './Pallet'
import createPalletElement from './Pallet/createPalletElement'
import bindUserEvents from './Pallet/bindUserEvents'
import createContentHtml from './Pallet/createContentHtml'

export default class extends Pallet {
  constructor(editor, originalData, typeDefinition) {
    super(editor, createPalletElement('relation'))

    this._originalData = originalData
    this._typeDefinition = typeDefinition
    this._typeContainer = typeDefinition.relation

    // Bind user events to the event emitter.
    bindUserEvents(this._el, editor.eventEmitter, 'relation')
  }

  get _content() {
    return createContentHtml(
      this._typeContainer,
      'relation',
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
