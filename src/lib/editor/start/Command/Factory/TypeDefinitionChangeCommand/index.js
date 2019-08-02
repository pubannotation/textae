import BaseCommand from '../BaseCommand'
import commandLog from '../commandLog'
import populate from './populate'

export default class TypeDefinitionChangeCommand extends BaseCommand {
  constructor(typeDefinition, oldType, changeValues, revertDefaultTypeId) {
    super()
    this.typeDefinition = typeDefinition
    this.oldType = oldType
    this.changeValues = changeValues
    this.revertDefaultTypeId = revertDefaultTypeId
  }

  execute() {
    const { newType, revertChangeValues } = populate(
      this.changeValues,
      this.oldType
    )
    this.newType = newType
    this.revertChangeValues = revertChangeValues
    this.typeDefinition.changeDefinedType(this.oldType.id, this.newType)

    // manage default type
    if (this.newType.default) {
      // remember the current default, because revert command will not understand what type was it.
      this.revertDefaultTypeId = this.typeDefinition.getDefaultType()
      this.typeDefinition.setDefaultType(this.newType.id)
    } else if (this.revertDefaultTypeId) {
      this.typeDefinition.setDefaultType(this.revertDefaultTypeId)
      this.revertDefaultTypeId = 'undefined'
    }
    commandLog(
      `change old type:${JSON.stringify(
        this.oldType
      )} to new type:${JSON.stringify(
        this.newType
      )}, default is \`${this.typeDefinition.getDefaultType()}\``
    )
  }

  revert() {
    return new TypeDefinitionChangeCommand(
      this.typeDefinition,
      this.newType,
      this.revertChangeValues,
      this.revertDefaultTypeId
    )
  }
}
