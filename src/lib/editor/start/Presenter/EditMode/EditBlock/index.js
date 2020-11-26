import SpanEditor from './SpanEditor'
import bindMouseEvents from './bindMouseEvents'
import MouseEventHandler from './MouseEventHandler'
import Edit from '../Edit'
import EditHandler from './EditHandler'
import EntityAndAttributePallet from '../../../../../component/EntityAndAttributePallet'
import AttributeEditor from '../AttributeEditor'

export default class EditBlock extends Edit {
  constructor(
    editor,
    annotationData,
    selectionModel,
    spanConfig,
    commander,
    buttonController,
    typeDefinition,
    originalData,
    autocompletionWs
  ) {
    const blockPallet = new EntityAndAttributePallet(
      editor,
      originalData,
      typeDefinition,
      typeDefinition.block,
      selectionModel.entity
    )

    const attributeEditor = new AttributeEditor(
      commander,
      editor,
      annotationData,
      selectionModel,
      blockPallet,
      typeDefinition
    )
    const handler = new EditHandler(
      editor,
      typeDefinition.block,
      commander,
      annotationData,
      selectionModel,
      attributeEditor
    )

    const spanEditor = new SpanEditor(
      editor,
      annotationData,
      spanConfig,
      commander,
      buttonController,
      selectionModel
    )

    super(
      editor,
      bindMouseEvents,
      new MouseEventHandler(
        editor,
        annotationData,
        selectionModel,
        spanEditor,
        blockPallet
      ),
      handler,
      blockPallet,
      commander,
      () => autocompletionWs || typeDefinition.autocompletionWs,
      typeDefinition.block
    )

    editor.eventEmitter
      .on(`textae.typeDefinition.block.type.change`, () =>
        blockPallet.updateDisplay()
      )
      .on(`textae.typeDefinition.block.type.default.change`, () =>
        blockPallet.updateDisplay()
      )
  }
}
