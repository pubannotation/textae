import EditStringAttributeDialog from '../../../../../../component/EditStringAttributeDialog'
import getChangeOrRemoveCommand from './getChangeOrRemoveCommand'

export default function(selectionModel, attrDef, commander) {
  const selectedEntitiesWithSamePred = selectionModel.getSelectedEntitiesWithSamePredicateAttribute(
    attrDef
  )
  if (selectedEntitiesWithSamePred.length > 0) {
    const attribute = selectedEntitiesWithSamePred[0].attributes.find(
      (a) => a.pred === attrDef.pred
    )
    const dialog = new EditStringAttributeDialog(attribute)
    dialog.promise.then(({ newObj }) => {
      commander.invoke(getChangeOrRemoveCommand(newObj, commander, attrDef))
    })
    dialog.open()
  } else {
    const command = commander.factory.createUnknownAttributeToSelectedEntitiesCommand(
      attrDef
    )
    commander.invoke(command)
  }
}
