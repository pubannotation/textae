import { MODE } from '../../../../MODE'
import DisplayInstance from './DisplayInstance'
import StateMachine from './StateMachine'
import ElementEditor from './ElementEditor'
import bindAttributeTabEvents from './bindAttributeTabEvents'
import initPallet from './initPallet'
import EntityPallet from '../../../../component/EntityPallet'
import RelationPallet from '../../../../component/RelationPallet'

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

    // will init.
    this._entityPallet = new EntityPallet(
      editor,
      originalData,
      typeDefinition,
      selectionModel.entity
    )
    this._relationPallet = new RelationPallet(
      editor,
      originalData,
      typeDefinition
    )

    this._elementEditor = new ElementEditor(
      editor,
      annotationData,
      selectionModel,
      spanConfig,
      commander,
      buttonController,
      typeDefinition,
      this._entityPallet,
      this._relationPallet
    )

    bindAttributeTabEvents(
      editor.eventEmitter,
      commander,
      selectionModel.entity,
      this._entityPallet
    )

    initPallet(
      this._entityPallet,
      editor,
      commander,
      'entity',
      this._elementEditor.denotationHandler,
      () => this._autocompletionWs
    )

    initPallet(
      this._relationPallet,
      editor,
      commander,
      'relation',
      this._elementEditor.relationHandler,
      () => this._autocompletionWs
    )

    this._displayInstance = new DisplayInstance(typeGap)

    this._stateMachine = new StateMachine(
      editor,
      this._displayInstance,
      () => {
        this.cancelSelect()
        this._elementEditor.noEdit()
      },
      () => {
        this.cancelSelect()
        this._elementEditor.editDenotation()
      },
      () => {
        this.cancelSelect()
        this._elementEditor.editBlock()
      },
      () => {
        this.cancelSelect()
        this._elementEditor.editRelation()
      }
    )

    this._typeDefinition = typeDefinition
    this._autocompletionWsFromParams = autocompletionWs
    this._selectionModel = selectionModel

    // The jsPlumbConnetion has an original event mecanism.
    // We can only bind the connection directory.
    editor.eventEmitter.on(
      'textae.editor.jsPlumbConnection.click',
      (jsPlumbConnection, event) => {
        // The EventHandlar for clieck event of jsPlumbConnection.
        this._elementEditor
          .getHandler()
          .jsPlumbConnectionClicked(jsPlumbConnection, event)
      }
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

  pushBlock() {
    this._stateMachine.pushBlock(this._annotationData)
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
    const pallet = this._getPallet()
    if (pallet) {
      pallet.show()
    }
  }

  changeLabel() {
    this._elementEditor.getHandler().changeLabelHandler(this._autocompletionWs)
  }

  manipulateAttribute(number, shiftKey) {
    this._elementEditor.getHandler().manipulateAttribute(number, shiftKey)
  }

  cancelSelect() {
    const pallet = this._getPallet()
    if (pallet) {
      pallet.hide()
    }

    this._selectionModel.clear()
  }

  get isEntityPalletShown() {
    return this._entityPallet.visibly
  }

  selectLeftAttributeTab() {
    if (this._entityPallet.visibly) {
      this._entityPallet.selectLeftTab()
    }
  }

  selectRightAttributeTab() {
    if (this._entityPallet.visibly) {
      this._entityPallet.selectRightTab()
    }
  }

  get displayInstance() {
    return this._displayInstance
  }

  _getPallet() {
    if (this._elementEditor.handlerType == 'entity') {
      return this._entityPallet
    }

    if (this._elementEditor.handlerType == 'relation') {
      return this._relationPallet
    }
  }

  get _autocompletionWs() {
    return (
      this._autocompletionWsFromParams || this._typeDefinition.autocompletionWs
    )
  }
}
