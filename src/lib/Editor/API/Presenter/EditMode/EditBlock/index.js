import SpanEditor from './SpanEditor'
import bindMouseEvents from './bindMouseEvents'
import MouseEventHandler from './MouseEventHandler'
import Edit from '../Edit'
import EditBlockHandler from './EditBlockHandler'
import TypeValuesPallet from '../../../../../component/TypeValuesPallet'
import isRangeInTextBox from '../isRangeInTextBox'
import OrderedPositions from '../OrderedPositions'
import SelectionWrapper from '../SelectionWrapper'
import AttributeEditor from '../DefaultHandler/AttributeEditor'
import SelectionAttributePallet from '../../../../../component/SelectionAttributePallet'

export default class EditBlock extends Edit {
  constructor(
    editorHTMLElement,
    eventEmitter,
    annotationData,
    selectionModel,
    spanConfig,
    commander,
    buttonController,
    autocompletionWs
  ) {
    const spanEditor = new SpanEditor(
      editorHTMLElement,
      annotationData,
      spanConfig,
      commander,
      buttonController,
      selectionModel
    )

    const blockPallet = new TypeValuesPallet(
      editorHTMLElement,
      eventEmitter,
      annotationData.typeDefinition,
      annotationData.attribute,
      annotationData.typeDefinition.block,
      selectionModel.entity,
      commander,
      'Entity configuration',
      buttonController
    )

    const getAutocompletionWs = () =>
      autocompletionWs || annotationData.typeDefinition.autocompletionWs

    const handler = new EditBlockHandler(
      editorHTMLElement,
      annotationData.typeDefinition.block,
      commander,
      annotationData,
      selectionModel,
      blockPallet,
      getAutocompletionWs
    )

    super(
      editorHTMLElement,
      bindMouseEvents,
      new MouseEventHandler(
        editorHTMLElement,
        annotationData,
        selectionModel,
        spanEditor,
        blockPallet
      ),
      handler,
      blockPallet,
      commander,
      getAutocompletionWs,
      annotationData.typeDefinition.block
    )

    this._spanEdtior = spanEditor
    this._buttonController = buttonController
    this._textBox = editorHTMLElement.querySelector('.textae-editor__text-box')
    this._spanModelContainer = annotationData.span

    this._attributeEditor = new AttributeEditor(
      commander,
      annotationData,
      selectionModel.entity,
      new SelectionAttributePallet(editorHTMLElement),
      () => this.editTypeValues(),
      blockPallet
    )
  }

  createSpan() {
    this._spanEdtior.cerateSpanForTouchDevice()
  }

  expandSpan() {
    this._spanEdtior.expandForTouchDevice()
  }

  shrinkSpan() {
    this._spanEdtior.shrinkForTouchDevice()
  }

  applyTextSelection() {
    if (isRangeInTextBox(window.getSelection(), this._textBox)) {
      const selectionWrapper = new SelectionWrapper(this._spanModelContainer)
      const { begin, end } = new OrderedPositions(
        selectionWrapper.positionsOnAnnotation
      )
      const isSelectionTextCrossingAnySpan =
        this._spanModelContainer.isBoundaryCrossingWithOtherSpans(begin, end)

      this._buttonController.updateManipulateSpanButtons(
        selectionWrapper.isParentOfBothNodesTextBox,
        isSelectionTextCrossingAnySpan,
        isSelectionTextCrossingAnySpan
      )
    } else {
      this._buttonController.updateManipulateSpanButtons(false, false, false)
    }
  }
}
