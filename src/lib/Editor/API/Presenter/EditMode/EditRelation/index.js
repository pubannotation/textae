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
    annotationData,
    selectionModel,
    commander,
    autocompletionWs,
    controlViewModel
  ) {
    const relationPallet = new TypeValuesPallet(
      editorHTMLElement,
      eventEmitter,
      annotationData.typeDefinition,
      annotationData.attribute,
      annotationData.typeDefinition.relation,
      selectionModel.relation,
      commander,
      'Relation configuration',
      controlViewModel
    )

    const getAutocompletionWs = () =>
      autocompletionWs || annotationData.typeDefinition.autocompletionWs

    super(
      editorHTMLElement,
      selectionModel,
      annotationData,
      relationPallet,
      commander,
      getAutocompletionWs,
      annotationData.typeDefinition.relation,
      'relation'
    )

    this._editorHTMLElement = editorHTMLElement
    this._mouseEventHandler = new MouseEventHandler(
      editorHTMLElement,
      selectionModel,
      commander,
      annotationData.typeDefinition,
      relationPallet
    )
    this._controlViewModel = controlViewModel
    this._attributeEditor = new AttributeEditor(
      commander,
      annotationData,
      selectionModel.relation,
      new SelectionAttributePallet(editorHTMLElement),
      () => this.editProperties(),
      relationPallet
    )
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
        this._annotationData.typeDefinition.attribute,
        this._getAutocompletionWs(),
        this._selectionModel.relation.all,
        this.pallet
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

  typeValuesClicked(event, entity) {
    entity.span.forceRenderGrid()
    this._selectionModel.selectEntity(entity.id)
  }
}
