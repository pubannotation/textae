import { diff } from 'jsondiffpatch'
import Pallet from '../Pallet'
import createPalletElement from '../Pallet/createPalletElement'
import createContentHtml from './createContentHtml'

export default class extends Pallet {
  constructor(editor, originalData, typeDefinition) {
    super(editor, createPalletElement('relation'))

    this._originalData = originalData
    this._typeDefinition = typeDefinition
    this._typeContainer = typeDefinition.relation
  }

  get _content() {
    return createContentHtml(
      this._typeContainer,
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
