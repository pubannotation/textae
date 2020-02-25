import commandLog from './commandLog'
import DeleteAttributeDefinitionCommand from './DeleteAttributeDefinitionCommand'
import ConfigurationCommand from './ConfigurationCommand'

export default class extends ConfigurationCommand {
  constructor(typeContainer, attrDef, index) {
    super()
    this.typeContainer = typeContainer
    this.newAttrDef = attrDef
    this.index = index
  }

  execute() {
    // Added default properties to newly created numeric attribute.
    if (this.newAttrDef['value type'] === 'numeric') {
      this.newAttrDef.min = this.newAttrDef.min || 0
      this.newAttrDef.max = this.newAttrDef.max || 0
      this.newAttrDef.step = this.newAttrDef.step || 0
      this.newAttrDef.default = this.newAttrDef.default || 0
    }

    // Added default value to newly created selection attribute definition.
    // Except when undoing the deletion of selection attribute definition.
    if (
      this.newAttrDef['value type'] === 'selection' &&
      !this.newAttrDef.values
    ) {
      this.newAttrDef.values = [
        {
          id: 'default',
          default: true
        }
      ]
    }

    this.typeContainer.createAttribute(this.newAttrDef, this.index)

    commandLog(
      `create a new attrribute definition:${JSON.stringify(
        this.newAttrDef
      )}, index: ${this.index}`
    )
  }

  revert() {
    return new DeleteAttributeDefinitionCommand(
      this.typeContainer,
      this.newAttrDef
    )
  }
}
