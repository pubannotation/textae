import EditHandler from './EditHandler'
import bindMouseEvents from './bindMouseEvents'
import MouseEventHandler from './MouseEventHandler'
import Edit from '../Edit'

export default class EditRelation extends Edit {
  constructor(
    editor,
    annotationData,
    selectionModel,
    commander,
    typeDefinition,
    relationPallet
  ) {
    super(
      editor,
      bindMouseEvents,
      new MouseEventHandler(
        editor,
        selectionModel,
        commander,
        typeDefinition,
        relationPallet
      ),
      new EditHandler(typeDefinition, commander, annotationData, selectionModel)
    )
  }
}
