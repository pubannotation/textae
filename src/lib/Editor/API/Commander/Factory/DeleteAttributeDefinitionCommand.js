import commandLog from './commandLog'
import CreateAttributeDefinitionCommand from './CreateAttributeDefinitionCommand'
import ConfigurationCommand from './ConfigurationCommand'

export default class DeleteAttributeDefinitionCommand extends ConfigurationCommand {
  constructor(definitionContainer, attrDef) {
    super()
    this._definitionContainer = definitionContainer
    this._removeAttrdef = attrDef
    this._index = definitionContainer.getIndexOf(attrDef.pred)
  }

  execute() {
    this._definitionContainer.delete(this._removeAttrdef.pred)

    commandLog(
      this,
      `remove an attrribute definition:${JSON.stringify(
        this._removeAttrdef
      )}, index:${this._index}`
    )
  }

  revert() {
    return new CreateAttributeDefinitionCommand(
      this._definitionContainer,
      this._removeAttrdef,
      this._index
    )
  }
}
