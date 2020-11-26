import EditHandler from './EditHandler'
import bindMouseEvents from './bindMouseEvents'
import MouseEventHandler from './MouseEventHandler'
import Edit from '../Edit'
import RelationPallet from '../../../../../component/RelationPallet'
import initPallet from '../initPallet'

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

    initPallet(
      relationPallet,
      editor,
      commander,
      'relation',
      handler,
      () => autocompletionWs || this._typeDefinition.autocompletionWs,
      typeDefinition.relation
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
      relationPallet
    )
  }
}
