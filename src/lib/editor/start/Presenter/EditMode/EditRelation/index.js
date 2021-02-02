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
    originalData,
    autocompletionWs
  ) {
    const relationPallet = new RelationPallet(
      editor,
      originalData,
      annotationData.typeDefinition
    )

    const handler = new EditHandler(
      annotationData.typeDefinition.relation,
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
        annotationData.typeDefinition,
        relationPallet
      ),
      handler,
      relationPallet,
      commander,
      () => autocompletionWs || annotationData.typeDefinition.autocompletionWs,
      annotationData.typeDefinition.relation
    )

    editor.eventEmitter
      .on(`textae-event.typeDefinition.relation.type.change`, () =>
        relationPallet.updateDisplay()
      )
      .on(`textae-event.typeDefinition.relation.type.default.change`, () =>
        relationPallet.updateDisplay()
      )
  }
}
