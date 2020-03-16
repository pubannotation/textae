import alertifyjs from 'alertifyjs'
import FlagAttributeDefinition from '../../../../../Model/TypeDefinition/createAttributeDefinition/FlagAttributeDefinition'
import NumericAttributeDefinition from '../../../../../Model/TypeDefinition/createAttributeDefinition/NumericAttributeDefinition'
import SelectionAttributeDefinition from '../../../../../Model/TypeDefinition/createAttributeDefinition/SelectionAttributeDefinition'
import StringAttributeDefinition from '../../../../../Model/TypeDefinition/createAttributeDefinition/StringAttributeDefinition'
import toggleFlagAttribute from './toggleFlagAttribute'
import createNumericAttributeOrShowEditNumericAttributeDialog from './createNumericAttributeOrShowEditNumericAttributeDialog'
import createSelectionAttributeOrShowSelectionAttributePallet from './createSelectionAttributeOrShowSelectionAttributePallet'
import createStringAttributeOrShowEditStringAttributeDialog from './createStringAttributeOrShowEditStringAttributeDialog'

export default class {
  constructor(commander, editor, annotationData, selectionModel, entityPallet) {
    this._commander = commander
    this._annotationData = annotationData
    this._selectionModel = selectionModel
    this._pallet = entityPallet
    editor[0].appendChild(this._pallet.el)

    editor.eventEmitter
      .on(
        'textae.entityPallet.attribute.selection-attribute-label.click',
        (attrDef, newObj) => {
          if (
            selectionModel.entity.isSamePredAttrributeSelected(attrDef.pred)
          ) {
            const command = commander.factory.changeAttributesOfSelectedEntitiesWithSamePred(
              'entity',
              attrDef,
              newObj
            )
            commander.invoke(command)
          } else {
            const command = commander.factory.createAttributeToSelectedEntitiesCommand(
              attrDef,
              newObj
            )
            commander.invoke(command)
          }
        }
      )
      .on('textae.selecionAttributePallet.remove-button.click', (attrDef) => {
        const command = commander.factory.removeAttributesOfSelectedEntitiesByPredCommand(
          attrDef
        )
        commander.invoke(command)
      })
      .on('textae.editor.body.click', () => this._pallet.hide())
  }

  handle(typeDefinition, number) {
    this._pallet.hide()

    const attrDef = typeDefinition.entity.getAttributeAt(number)

    if (!attrDef) {
      alertifyjs.warning(`Attribute No.${number} is not defined`)
      return
    }

    if (attrDef instanceof FlagAttributeDefinition) {
      toggleFlagAttribute(attrDef, this._commander)
      return
    }

    if (attrDef instanceof NumericAttributeDefinition) {
      createNumericAttributeOrShowEditNumericAttributeDialog(
        this._selectionModel,
        attrDef,
        this._commander
      )
      return
    }

    if (attrDef instanceof SelectionAttributeDefinition) {
      createSelectionAttributeOrShowSelectionAttributePallet(
        this._selectionModel,
        attrDef,
        this._commander,
        this._pallet
      )
      return
    }

    if (attrDef instanceof StringAttributeDefinition) {
      createStringAttributeOrShowEditStringAttributeDialog(
        this._selectionModel,
        attrDef,
        this._commander
      )
      return
    }
  }
}
