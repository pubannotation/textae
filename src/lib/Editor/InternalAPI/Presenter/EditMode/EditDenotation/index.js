import MouseEventHandler from './MouseEventHandler'
import SpanEditor from './SpanEditor'
import Edit from '../Edit'
import bindMouseEvents from './bindMouseEvents'
import TypeValuesPallet from '../../../../../component/TypeValuesPallet'
import isRangeInTextBox from '../isRangeInTextBox'
import OrderedPositions from '../OrderedPositions'
import SelectionWrapper from '../SelectionWrapper'
import AttributeEditor from '../AttributeEditor'
import SelectionAttributePallet from '../../../../../component/SelectionAttributePallet'
import EditPropertiesDialog from '../../../../../component/EditPropertiesDialog'

export default class EditDenotation extends Edit {
  constructor(
    editorHTMLElement,
    eventEmitter,
    annotationModel,
    selectionModel,
    commander,
    controlViewModel,
    spanConfig,
    autocompletionWs,
    mousePoint
  ) {
    const denotationPallet = new TypeValuesPallet(
      editorHTMLElement,
      eventEmitter,
      annotationModel.typeDefinition,
      annotationModel.attribute,
      annotationModel.typeDefinition.denotation,
      selectionModel.entity,
      commander,
      'Term configuration',
      controlViewModel,
      mousePoint
    )

    const spanEditor = new SpanEditor(
      editorHTMLElement,
      annotationModel,
      selectionModel,
      commander,
      controlViewModel,
      spanConfig
    )

    const getAutocompletionWs = () =>
      autocompletionWs || annotationModel.typeDefinition.autocompletionWs

    super(
      editorHTMLElement,
      selectionModel,
      annotationModel,
      denotationPallet,
      commander,
      getAutocompletionWs,
      annotationModel.typeDefinition.denotation,
      'entity'
    )

    this._mouseEventHandler = new MouseEventHandler(
      editorHTMLElement,
      annotationModel,
      selectionModel,
      denotationPallet,
      spanEditor
    )
    this._spanEditor = spanEditor
    this._controlViewModel = controlViewModel
    this._textBox = editorHTMLElement.querySelector('.textae-editor__text-box')
    this._spanModelContainer = annotationModel.span

    this._attributeEditor = new AttributeEditor(
      commander,
      annotationModel,
      selectionModel.entity,
      new SelectionAttributePallet(editorHTMLElement, mousePoint),
      () => this.editProperties(),
      denotationPallet
    )
    this._mousePoint = mousePoint
  }

  bindMouseEvents() {
    return bindMouseEvents(this._editorHTMLElement, this._mouseEventHandler)
  }

  createSpan() {
    this._spanEditor.cerateSpanForTouchDevice()
  }

  expandSpan() {
    this._spanEditor.expandForTouchDevice()
  }

  shrinkSpan() {
    this._spanEditor.shrinkForTouchDevice()
  }

  applyTextSelection() {
    if (isRangeInTextBox(window.getSelection(), this._textBox)) {
      const selectionWrapper = new SelectionWrapper(this._spanModelContainer)
      const { begin, end } = new OrderedPositions(
        selectionWrapper.positionsOnAnnotation
      )
      const isSelectionTextCrossingAnySpan =
        this._spanModelContainer.isBoundaryCrossingWithOtherSpans(begin, end)

      this._controlViewModel.updateManipulateSpanButtons(
        selectionWrapper.isParentOfBothNodesSame,
        isSelectionTextCrossingAnySpan,
        isSelectionTextCrossingAnySpan
      )
    } else {
      this._controlViewModel.updateManipulateSpanButtons(false, false, false)
    }
  }

  editProperties() {
    if (this._selectionModel.entity.some) {
      new EditPropertiesDialog(
        this._editorHTMLElement,
        'Entity',
        'Entity',
        this._definitionContainer,
        this._annotationModel.typeDefinition.attribute,
        this._getAutocompletionWs(),
        this._selectionModel.entity.all,
        this.pallet,
        this._mousePoint
      )
        .open()
        .then((values) => this._typeValuesChanged(values))
    }
  }
}
