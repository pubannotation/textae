import { MODE } from '../../../../MODE'
import StateMachine from './StateMachine'
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

    this.stateMachine = new StateMachine(
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
        this.currentHandler.relationClicked(event, relation, attribute)
    )

    this._viewHandler = new ViewHandler(
      annotationData.namespace,
      annotationData.typeDefinition.relation
    )
  }

  get isEditDenotation() {
    return (
      this.stateMachine.currentState === MODE.EDIT_DENOTATION_WITH_RELATION ||
      this.stateMachine.currentState === MODE.EDIT_DENOTATION_WITHOUT_RELATION
    )
  }

  // For an intiation transition on an annotations data loaded.
  toEditDenotationWithoutRelation() {
    this.stateMachine.setState(MODE.EDIT_DENOTATION_WITHOUT_RELATION)
  }

  toEditDenotationWithRelation() {
    this.stateMachine.setState(MODE.EDIT_DENOTATION_WITH_RELATION)
  }

  toViewWithoutRelation() {
    this.stateMachine.setState(MODE.VIEW_WITHOUT_RELATION)
  }

  toViewWithRelation() {
    this.stateMachine.setState(MODE.VIEW_WITH_RELATION)
  }

  // For buttan actions.
  showPallet() {
    this.currentEdit.pallet.show()
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
    this.currentEdit.pallet.selectLeftTab()
  }

  selectRightAttributeTab() {
    this.currentEdit.pallet.selectRightTab()
  }

  get currentHandler() {
    return this.currentEdit.handler
  }

  get currentEdit() {
    switch (this.stateMachine.currentState) {
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
          },
          editTypeValues() {},
          manipulateAttribute() {}
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
