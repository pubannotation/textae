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
    controlViewModel,
    autocompletionWs
  ) {
    this._editDenotation = new EditDenotation(
      editorHTMLElement,
      eventEmitter,
      annotationData,
      selectionModel,
      commander,
      controlViewModel,
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
      controlViewModel,
      autocompletionWs
    )

    this._editRelation = new EditRelation(
      editorHTMLElement,
      eventEmitter,
      annotationData,
      selectionModel,
      commander,
      autocompletionWs,
      controlViewModel
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
      () => (this._listeners = this._editDenotation.bindMouseEvents()),
      () => (this._listeners = this._editBlock.bindMouseEvents()),
      () => (this._listeners = this._editRelation.bindMouseEvents())
    )
    this._stateMachine = new StateMachine(annotationData.relation, transition)

    this._annotationData = annotationData
    this._selectionModel = selectionModel

    eventEmitter
      .on('textae-event.editor.relation.click', (event, relation) =>
        this.currentEdit.relationClicked(event, relation)
      )
      .on('textae-event.editor.relation-bollard.click', (event, entity) =>
        this.currentEdit.typeValuesClicked(event, entity)
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

  forDenotationEditable() {
    if (this._annotationData.relation.some) {
      this._stateMachine.setState(MODE.EDIT_DENOTATION_WITH_RELATION)
    } else {
      this._stateMachine.setState(MODE.EDIT_DENOTATION_WITHOUT_RELATION)
    }
  }

  forBlockEditable() {
    if (this._annotationData.relation.some) {
      this._stateMachine.setState(MODE.EDIT_BLOCK_WITH_RELATION)
    } else {
      this._stateMachine.setState(MODE.EDIT_BLOCK_WITHOUT_RELATION)
    }
  }

  forRelationEditable() {
    this._stateMachine.setState(MODE.EDIT_RELATION)
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
          editProperties() {},
          manipulateAttribute() {},
          relationClicked() {},
          typeValuesClicked(_, entity) {
            entity.focus()
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
