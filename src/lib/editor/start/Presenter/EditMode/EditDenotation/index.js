import EditHandler from './EditHandler'
import MouseEventHandler from './MouseEventHandler'
import SpanEditor from './SpanEditor'
import Edit from '../Edit'
import bindMouseEvents from './bindMouseEvents'
import EditAttribute from '../EditAttribute'
import EntityAndAttributePallet from '../../../../../component/EntityAndAttributePallet'

export default class EditDenotation extends Edit {
  constructor(
    editor,
    annotationData,
    selectionModel,
    commander,
    buttonController,
    typeDefinition,
    spanConfig,
    originalData,
    autocompletionWs
  ) {
    const spanEditor = new SpanEditor(
      editor,
      annotationData,
      selectionModel,
      commander,
      buttonController,
      spanConfig
    )
    const denotationPallet = new EntityAndAttributePallet(
      editor,
      originalData,
      typeDefinition,
      typeDefinition.denotation,
      selectionModel.entity
    )
    const editAttribute = new EditAttribute(
      commander,
      editor,
      annotationData,
      selectionModel,
      denotationPallet
    )

    const handler = new EditHandler(
      editor,
      typeDefinition,
      commander,
      annotationData,
      selectionModel,
      editAttribute
    )

    super(
      editor,
      bindMouseEvents,
      new MouseEventHandler(
        editor,
        annotationData,
        selectionModel,
        denotationPallet,
        spanEditor
      ),
      handler,
      denotationPallet,
      commander,
      () => autocompletionWs || typeDefinition.autocompletionWs,
      typeDefinition.denotation
    )

    editor.eventEmitter
      .on(`textae.typeDefinition.denotation.type.change`, () =>
        denotationPallet.updateDisplay()
      )
      .on(`textae.typeDefinition.denotation.type.default.change`, () =>
        denotationPallet.updateDisplay()
      )
  }
}
