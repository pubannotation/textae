import EditStringAttributeDialog from '../../../../../../component/EditStringAttributeDialog'
import getChangeOrRemoveCommand from './getChangeOrRemoveCommand'

export default function(selectionModel, attrDef, commander) {
  const selectedEntityWithSamePred = selectionModel.findSelectedEntityWithSamePredicateAttribute(
    attrDef
  )
  if (selectedEntityWithSamePred) {
    const attribute = selectedEntityWithSamePred.attributes.find(
      (a) => a.pred === attrDef.pred
    )
    const dialog = new EditStringAttributeDialog(attribute)
    dialog.promise.then(({ newObj }) => {
      commander.invoke(getChangeOrRemoveCommand(newObj, commander, attrDef))
    })
    dialog.open()
  } else {
    const command = commander.factory.createAttributeToSelectedEntitiesCommand(
      attrDef
    )
    commander.invoke(command)
  }
}
