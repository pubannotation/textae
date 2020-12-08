import { MODE } from '../../../../MODE'
import StateMachine from './StateMachine'
import bindAttributeTabEvents from './bindAttributeTabEvents'
import EditDenotation from './EditDenotation'
import EditBlock from './EditBlock'
import EditRelation from './EditRelation'
import DefaultHandler from './DefaultHandler'

export default class EditMode {
  constructor(
    editor,
    annotationData,
    selectionModel,
    spanConfig,
    commander,
    buttonController,
    originalData,
    typeDefinition,
    autocompletionWs
  ) {
    this._annotationData = annotationData

    this._editDenotation = new EditDenotation(
      editor,
      annotationData,
      selectionModel,
      commander,
      buttonController,
      typeDefinition,
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
      typeDefinition,
      originalData,
      autocompletionWs
    )

    this._editRelation = new EditRelation(
      editor,
      annotationData,
      selectionModel,
      commander,
      typeDefinition,
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

    this._typeDefinition = typeDefinition
    this._autocompletionWsFromParams = autocompletionWs
    this._selectionModel = selectionModel

    // The jsPlumbConnetion has an original event mecanism.
    // We can only bind the connection directory.
    editor.eventEmitter.on(
      'textae.editor.jsPlumbConnection.click',
      (jsPlumbConnection, event) => {
        // The EventHandlar for clieck event of jsPlumbConnection.
        this._getHandler().jsPlumbConnectionClicked(jsPlumbConnection, event)
      }
    )

    editor.eventEmitter.on(
      'textae.editTypeDialog.attribute.value.edit',
      (attrDef) => {
        switch (this._stateMachine.currentState) {
          case MODE.EDIT_DENOTATION_WITHOUT_RELATION:
          case MODE.EDIT_DENOTATION_WITH_RELATION:
            this._editDenotation.pallet.show()
            this._editDenotation.pallet.showAttribute(attrDef.pred)
            break
          case MODE.EDIT_BLOCK_WITHOUT_RELATION:
          case MODE.EDIT_BLOCK_WITH_RELATION:
            this._editBlock.pallet.show()
            this._editBlock.pallet.showAttribute(attrDef.pred)
            break
        }
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
    this._getHandler().changeLabelHandler(
      this._autocompletionWsFromParams || this._typeDefinition.autocompletionWs
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

    this._selectionModel.clear()
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
        return new DefaultHandler()
    }
  }

  _unbindAllMouseEventhandler() {
    for (const listner of this._listeners) {
      listner.destroy()
    }
    this._listeners = []
  }
}
