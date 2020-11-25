import { MODE } from '../../../../MODE'
import DisplayInstance from './DisplayInstance'
import StateMachine from './StateMachine'
import bindAttributeTabEvents from './bindAttributeTabEvents'
import initPallet from './initPallet'
import EntityPallet from '../../../../component/EntityPallet'
import RelationPallet from '../../../../component/RelationPallet'
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
    autocompletionWs,
    typeGap
  ) {
    this._annotationData = annotationData

    // will init.
    this._denotationPallet = new EntityPallet(
      editor,
      originalData,
      typeDefinition,
      typeDefinition.denotation,
      selectionModel.entity,
      'denotation'
    )
    this._relationPallet = new RelationPallet(
      editor,
      originalData,
      typeDefinition
    )

    this._editMode = 'no-edit'

    this._editDenotation = new EditDenotation(
      editor,
      annotationData,
      selectionModel,
      commander,
      buttonController,
      typeDefinition,
      spanConfig,
      this._denotationPallet
    )

    this._editBlock = new EditBlock(
      editor,
      annotationData,
      selectionModel,
      spanConfig,
      commander,
      buttonController,
      typeDefinition
    )

    this._editRelation = new EditRelation(
      editor,
      annotationData,
      selectionModel,
      commander,
      typeDefinition,
      this._relationPallet
    )

    this._listeners = []

    bindAttributeTabEvents(
      editor.eventEmitter,
      commander,
      selectionModel.entity
    )

    initPallet(
      this._denotationPallet,
      editor,
      commander,
      'denotation',
      this._editDenotation.handler,
      () => this._autocompletionWs,
      typeDefinition.denotation
    )

    initPallet(
      this._relationPallet,
      editor,
      commander,
      'relation',
      this._relationHandler,
      () => this._autocompletionWs,
      typeDefinition.relation
    )

    this._displayInstance = new DisplayInstance(typeGap)

    this._stateMachine = new StateMachine(
      editor,
      this._displayInstance,
      () => {
        this.cancelSelect()
        this._changeToNoEdit()
      },
      () => {
        this.cancelSelect()
        this._changeToEditDenotation()
      },
      () => {
        this.cancelSelect()
        this._changeToEditBlock()
      },
      () => {
        this.cancelSelect()
        this._changeToEditRelation()
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
        this._getHandler().jsPlumbConnectionClicked(jsPlumbConnection, event)
      }
    )

    editor.eventEmitter.on(
      'textae.editTypeDialog.attribute.value.edit',
      (attrDef) => {
        this._denotationPallet.show()
        this._denotationPallet.showAttribute(attrDef.pred)
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
        this._denotationPallet.show()
        break
      case MODE.EDIT_RELATION:
        this._relationPallet.show()
        break
    }
  }

  changeLabel() {
    this._getHandler().changeLabelHandler(this._autocompletionWs)
  }

  manipulateAttribute(number, shiftKey) {
    this._getHandler().manipulateAttribute(number, shiftKey)
  }

  cancelSelect() {
    // Close all pallets.
    this._denotationPallet.hide()
    this._relationPallet.hide()

    this._selectionModel.clear()
  }

  get isEntityPalletShown() {
    return this._denotationPallet.visibly
  }

  selectLeftAttributeTab() {
    if (this._denotationPallet.visibly) {
      this._denotationPallet.selectLeftTab()
    }
  }

  selectRightAttributeTab() {
    if (this._denotationPallet.visibly) {
      this._denotationPallet.selectRightTab()
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

  _getHandler() {
    switch (this._editMode) {
      case 'denotation':
        return this._editDenotation.handler
      case 'block':
        return this._editBlock.handler
      case 'relation':
        return this._editRelation.handler
      default:
        return new DefaultHandler()
    }
  }

  get _relationHandler() {
    return this._editRelation.handler
  }

  _changeToNoEdit() {
    this._unbindAllMouseEventhandler()
    this._editMode = 'no-edit'
  }

  _changeToEditDenotation() {
    this._unbindAllMouseEventhandler()
    this._listeners = this._editDenotation.init()
    this._editMode = 'denotation'
  }

  _changeToEditBlock() {
    this._unbindAllMouseEventhandler()
    this._listeners = this._editBlock.init()
    this._editMode = 'block'
  }

  _changeToEditRelation() {
    this._unbindAllMouseEventhandler()
    this._listeners = this._editRelation.init()
    this._editMode = 'relation'
  }

  _unbindAllMouseEventhandler() {
    for (const listner of this._listeners) {
      listner.destroy()
    }
    this._listeners = []
  }
}
