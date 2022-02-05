import { MODE } from '../../../../MODE'
import StateMachine from './StateMachine'
import EditDenotation from './EditDenotation'
import EditBlock from './EditBlock'
import EditRelation from './EditRelation'
import Transition from './Transition'

export default class EditMode {
  constructor(
    editorHTMLElement,
    eventEmitter,
    annotationData,
    selectionModel,
    spanConfig,
    commander,
    buttonController,
    autocompletionWs
  ) {
    this._editDenotation = new EditDenotation(
      editorHTMLElement,
      eventEmitter,
      annotationData,
      selectionModel,
      commander,
      buttonController,
      spanConfig,
      autocompletionWs
    )

    this._editBlock = new EditBlock(
      editorHTMLElement,
      eventEmitter,
      annotationData,
      selectionModel,
      spanConfig,
      commander,
      buttonController,
      autocompletionWs
    )

    this._editRelation = new EditRelation(
      editorHTMLElement,
      eventEmitter,
      annotationData,
      selectionModel,
      commander,
      autocompletionWs,
      buttonController
    )

    this._listeners = []

    const transition = new Transition(
      eventEmitter,
      editorHTMLElement,
      annotationData.typeGap,
      () => {
        this.cancelSelect()
        this._unbindAllMouseEventhandler()
      },
      () => (this._listeners = this._editDenotation.init()),
      () => (this._listeners = this._editBlock.init()),
      () => (this._listeners = this._editRelation.init())
    )
    this._stateMachine = new StateMachine(annotationData.relation, transition)

    this._annotationData = annotationData
    this._selectionModel = selectionModel

    eventEmitter.on(
      'textae-event.editor.relation.click',
      (event, relation, attribute) =>
        this.currentEdit.relationClicked(event, relation, attribute)
    )
  }

  get stateMachine() {
    return this._stateMachine
  }

  get isEditDenotation() {
    return (
      this._stateMachine.currentState === MODE.EDIT_DENOTATION_WITH_RELATION ||
      this._stateMachine.currentState === MODE.EDIT_DENOTATION_WITHOUT_RELATION
    )
  }

  // For an intiation transition on an annotations data loaded.
  forView() {
    if (this._annotationData.relation.some) {
      this._stateMachine.setState(MODE.VIEW_WITH_RELATION)
    } else {
      this._stateMachine.setState(MODE.VIEW_WITHOUT_RELATION)
    }
  }

  forEditable() {
    if (this._annotationData.relation.some) {
      this._stateMachine.setState(MODE.EDIT_DENOTATION_WITH_RELATION)
    } else {
      this._stateMachine.setState(MODE.EDIT_DENOTATION_WITHOUT_RELATION)
    }
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
    this.currentEdit.pallet.selectLeftAttributeTab()
  }

  selectRightAttributeTab() {
    this.currentEdit.pallet.selectRightAttributeTab()
  }

  get currentEdit() {
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
          showPallet() {},
          selectLeftAttributeTab() {},
          selectRightAttributeTab() {},
          editTypeValues() {},
          manipulateAttribute() {},
          relationClicked(_, relation, attribute) {
            const { href } = attribute || relation

            if (href) {
              window.open(href, '_blank')
            }
          },
          applyTextSelection() {}
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
