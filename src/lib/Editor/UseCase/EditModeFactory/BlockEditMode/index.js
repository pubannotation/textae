import SpanEditor from './SpanEditor'
import MouseEventHandler from './MouseEventHandler'
import EditModeBase from '../EditModeBase'
import isTextSelectionInTextBox from '../isTextSelectionInTextBox'
import SelectionWrapper from '../SelectionWrapper'
import AttributeEditor from '../AttributeEditor'
import SelectionAttributePallet from '../../../../component/SelectionAttributePallet'
import PropertyEditor from '../PropertyEditor'
import forwardMethods from '../../../forwardMethods'
import PalletFactory from '../PalletFactory'

export default class BlockEditMode extends EditModeBase {
  #mouseEventHandler
  #spanEditor
  #textBox
  #propertyEditor
  #annotationModel
  #selectionModel
  #menuState
  #pallet

  constructor(
    editorHTMLElement,
    eventEmitter,
    annotationModel,
    selectionModel,
    spanConfig,
    commander,
    menuState,
    mousePoint
  ) {
    super()

    console.log('BlockEditMode')

    this.#pallet = PalletFactory.create(
      editorHTMLElement,
      eventEmitter,
      annotationModel.typeDictionary,
      annotationModel.attributeInstanceContainer,
      annotationModel.typeDictionary.block,
      selectionModel.entity,
      commander,
      'Block configuration',
      menuState,
      mousePoint,
      'entity',
      selectionModel,
      annotationModel,
      this
    )

    const spanEditor = new SpanEditor(
      editorHTMLElement,
      annotationModel,
      spanConfig,
      commander,
      menuState,
      selectionModel
    )

    this.#mouseEventHandler = new MouseEventHandler(
      editorHTMLElement,
      annotationModel,
      selectionModel,
      spanEditor,
      this.#pallet
    )

    this.#propertyEditor = new PropertyEditor(
      editorHTMLElement,
      commander,
      this.#pallet,
      'Block',
      mousePoint,
      annotationModel.typeDictionary.block,
      annotationModel,
      'Entity'
    )
    this.#selectionModel = selectionModel

    // For touch device actions
    this.#spanEditor = spanEditor
    this.#textBox = editorHTMLElement.querySelector('.textae-editor__text-box')
    this.#annotationModel = annotationModel
    this.#menuState = menuState

    const attributeEditor = new AttributeEditor(
      commander,
      annotationModel.typeDictionary,
      selectionModel.entity,
      new SelectionAttributePallet(editorHTMLElement, mousePoint),
      () => this.editProperties(),
      this.#pallet
    )
    forwardMethods(this, () => attributeEditor, ['manipulateAttribute'])
  }

  bindMouseEvents() {
    return this.#mouseEventHandler.bind()
  }

  editProperties() {
    this.#propertyEditor.startEditing(this.#selectionModel.entity)
  }

  get isPalletShown() {
    return this.#pallet.visibly
  }

  createSpanWithTouchDevice() {
    console.log('createSpanWithTouchDevice')
    this.#spanEditor.cerateSpanForTouchDevice()
  }

  expandSpanWithTouchDevice() {
    this.#spanEditor.expandForTouchDevice()
  }

  shrinkSpanWithTouchDevice() {
    this.#spanEditor.shrinkForTouchDevice()
  }

  applyTextSelectionWithTouchDevice() {
    if (isTextSelectionInTextBox(this.#textBox)) {
      const { begin, end } = this.#annotationModel.textSelection
      const isSelectionTextCrossingAnySpan =
        this.#annotationModel.isBoundaryCrossingWithOtherSpans(begin, end)

      const { isParentOfBothNodesTextBox } = new SelectionWrapper()
      this.#menuState.updateButtonsToOperateSpanWithTouchDevice(
        isParentOfBothNodesTextBox,
        isSelectionTextCrossingAnySpan,
        isSelectionTextCrossingAnySpan,
        false
      )
    } else {
      this.#menuState.updateButtonsToOperateSpanWithTouchDevice(
        false,
        false,
        false,
        false
      )
    }
  }
}
