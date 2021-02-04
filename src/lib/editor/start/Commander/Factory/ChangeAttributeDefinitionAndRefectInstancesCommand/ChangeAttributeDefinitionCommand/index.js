import ConfigurationCommand from '../../ConfigurationCommand'
import commandLog from '../../commandLog'
import applyChangedProperties from './applyChangedProperties'

export default class ChangeAttributeDefinitionCommand extends ConfigurationCommand {
  constructor(typeContainer, attrDef, changedProperties) {
    super()
    this._typeContainer = typeContainer
    this._attrDef = attrDef
    this._changedProperties = changedProperties
  }

  execute() {
    const oldPred = this._attrDef.pred
    const [newAttrDef, revertChangedProperties] = applyChangedProperties(
      this._attrDef,
      this._changedProperties
    )

    this._revertAttrDef = this._typeContainer.update(oldPred, newAttrDef)
    this._revertChangedProperties = revertChangedProperties

    commandLog(
      `change old pred:${oldPred} to new attridute definition:${JSON.stringify(
        newAttrDef
      )}`
    )
  }

  revert() {
    return new ChangeAttributeDefinitionCommand(
      this._typeContainer,
      this._revertAttrDef,
      this._revertChangedProperties
    )
  }
}
