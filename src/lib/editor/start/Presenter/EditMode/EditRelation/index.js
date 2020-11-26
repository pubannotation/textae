import EditHandler from './EditHandler'
import bindMouseEvents from './bindMouseEvents'
import MouseEventHandler from './MouseEventHandler'
import Edit from '../Edit'
import RelationPallet from '../../../../../component/RelationPallet'

export default class EditRelation extends Edit {
  constructor(
    editor,
    annotationData,
    selectionModel,
    commander,
    typeDefinition,
    originalData,
    autocompletionWs
  ) {
    const relationPallet = new RelationPallet(
      editor,
      originalData,
      typeDefinition
    )

    const handler = new EditHandler(
      typeDefinition,
      commander,
      annotationData,
      selectionModel
    )

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
      handler,
      relationPallet,
      commander,
      'relation',
      () => autocompletionWs || typeDefinition.autocompletionWs,
      typeDefinition.relation
    )
  }
}
