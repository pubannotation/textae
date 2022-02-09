import commandLog from './commandLog'
import DeleteAttributeDefinitionCommand from './DeleteAttributeDefinitionCommand'
import ConfigurationCommand from './ConfigurationCommand'

export default class CreateAttributeDefinitionCommand extends ConfigurationCommand {
  /** @param {import("../../../AttributeDefinitionContainer").default} definitionContainer */
  constructor(definitionContainer, attrDef, index) {
    super()
    this._definitionContainer = definitionContainer
    this._newAttrDef = attrDef
    this._index = index
  }

  execute() {
    // Added default value to newly created selection attribute definition.
    // Except when undoing the deletion of selection attribute definition.
    if (
      this._newAttrDef.valueType === 'selection' &&
      !this._newAttrDef.values
    ) {
      this._newAttrDef.values = [
        {
          id: 'default',
          default: true
        }
      ]
    }

    this._definitionContainer.create(
      this._newAttrDef.valueType,
      this._newAttrDef,
      this._index
    )

    commandLog(
      this,
      `create a new attrribute definition:${JSON.stringify(
        this._newAttrDef
      )}, index: ${this._index}`
    )
  }

  revert() {
    return new DeleteAttributeDefinitionCommand(
      this._definitionContainer,
      this._newAttrDef
    )
  }
}
