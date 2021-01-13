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
    originalData,
    autocompletionWs
  ) {
    const blockPallet = new EntityAndAttributePallet(
      editor,
      originalData,
      annotationData,
      annotationData.typeDefinition.block,
      selectionModel.entity
    )

    const attributeEditor = new AttributeEditor(
      commander,
      annotationData,
      selectionModel,
      blockPallet,
      annotationData.typeDefinition
    )
    blockPallet.onSelectionAttributeLabelClick((attrDef, value) =>
      attributeEditor.selectionAttributeLabelClick(attrDef, value)
    )

    const handler = new EditHandler(
      editor,
      annotationData.typeDefinition.block,
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
      () => autocompletionWs || annotationData.typeDefinition.autocompletionWs,
      annotationData.typeDefinition.block
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
