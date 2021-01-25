import commandLog from './commandLog'
import CreateAttributeDefinitionCommand from './CreateAttributeDefinitionCommand'
import ConfigurationCommand from './ConfigurationCommand'

export default class DeleteAttributeDefinitionCommand extends ConfigurationCommand {
  constructor(typeContainer, attrDef) {
    super()
    this._typeContainer = typeContainer
    this._removeAttrdef = attrDef
    this._index = typeContainer.getIndexOf(attrDef.pred)
  }

  execute() {
    this._typeContainer.delete(this._removeAttrdef.pred)

    commandLog(
      `remove an attrribute definition:${JSON.stringify(
        this._removeAttrdef
      )}, index:${this._index}`
    )
  }

  revert() {
    return new CreateAttributeDefinitionCommand(
      this._typeContainer,
      this._removeAttrdef,
      this._index
    )
  }
}
