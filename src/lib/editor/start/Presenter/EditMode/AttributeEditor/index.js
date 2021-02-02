import alertifyjs from 'alertifyjs'
import createNumericAttributeOrShowEditNumericAttributeDialog from './createNumericAttributeOrShowEditNumericAttributeDialog'
import createStringAttributeOrShowEditStringAttributeDialog from './createStringAttributeOrShowEditStringAttributeDialog'

export default class AttributeEditor {
  constructor(
    commander,
    annotationData,
    selectionModel,
    entityPallet,
    typeDefinition
  ) {
    this._commander = commander
    this._annotationData = annotationData
    this._selectionModel = selectionModel
    this._pallet = entityPallet
    this._typeDefinition = typeDefinition

    entityPallet.onSelectionAttributeLabelClick((attrDef, value) =>
      this._selectionAttributeLabelClick(attrDef, value)
    )
  }

  _selectionAttributeLabelClick(attrDef, newObj) {
    if (this._selectionModel.entity.selectedWithAttributeOf(attrDef.pred)) {
      if (
        this._selectionModel.entity.isDupulicatedPredAttrributeSelected(
          attrDef.pred
        )
      ) {
        alertifyjs.warning(
          'An item among the selected has this attribute multiple times.'
        )
      } else {
        const command = this._commander.factory.changeAttributesOfItemsWithSamePred(
          this._selectionModel.entity.all,
          attrDef,
          newObj
        )
        this._commander.invoke(command)
      }
    } else {
      const command = this._commander.factory.createAttributeToItemsCommand(
        this._selectionModel.entity.all,
        attrDef,
        newObj
      )
      this._commander.invoke(command)
    }
  }

  addOrEditAt(number) {
    this._pallet.hide()

    const attrDef = this._typeDefinition.attribute.getAttributeAt(number)

    if (!attrDef) {
      alertifyjs.warning(`Attribute No.${number} is not defined`)
      return
    }

    switch (attrDef.valueType) {
      case 'flag':
        this._commander.invoke(
          this._commander.factory.toggleFlagAttributeToItemsCommand(
            this._selectionModel.entity.all,
            attrDef
          )
        )
        break
      case 'numeric':
        createNumericAttributeOrShowEditNumericAttributeDialog(
          this._selectionModel,
          attrDef,
          this._commander
        )
        break
      case 'selection':
        {
          if (
            this._selectionModel.entity.findSelectedAttributeWithSamePredicate(
              attrDef.pred
            )
          ) {
            this._pallet.show()
            this._pallet.showAttribute(attrDef.pred)
          } else {
            const command = this._commander.factory.createAttributeToItemsCommand(
              this._selectionModel.entity.all,
              attrDef
            )
            this._commander.invoke(command)
          }
        }
        break
      case 'string':
        createStringAttributeOrShowEditStringAttributeDialog(
          this._selectionModel,
          attrDef,
          this._commander
        )
        break
      default:
        throw `${attrDef.valueType} is unknown attribute`
    }
  }

  deleteAt(number) {
    const attrDef = this._typeDefinition.attribute.getAttributeAt(number)

    if (this._selectionModel.entity.selectedWithAttributeOf(attrDef.pred)) {
      const command = this._commander.factory.removeAttributesFromItemsByPredCommand(
        this._selectionModel.entity.all,
        attrDef
      )
      this._commander.invoke(command)
    } else {
      alertifyjs.warning('None of the selected items has this attribute.')
    }
  }
}
