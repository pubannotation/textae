import EditRelationHandler from './EditRelationHandler'
import bindMouseEvents from './bindMouseEvents'
import MouseEventHandler from './MouseEventHandler'
import Edit from '../Edit'
import TypeValuesPallet from '../../../../../component/TypeValuesPallet'

export default class EditRelation extends Edit {
  constructor(
    editor,
    annotationData,
    selectionModel,
    commander,
    originalData,
    autocompletionWs
  ) {
    const relationPallet = new TypeValuesPallet(
      editor[0],
      editor.eventEmitter,
      originalData,
      annotationData,
      annotationData.typeDefinition.relation,
      selectionModel.relation,
      commander,
      'Relation configuration'
    )

    const getAutocompletionWs = () =>
      autocompletionWs || annotationData.typeDefinition.autocompletionWs

    const handler = new EditRelationHandler(
      editor,
      annotationData.typeDefinition.relation,
      commander,
      annotationData,
      selectionModel,
      relationPallet,
      getAutocompletionWs
    )

    super(
      editor[0],
      bindMouseEvents,
      new MouseEventHandler(
        editor,
        selectionModel,
        commander,
        annotationData.typeDefinition,
        relationPallet
      ),
      handler,
      relationPallet,
      commander,
      getAutocompletionWs,
      annotationData.typeDefinition.relation
    )
  }
}
