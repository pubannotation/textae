import alertifyjs from 'alertifyjs'
import createNumericAttributeOrShowEditNumericAttributeDialog from './createNumericAttributeOrShowEditNumericAttributeDialog'
import createStringAttributeOrShowEditStringAttributeDialog from './createStringAttributeOrShowEditStringAttributeDialog'

export default class AttributeEditor {
  constructor(commander, annotationData, selectionModelItems, pallet) {
    this._commander = commander
    this._annotationData = annotationData
    this._selectionModelItems = selectionModelItems
    this._pallet = pallet
    this._typeDefinition = annotationData.typeDefinition
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
            this._selectionModelItems.all,
            attrDef
          )
        )
        break
      case 'numeric':
        createNumericAttributeOrShowEditNumericAttributeDialog(
          this._selectionModelItems,
          attrDef,
          this._commander
        )
        break
      case 'selection':
        {
          if (
            this._selectionModelItems.findSelectedAttributeWithSamePredicate(
              attrDef.pred
            )
          ) {
            this._pallet.show(attrDef).then((newObj) => {
              if (
                this._selectionModelItems.selectedWithAttributeOf(attrDef.pred)
              ) {
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
                    this._commander.factory.changeAttributesOfItemsCommand(
                      this._selectionModelItems.all,
                      attrDef,
                      newObj
                    )
                  this._commander.invoke(command)
                }
              } else {
                const command =
                  this._commander.factory.createAttributeToItemsCommand(
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
          this._commander
        )
        break
      default:
        throw `${attrDef.valueType} is unknown attribute`
    }
  }

  deleteAt(number) {
    const attrDef = this._typeDefinition.attribute.getAttributeAt(number)

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
