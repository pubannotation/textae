import { MODE } from '../../../../MODE'
import StateMachine from './StateMachine'
import EditDenotation from './EditDenotation'
import EditBlock from './EditBlock'
import EditRelation from './EditRelation'
import ViewHandler from './ViewHandler'
import forwardMethods from '../forwardMethods'

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

    this._stateMachine = new StateMachine(
      editor,
      annotationData,
      () => {
        this.cancelSelect()
        this._unbindAllMouseEventhandler()
      },
      () => (this._listeners = this._editDenotation.init()),
      () => (this._listeners = this._editBlock.init()),
      () => (this._listeners = this._editRelation.init())
    )

    this._selectionModel = selectionModel

    editor.eventEmitter.on(
      'textae-event.editor.relation.click',
      (event, relation, attribute) =>
        this._currentHandler.relationClicked(event, relation, attribute)
    )

    this._viewHandler = new ViewHandler(
      annotationData.namespace,
      annotationData.typeDefinition.relation
    )

    forwardMethods(this, () => this._currentEdit, ['createSpan', 'expandSpan'])
    forwardMethods(this, () => this._stateMachine, [
      'toViewMode',
      'toTermMode',
      'toBlockMode',
      'toggleSimpleMode',
      'changeModeByShortcut'
    ])
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
  toRelationMode() {
    this._stateMachine.setState(MODE.EDIT_RELATION)
  }

  showPallet() {
    this._currentEdit.pallet.show()
  }

  editTypeValues() {
    this._currentHandler.editTypeValues()
  }

  manipulateAttribute(number, shiftKey) {
    this._currentHandler.manipulateAttribute(number, shiftKey)
  }

  cancelSelect() {
    // Close all pallets.
    this._editDenotation.pallet.hide()
    this._editBlock.pallet.hide()
    this._editRelation.pallet.hide()

    this._selectionModel.removeAll()
  }

  get isTypeValuesPalletShown() {
    return (
      this._editDenotation.pallet.visibly ||
      this._editBlock.pallet.visibly ||
      this._editRelation.pallet.visibly
    )
  }

  selectLeftAttributeTab() {
    this._currentEdit.pallet.selectLeftTab()
  }

  selectRightAttributeTab() {
    this._currentEdit.pallet.selectRightTab()
  }

  get _currentHandler() {
    return this._currentEdit.handler
  }

  get _currentEdit() {
    switch (this._stateMachine.currentState) {
      case MODE.EDIT_DENOTATION_WITHOUT_RELATION:
      case MODE.EDIT_DENOTATION_WITH_RELATION:
        return this._editDenotation
      case MODE.EDIT_BLOCK_WITHOUT_RELATION:
      case MODE.EDIT_BLOCK_WITH_RELATION:
        return this._editBlock
      case MODE.EDIT_RELATION:
        return this._editRelation
      default:
        return {
          handler: this._viewHandler,
          pallet: {
            show() {},
            selectLeftTab() {},
            selectRightTab() {}
          }
        }
    }
  }

  _unbindAllMouseEventhandler() {
    for (const listner of this._listeners) {
      listner.destroy()
    }
    this._listeners = []
  }
}
