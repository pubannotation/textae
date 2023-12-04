import bindMouseEvents from './bindMouseEvents'
import MouseEventHandler from './MouseEventHandler'
import Edit from '../Edit'
import TypeValuesPallet from '../../../../../component/TypeValuesPallet'
import AttributeEditor from '../AttributeEditor'
import SelectionAttributePallet from '../../../../../component/SelectionAttributePallet'
import EditPropertiesDialog from '../../../../../component/EditPropertiesDialog'

export default class EditRelation extends Edit {
  constructor(
    editorHTMLElement,
    eventEmitter,
    annotationModel,
    selectionModel,
    commander,
    autocompletionWs,
    controlViewModel,
    mousePoint
  ) {
    const relationPallet = new TypeValuesPallet(
      editorHTMLElement,
      eventEmitter,
      annotationModel.typeDefinition,
      annotationModel.attribute,
      annotationModel.typeDefinition.relation,
      selectionModel.relation,
      commander,
      'Relation configuration',
      controlViewModel,
      mousePoint
    )

    const getAutocompletionWs = () =>
      autocompletionWs || annotationModel.typeDefinition.autocompletionWs

    super(
      editorHTMLElement,
      selectionModel,
      annotationModel,
      relationPallet,
      commander,
      getAutocompletionWs,
      annotationModel.typeDefinition.relation,
      'relation'
    )

    this._editorHTMLElement = editorHTMLElement
    this._mouseEventHandler = new MouseEventHandler(
      editorHTMLElement,
      selectionModel,
      commander,
      annotationModel.typeDefinition,
      relationPallet
    )
    this._controlViewModel = controlViewModel
    this._attributeEditor = new AttributeEditor(
      commander,
      annotationModel,
      selectionModel.relation,
      new SelectionAttributePallet(editorHTMLElement, mousePoint),
      () => this.editProperties(),
      relationPallet
    )
    this._mousePoint = mousePoint
  }

  bindMouseEvents() {
    return bindMouseEvents(this._editorHTMLElement, this._mouseEventHandler)
  }

  applyTextSelection() {
    this._controlViewModel.updateManipulateSpanButtons(false, false, false)
  }

  editProperties() {
    if (this._selectionModel.relation.some) {
      new EditPropertiesDialog(
        this._editorHTMLElement,
        'Relation',
        'Relation',
        this._definitionContainer,
        this._annotationModel.typeDefinition.attribute,
        this._getAutocompletionWs(),
        this._selectionModel.relation.all,
        this.pallet,
        this._mousePoint
      )
        .open()
        .then((values) => this._typeValuesChanged(values))
    }
  }

  relationClicked(event, relation) {
    if (event.ctrlKey || event.metaKey) {
      this._selectionModel.relation.toggle(relation.id)
    } else {
      this._selectionModel.selectRelation(relation.id)
    }
  }

  relationBollardClicked(entity) {
    entity.span.forceRenderGrid()
    this._selectionModel.selectEntity(entity.id)
  }
}
