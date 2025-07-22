import MouseEventHandler from './MouseEventHandler'
import SpanEditor from './SpanEditor'
import EditMode from '../EditModeFactory/EditMode'
import isTextSelectionInTextBox from '../isTextSelectionInTextBox'
import SelectionWrapper from '../EditModeSwitch/SelectionWrapper'
import AttributeEditor from '../EditModeSwitch/AttributeEditor'
import SelectionAttributePallet from '../../../component/SelectionAttributePallet'
import PropertyEditor from '../EditModeSwitch/PropertyEditor'
import forwardMethods from '../../forwardMethods'
import PalletFactory from '../EditModeSwitch/PalletFactory'

export default class TermEditMode extends EditMode {
  #mouseEventHandler
  #spanEditor
  #textBox
  #annotationModel
  #propertyEditor
  #selectionModel
  #menuState
  #pallet

  constructor(
    editorHTMLElement,
    eventEmitter,
    annotationModel,
    selectionModel,
    commander,
    menuState,
    spanConfig,
    mousePoint
  ) {
    super()

    this.#pallet = PalletFactory.create(
      editorHTMLElement,
      eventEmitter,
      annotationModel.typeDictionary,
      annotationModel.attributeInstanceContainer,
      annotationModel.typeDictionary.denotation,
      selectionModel.entity,
      commander,
      'Term configuration',
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
      selectionModel,
      commander,
      menuState,
      spanConfig
    )

    this.#mouseEventHandler = new MouseEventHandler(
      editorHTMLElement,
      annotationModel,
      selectionModel,
      this.#pallet,
      spanEditor
    )

    this.#propertyEditor = new PropertyEditor(
      editorHTMLElement,
      commander,
      this.#pallet,
      'Entity',
      mousePoint,
      annotationModel.typeDictionary.denotation,
      annotationModel,
      'Denotation'
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
    return this.#pallet.visibility
  }

  createSpanWithTouchDevice() {
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

      const { isParentOfBothNodesSame } = new SelectionWrapper()
      this.#menuState.updateButtonsToOperateSpanWithTouchDevice(
        isParentOfBothNodesSame,
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
