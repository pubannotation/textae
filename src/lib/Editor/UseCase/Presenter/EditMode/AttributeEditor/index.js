import alertifyjs from 'alertifyjs'
import createNumericAttributeOrShowEditNumericAttributeDialog from './createNumericAttributeOrShowEditNumericAttributeDialog'
import createStringAttributeOrShowEditStringAttributeDialog from './createStringAttributeOrShowEditStringAttributeDialog'

export default class AttributeEditor {
  constructor(
    commander,
    annotationModel,
    selectionModelItems,
    selectionAttributePallet,
    editProperties,
    typeValuesPallet
  ) {
    this._commander = commander
    this._annotationModel = annotationModel
    this._selectionModelItems = selectionModelItems
    this._selectionAttributePallet = selectionAttributePallet
    this._typeDefinition = annotationModel.typeDefinition
    this._editProperties = editProperties
    this._typeValuesPallet = typeValuesPallet
  }

  addOrEditAt(number) {
    this._selectionAttributePallet.hide()

    const attrDef = this._typeDefinition.attribute.getAttributeAt(number)

    if (!attrDef) {
      alertifyjs.warning(`Attribute No.${number} is not defined`)
      return
    }

    switch (attrDef.valueType) {
      case 'flag':
        this._commander.invoke(
          this._commander.factory.toggleFlagAttributeToItemsCommand(
            this._selectionModelItems.all,
            attrDef
          )
        )
        break
      case 'numeric':
        createNumericAttributeOrShowEditNumericAttributeDialog(
          this._selectionModelItems,
          attrDef,
          this._commander,
          this._editProperties,
          this._typeValuesPallet
        )
        break
      case 'selection':
        {
          if (this._selectionModelItems.selectedWithAttributeOf(attrDef.pred)) {
            this._selectionAttributePallet.show(attrDef).then((newObj) => {
              if (
                this._selectionModelItems.isDupulicatedPredAttrributeSelected(
                  attrDef.pred
                )
              ) {
                alertifyjs.warning(
                  'An item among the selected has this attribute multiple times.'
                )
              } else {
                const command =
                  this._commander.factory.changeAttributeObjOfItemsCommand(
                    this._selectionModelItems.all,
                    attrDef,
                    newObj
                  )
                this._commander.invoke(command)
              }
            })
          } else {
            const command =
              this._commander.factory.createAttributeToItemsCommand(
                this._selectionModelItems.all,
                attrDef
              )
            this._commander.invoke(command)
          }
        }
        break
      case 'string':
        createStringAttributeOrShowEditStringAttributeDialog(
          this._selectionModelItems,
          attrDef,
          this._commander,
          this._editProperties,
          this._typeValuesPallet
        )
        break
      default:
        throw `${attrDef.valueType} is unknown attribute`
    }
  }

  deleteAt(number) {
    const attrDef = this._typeDefinition.attribute.getAttributeAt(number)

    if (!attrDef) {
      alertifyjs.warning(`Attribute No.${number} is not defined`)
      return
    }

    if (this._selectionModelItems.selectedWithAttributeOf(attrDef.pred)) {
      const command =
        this._commander.factory.removeAttributesFromItemsByPredCommand(
          this._selectionModelItems.all,
          attrDef
        )
      this._commander.invoke(command)
    } else {
      alertifyjs.warning('None of the selected items has this attribute.')
    }
  }
}
