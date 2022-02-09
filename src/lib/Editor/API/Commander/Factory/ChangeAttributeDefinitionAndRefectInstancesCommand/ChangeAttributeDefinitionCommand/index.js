import ConfigurationCommand from '../../ConfigurationCommand'
import commandLog from '../../commandLog'
import applyChangedProperties from './applyChangedProperties'

export default class ChangeAttributeDefinitionCommand extends ConfigurationCommand {
  /**
   *
   * @param {import('../../../../../AttributeDefinitionContainer').default} definitionContainer
   */
  constructor(definitionContainer, attrDef, changedProperties) {
    super()
    this._definitionContainer = definitionContainer
    this._attrDef = attrDef
    this._changedProperties = changedProperties
  }

  execute() {
    const oldPred = this._attrDef.pred
    const [newAttrDef, revertChangedProperties] = applyChangedProperties(
      this._attrDef,
      this._changedProperties
    )

    this._revertAttrDef = this._definitionContainer.update(oldPred, newAttrDef)
    this._revertChangedProperties = revertChangedProperties

    commandLog(
      this,
      `change old pred:${oldPred} to new attridute definition:${JSON.stringify(
        newAttrDef
      )}`
    )
  }

  revert() {
    return new ChangeAttributeDefinitionCommand(
      this._definitionContainer,
      this._revertAttrDef,
      this._revertChangedProperties
    )
  }
}
