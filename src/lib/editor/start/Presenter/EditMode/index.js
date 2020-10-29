import Transition from './Transition'
import { MODE } from '../../../../MODE'
import pushView from './pushView'
import pushTerm from './pushTerm'
import changeByShortcut from './changeByShortcut'
import TypeEditor from './TypeEditor'
import DisplayInstance from './DisplayInstance'
import StateMachine from './StateMachine'
import toggleSimple from './toggleSimple'

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
      new Transition(editor, this._typeEditor, this._displayInstance)
    )

    this._annotationData = annotationData

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
    pushView(this._stateMachine)
  }

  pushTerm() {
    pushTerm(this._stateMachine, this._annotationData)
  }

  pushRelation() {
    this._stateMachine.setState(MODE.EDIT_RELATION)
  }

  toggleSimple() {
    toggleSimple(this._stateMachine)
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

  get displayInstance() {
    return this._displayInstance
  }
}
