import commandLog from './commandLog'
import CreateAttributeDefinitionCommand from './CreateAttributeDefinitionCommand'
import ConfigurationCommand from './ConfigurationCommand'

export default class extends ConfigurationCommand {
  constructor(typeContainer, attrDef) {
    super()
    this.typeContainer = typeContainer
    this.removeAttrdef = attrDef
    this.index = typeContainer.getIndexOfAttribute(attrDef.pred)
  }

  execute() {
    this.typeContainer.deleteAttribute(this.removeAttrdef.pred)

    commandLog(
      `remove an attrribute definition:${JSON.stringify(
        this.removeAttrdef
      )}, index:${this.index}`
    )
  }

  revert() {
    return new CreateAttributeDefinitionCommand(
      this.typeContainer,
      this.removeAttrdef.JSON,
      this.index
    )
  }
}
