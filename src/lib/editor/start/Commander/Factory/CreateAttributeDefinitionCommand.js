import commandLog from './commandLog'
import DeleteAttributeDefinitionCommand from './DeleteAttributeDefinitionCommand'
import ConfigurationCommand from './ConfigurationCommand'

export default class CreateAttributeDefinitionCommand extends ConfigurationCommand {
  constructor(typeContainer, attrDef, index) {
    super()
    this._typeContainer = typeContainer
    this._newAttrDef = attrDef
    this._index = index
  }

  execute() {
    // Added default properties to newly created numeric attribute.
    if (this._newAttrDef.valueType === 'numeric') {
      this._newAttrDef.min = this._newAttrDef.min || 0
      this._newAttrDef.max = this._newAttrDef.max || 0
      this._newAttrDef.step = this._newAttrDef.step || 0
      this._newAttrDef.default = this._newAttrDef.default || 0
    }

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

    this._typeContainer.create(
      this._newAttrDef.valueType,
      this._newAttrDef,
      this._index
    )

    commandLog(
      `create a new attrribute definition:${JSON.stringify(
        this._newAttrDef
      )}, index: ${this._index}`
    )
  }

  revert() {
    return new DeleteAttributeDefinitionCommand(
      this._typeContainer,
      this._newAttrDef
    )
  }
}
