import EditRelationHandler from './EditRelationHandler'
import bindMouseEvents from './bindMouseEvents'
import MouseEventHandler from './MouseEventHandler'
import Edit from '../Edit'

export default class extends Edit {
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
      new EditRelationHandler(
        typeDefinition,
        commander,
        annotationData,
        selectionModel
      )
    )
  }
}
