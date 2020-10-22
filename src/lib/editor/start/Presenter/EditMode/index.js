import Transition from './Transition'
import bindTransition from './bindTransition'
import { MODE } from '../../../../MODE'
import pushView from './pushView'
import pushTerm from './pushTerm'
import pushSimple from './pushSimple'
import upSimple from './upSimple'
import changeByShortcut from './changeByShortcut'
import TypeEditor from './TypeEditor'

export default class {
  constructor(
    editor,
    annotationData,
    displayInstance,
    selectionModel,
    spanConfig,
    commander,
    buttonController,
    originalData,
    typeDefinition,
    autocompletionWs
  ) {
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

    const transition = new Transition(editor, this._typeEditor, displayInstance)
    this._stateMachine = bindTransition(transition)
    this._annotationData = annotationData

    // The jsPlumbConnetion has an original event mecanism.
    // We can only bind the connection directory.
    editor.eventEmitter.on(
      'textae.editor.jsPlumbConnection.click',
      (jsPlumbConnection, event) =>
        this._typeEditor.jsPlumbConnectionClicked(jsPlumbConnection, event)
    )
  }

  get isSimple() {
    return (
      this._stateMachine.currentState === MODE.EDIT_DENOTATION_WITHOUT_RELATION
    )
  }

  get isEditEntity() {
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
    pushView(this._stateMachine)
  }

  pushTerm() {
    pushTerm(this._stateMachine, this._annotationData)
  }

  pushRelation() {
    this._stateMachine.setState(MODE.EDIT_RELATION)
  }

  pushSimple() {
    pushSimple(this._stateMachine)
  }

  upSimple() {
    upSimple(this._stateMachine)
  }

  toggleSimple() {
    switch (this._stateMachine.currentState) {
      case MODE.EDIT_DENOTATION_WITHOUT_RELATION:
        this._stateMachine.setState(MODE.EDIT_DENOTATION_WITH_RELATION)
        break
      case MODE.VIEW_WITHOUT_RELATION:
        this._stateMachine.setState(MODE.VIEW_WITH_RELATION)
        break
      case MODE.EDIT_DENOTATION_WITH_RELATION:
        this._stateMachine.setState(MODE.EDIT_DENOTATION_WITHOUT_RELATION)
        break
      case MODE.VIEW_WITH_RELATION:
        this._stateMachine.setState(MODE.VIEW_WITHOUT_RELATION)
        break
      default:
        throw new Error(`Invalid state: ${this._stateMachine.currentState}`)
    }
  }

  // For key input of F or M.
  changeByShortcut() {
    changeByShortcut(this._stateMachine)
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
}
