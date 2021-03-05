import { MODE } from '../../../../MODE'
import StateMachine from './StateMachine'
import bindAttributeTabEvents from './bindAttributeTabEvents'
import EditDenotation from './EditDenotation'
import EditBlock from './EditBlock'
import EditRelation from './EditRelation'
import ViewHandler from './ViewHandler'

export default class EditMode {
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
    this._annotationData = annotationData

    this._editDenotation = new EditDenotation(
      editor,
      annotationData,
      selectionModel,
      commander,
      buttonController,
      spanConfig,
      originalData,
      autocompletionWs
    )

    this._editBlock = new EditBlock(
      editor,
      annotationData,
      selectionModel,
      spanConfig,
      commander,
      buttonController,
      originalData,
      autocompletionWs
    )

    this._editRelation = new EditRelation(
      editor,
      annotationData,
      selectionModel,
      commander,
      originalData,
      autocompletionWs
    )

    this._listeners = []

    bindAttributeTabEvents(
      editor.eventEmitter,
      commander,
      selectionModel.entity
    )

    this._stateMachine = new StateMachine(
      editor,
      annotationData.entityGap,
      () => {
        this.cancelSelect()
        this._unbindAllMouseEventhandler()
      },
      () => (this._listeners = this._editDenotation.init()),
      () => (this._listeners = this._editBlock.init()),
      () => (this._listeners = this._editRelation.init())
    )

    this._autocompletionWsFromParams = autocompletionWs
    this._selectionModel = selectionModel

    editor.eventEmitter.on(
      'textae-event.editor.relation.click',
      (event, relation) => this._getHandler().relationClicked(event, relation)
    )

    this._viewHandler = new ViewHandler(
      annotationData.namespace,
      annotationData.typeDefinition.relation
    )
  }

  get isEditDenotation() {
    return (
      this._stateMachine.currentState === MODE.EDIT_DENOTATION_WITH_RELATION ||
      this._stateMachine.currentState === MODE.EDIT_DENOTATION_WITHOUT_RELATION
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
    switch (this._stateMachine.currentState) {
      case MODE.EDIT_DENOTATION_WITHOUT_RELATION:
      case MODE.EDIT_DENOTATION_WITH_RELATION:
        this._editDenotation.pallet.show()
        break
      case MODE.EDIT_BLOCK_WITHOUT_RELATION:
      case MODE.EDIT_BLOCK_WITH_RELATION:
        this._editBlock.pallet.show()
        break
      case MODE.EDIT_RELATION:
        this._editRelation.pallet.show()
        break
    }
  }

  changeLabel() {
    this._getHandler().changeInstance(
      this._autocompletionWsFromParams ||
        this._annotationData.typeDefinition.autocompletionWs
    )
  }

  manipulateAttribute(number, shiftKey) {
    this._getHandler().manipulateAttribute(number, shiftKey)
  }

  cancelSelect() {
    // Close all pallets.
    this._editDenotation.pallet.hide()
    this._editBlock.pallet.hide()
    this._editRelation.pallet.hide()

    this._selectionModel.removeAll()
  }

  get isEntityAndAttributePalletShown() {
    return this._editDenotation.pallet.visibly || this._editBlock.pallet.visibly
  }

  selectLeftAttributeTab() {
    switch (this._stateMachine.currentState) {
      case MODE.EDIT_DENOTATION_WITHOUT_RELATION:
      case MODE.EDIT_DENOTATION_WITH_RELATION:
        this._editDenotation.pallet.selectLeftTab()
        break
      case MODE.EDIT_BLOCK_WITHOUT_RELATION:
      case MODE.EDIT_BLOCK_WITH_RELATION:
        this._editBlock.pallet.selectLeftTab()
        break
    }
  }

  selectRightAttributeTab() {
    switch (this._stateMachine.currentState) {
      case MODE.EDIT_DENOTATION_WITHOUT_RELATION:
      case MODE.EDIT_DENOTATION_WITH_RELATION:
        this._editDenotation.pallet.selectRightTab()
        break
      case MODE.EDIT_BLOCK_WITHOUT_RELATION:
      case MODE.EDIT_BLOCK_WITH_RELATION:
        this._editBlock.pallet.selectRightTab()
        break
    }
  }

  _getHandler() {
    switch (this._stateMachine.currentState) {
      case MODE.EDIT_DENOTATION_WITHOUT_RELATION:
      case MODE.EDIT_DENOTATION_WITH_RELATION:
        return this._editDenotation.handler
      case MODE.EDIT_BLOCK_WITHOUT_RELATION:
      case MODE.EDIT_BLOCK_WITH_RELATION:
        return this._editBlock.handler
      case MODE.EDIT_RELATION:
        return this._editRelation.handler
      default:
        return this._viewHandler
    }
  }

  _unbindAllMouseEventhandler() {
    for (const listner of this._listeners) {
      listner.destroy()
    }
    this._listeners = []
  }
}
