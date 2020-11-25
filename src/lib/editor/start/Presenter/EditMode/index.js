import { MODE } from '../../../../MODE'
import DisplayInstance from './DisplayInstance'
import StateMachine from './StateMachine'
import EditHandler from './EditHandler'
import bindAttributeTabEvents from './bindAttributeTabEvents'
import initPallet from './initPallet'
import EntityPallet from '../../../../component/EntityPallet'
import RelationPallet from '../../../../component/RelationPallet'

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
    autocompletionWs,
    typeGap
  ) {
    this._annotationData = annotationData

    // will init.
    this._entityPallet = new EntityPallet(
      editor,
      originalData,
      typeDefinition,
      typeDefinition.denotation,
      selectionModel.entity
    )
    this._relationPallet = new RelationPallet(
      editor,
      originalData,
      typeDefinition
    )

    this._editHandler = new EditHandler(
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
      selectionModel.entity
    )

    initPallet(
      this._entityPallet,
      editor,
      commander,
      'entity',
      this._editHandler.denotationHandler,
      () => this._autocompletionWs
    )

    initPallet(
      this._relationPallet,
      editor,
      commander,
      'relation',
      this._editHandler.relationHandler,
      () => this._autocompletionWs
    )

    this._displayInstance = new DisplayInstance(typeGap)

    this._stateMachine = new StateMachine(
      editor,
      this._displayInstance,
      () => {
        this.cancelSelect()
        this._editHandler.changeToNoEdit()
      },
      () => {
        this.cancelSelect()
        this._editHandler.changeToEditDenotation()
      },
      () => {
        this.cancelSelect()
        this._editHandler.changeToEditBlock()
      },
      () => {
        this.cancelSelect()
        this._editHandler.changeToEditRelation()
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
        this._editHandler
          .getHandler()
          .jsPlumbConnectionClicked(jsPlumbConnection, event)
      }
    )

    editor.eventEmitter.on(
      'textae.editTypeDialog.attribute.value.edit',
      (attrDef) => {
        this._entityPallet.show()
        this._entityPallet.showAttribute(attrDef.pred)
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
        this._entityPallet.show()
        break
      case MODE.EDIT_RELATION:
        this._relationPallet.show()
        break
    }
  }

  changeLabel() {
    this._editHandler.getHandler().changeLabelHandler(this._autocompletionWs)
  }

  manipulateAttribute(number, shiftKey) {
    this._editHandler.getHandler().manipulateAttribute(number, shiftKey)
  }

  cancelSelect() {
    // Close all pallets.
    this._entityPallet.hide()
    this._relationPallet.hide()

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

  get _autocompletionWs() {
    return (
      this._autocompletionWsFromParams || this._typeDefinition.autocompletionWs
    )
  }
}
