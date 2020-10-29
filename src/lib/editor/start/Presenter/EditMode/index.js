import { MODE } from '../../../../MODE'
import TypeEditor from './TypeEditor'
import DisplayInstance from './DisplayInstance'
import StateMachine from './StateMachine'

export default class {
  constructor(
    editor,
    annotationData,
    selectionModel,
    spanConfig,
    commander,
    buttonController,
    originalData,
    typeDefinition,
    autocompletionWs,
    typeGap
  ) {
    this._annotationData = annotationData
    this._typeEditor = new TypeEditor(
      editor,
      annotationData,
      selectionModel,
      spanConfig,
      commander,
      buttonController,
      originalData,
      typeDefinition,
      autocompletionWs
    )
    this._displayInstance = new DisplayInstance(typeGap)

    this._stateMachine = new StateMachine(
      editor,
      this._typeEditor,
      this._displayInstance
    )

    // The jsPlumbConnetion has an original event mecanism.
    // We can only bind the connection directory.
    editor.eventEmitter.on(
      'textae.editor.jsPlumbConnection.click',
      (jsPlumbConnection, event) =>
        this._typeEditor.jsPlumbConnectionClicked(jsPlumbConnection, event)
    )
  }

  get isEditDenotation() {
    return (
      this._stateMachine.currentState === MODE.EDIT_DENOTATION_WITH_RELATION
    )
  }

  // For an intiation transition on an annotations data loaded.
  toEditDenotationWithoutRelation() {
    this._stateMachine.setState(MODE.EDIT_DENOTATION_WITHOUT_RELATION)
  }

  toEditDenotationWithRelation() {
    this._stateMachine.setState(MODE.EDIT_DENOTATION_WITH_RELATION)
  }

  toViewWithoutRelation() {
    this._stateMachine.setState(MODE.VIEW_WITHOUT_RELATION)
  }

  toViewWithRelation() {
    this._stateMachine.setState(MODE.VIEW_WITH_RELATION)
  }

  // For buttan actions.
  pushView() {
    this._stateMachine.pushView()
  }

  pushTerm() {
    this._stateMachine.pushTerm(this._annotationData)
  }

  pushRelation() {
    this._stateMachine.setState(MODE.EDIT_RELATION)
  }

  toggleSimple() {
    this._stateMachine.toggleSimple()
  }

  // For key input of F or M.
  changeByShortcut() {
    this._stateMachine.changeByShortcut()
  }

  showPallet() {
    this._typeEditor.showPallet()
  }

  changeLabel() {
    this._typeEditor.changeLabel()
  }

  manipulateAttribute(number, shiftKey) {
    this._typeEditor.manipulateAttribute(number, shiftKey)
  }

  cancelSelect() {
    this._typeEditor.cancelSelect()
  }

  get isEntityPalletShown() {
    return this._typeEditor.isEntityPalletShown
  }

  selectLeftAttributeTab() {
    this._typeEditor.selectLeftAttributeTab()
  }

  selectRightAttributeTab() {
    this._typeEditor.selectRightAttributeTab()
  }

  get displayInstance() {
    return this._displayInstance
  }
}
