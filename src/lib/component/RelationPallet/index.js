import { diff } from 'jsondiffpatch'
import Pallet from '../Pallet'
import template from './template'

export default class RelationPallet extends Pallet {
  constructor(editor, originalData, typeDefinition) {
    super(editor, 'relation', 'Relation configuration')

    this._originalData = originalData
    this._typeDefinition = typeDefinition
    this._typeContainer = typeDefinition.relation
  }

  get _content() {
    const hasDiff = diff(this._originalData.configuration, {
      ...this._originalData.configuration,
      ...this._typeDefinition.config
    })

    return template({
      isLock: this._typeContainer.isLock,
      hasDiff,
      types: this._typeContainer.pallet
    })
  }
}
