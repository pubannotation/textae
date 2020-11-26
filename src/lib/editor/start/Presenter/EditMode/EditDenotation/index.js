import EditHandler from './EditHandler'
import MouseEventHandler from './MouseEventHandler'
import SpanEditor from './SpanEditor'
import Edit from '../Edit'
import bindMouseEvents from './bindMouseEvents'
import AttributeEditor from '../AttributeEditor'
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
    const attributeEditor = new AttributeEditor(
      commander,
      editor,
      annotationData,
      selectionModel,
      denotationPallet,
      typeDefinition
    )

    const handler = new EditHandler(
      editor,
      typeDefinition.denotation,
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
