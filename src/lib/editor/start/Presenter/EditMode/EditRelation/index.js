import EditRelationHandler from './EditRelationHandler'
import bindMouseEvents from './bindMouseEvents'
import MouseEventHandler from './MouseEventHandler'
import Edit from '../Edit'
import EntityAndAttributePallet from '../../../../../component/EntityAndAttributePallet'
import AttributeEditor from '../AttributeEditor'

export default class EditRelation extends Edit {
  constructor(
    editor,
    annotationData,
    selectionModel,
    commander,
    originalData,
    autocompletionWs
  ) {
    const relationPallet = new EntityAndAttributePallet(
      editor,
      originalData,
      annotationData,
      annotationData.typeDefinition.relation,
      selectionModel.relation,
      commander,
      'Relation configuration'
    )

    const attributeEditor = new AttributeEditor(
      commander,
      annotationData,
      selectionModel.relation,
      relationPallet,
      annotationData.typeDefinition
    )

    const handler = new EditRelationHandler(
      editor,
      annotationData.typeDefinition.relation,
      commander,
      annotationData,
      selectionModel,
      attributeEditor
    )

    super(
      editor,
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
      () => autocompletionWs || annotationData.typeDefinition.autocompletionWs,
      annotationData.typeDefinition.relation
    )
  }
}
