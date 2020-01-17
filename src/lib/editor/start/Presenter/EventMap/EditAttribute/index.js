import FlagAttributeDefinition from '../../../../Model/TypeDefinition/createAttributeDefinition/FlagAttributeDefinition'
import SelectionAttributePallet from '../../../../../component/SelectionAttributePallet'
import SelectionAttributeDefinition from '../../../../Model/TypeDefinition/createAttributeDefinition/SelectionAttributeDefinition'
import toggleFlagAttribute from './toggleFlagAttribute'
import createSelectionAttributeOrShowSelectionAttributePallet from './createSelectionAttributeOrShowSelectionAttributePallet'

export default class {
  constructor(commander, editor, annotationData, selectionModel) {
    this._commander = commander
    this._annotationData = annotationData
    this._selectionModel = selectionModel
    this._pallet = new SelectionAttributePallet(editor)
    editor[0].appendChild(this._pallet.el)

    editor.eventEmitter
      .on(
        'textae.selecionAttributePallet.item.label.click',
        (attrDef, newObj) => {
          const command = commander.factory.changeAttributesOfSelectedEntitiesWithSamePred(
            attrDef,
            newObj
          )
          commander.invoke(command)
        }
      )
      .on('textae.selecionAttributePallet.remove-button.click', (attrDef) => {
        const command = commander.factory.attributeRemoveByPredCommand(attrDef)
        commander.invoke(command)
      })
      .on('textae.editor.body.click', () => this._pallet.hide())
  }

  handle(typeDefinition, number, options) {
    this._pallet.hide()

    const attrDef = typeDefinition.entity.getAttributeAt(number)

    if (attrDef instanceof FlagAttributeDefinition) {
      toggleFlagAttribute(attrDef, this._commander)
      return
    }

    if (attrDef instanceof SelectionAttributeDefinition) {
      createSelectionAttributeOrShowSelectionAttributePallet(
        this._selectionModel,
        attrDef,
        this._commander,
        this._pallet,
        options.point
      )
      return
    }

    const command = this._commander.factory.createUnknownAttributeToSelectedEntitiesCommand(
      attrDef
    )
    this._commander.invoke(command)
  }
}
