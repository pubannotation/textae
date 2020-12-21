import { diff } from 'jsondiffpatch'
import Pallet from '../Pallet'
import createPalletElement from '../Pallet/createPalletElement'
import createContentHtml from './createContentHtml'

export default class RelationPallet extends Pallet {
  constructor(editor, originalData, typeDefinition) {
    super(editor, createPalletElement('relation'))

    this._originalData = originalData
    this._typeDefinition = typeDefinition
    this._typeContainer = typeDefinition.relation
  }

  get _content() {
    const hasDiff = diff(
      this._originalData.configuration,
      Object.assign(
        {},
        this._originalData.configuration,
        this._typeDefinition.config
      )
    )

    return createContentHtml({
      isLock: this._typeContainer.isLock,
      hasDiff,
      types: this._typeContainer.pallet
    })
  }
}
