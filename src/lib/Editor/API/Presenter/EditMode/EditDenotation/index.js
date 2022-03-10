import MouseEventHandler from './MouseEventHandler'
import SpanEditor from './SpanEditor'
import Edit from '../Edit'
import bindMouseEvents from './bindMouseEvents'
import TypeValuesPallet from '../../../../../component/TypeValuesPallet'
import isRangeInTextBox from '../isRangeInTextBox'
import OrderedPositions from '../OrderedPositions'
import SelectionWrapper from '../SelectionWrapper'
import AttributeEditor from '../DefaultHandler/AttributeEditor'
import SelectionAttributePallet from '../../../../../component/SelectionAttributePallet'
import EditTypeValuesDialog from '../../../../../component/EditTypeValuesDialog'

export default class EditDenotation extends Edit {
  constructor(
    editorHTMLElement,
    eventEmitter,
    annotationData,
    selectionModel,
    commander,
    buttonController,
    spanConfig,
    autocompletionWs
  ) {
    const denotationPallet = new TypeValuesPallet(
      editorHTMLElement,
      eventEmitter,
      annotationData.typeDefinition,
      annotationData.attribute,
      annotationData.typeDefinition.denotation,
      selectionModel.entity,
      commander,
      'Entity configuration',
      buttonController
    )

    const spanEditor = new SpanEditor(
      editorHTMLElement,
      annotationData,
      selectionModel,
      commander,
      buttonController,
      spanConfig
    )

    const getAutocompletionWs = () =>
      autocompletionWs || annotationData.typeDefinition.autocompletionWs

    const mouseEventHandler = new MouseEventHandler(
      editorHTMLElement,
      annotationData,
      selectionModel,
      denotationPallet,
      spanEditor
    )

    super(
      editorHTMLElement,
      bindMouseEvents,
      mouseEventHandler,
      selectionModel,
      annotationData,
      denotationPallet,
      commander,
      getAutocompletionWs,
      annotationData.typeDefinition.denotation,
      'entity'
    )

    this._spanEdtior = spanEditor
    this._mouseEventHandler = mouseEventHandler
    this._buttonController = buttonController
    this._textBox = editorHTMLElement.querySelector('.textae-editor__text-box')
    this._spanModelContainer = annotationData.span

    this._attributeEditor = new AttributeEditor(
      commander,
      annotationData,
      selectionModel.entity,
      new SelectionAttributePallet(editorHTMLElement),
      () => this.editTypeValues(),
      denotationPallet
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
        selectionWrapper.isParentOfBothNodesSame,
        isSelectionTextCrossingAnySpan,
        isSelectionTextCrossingAnySpan
      )
    } else {
      this._buttonController.updateManipulateSpanButtons(false, false, false)
    }
  }

  editTypeValues() {
    if (this._selectionModel.entity.some) {
      new EditTypeValuesDialog(
        this._editorHTMLelement,
        'Entity',
        'Entity',
        this._definitionContainer,
        this._annotationData.typeDefinition.attribute,
        this._getAutocompletionWs(),
        this._selectionModel.entity.all,
        this._typeValuesPallet
      )
        .open()
        .then((values) => this._typeValuesChanged(values))
    }
  }
}
