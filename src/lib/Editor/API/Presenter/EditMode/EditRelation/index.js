import EditRelationHandler from './EditRelationHandler'
import bindMouseEvents from './bindMouseEvents'
import MouseEventHandler from './MouseEventHandler'
import Edit from '../Edit'
import TypeValuesPallet from '../../../../../component/TypeValuesPallet'
import AttributeEditor from '../DefaultHandler/AttributeEditor'
import SelectionAttributePallet from '../../../../../component/SelectionAttributePallet'
import EditTypeValuesDialog from '../../../../../component/EditTypeValuesDialog'

export default class EditRelation extends Edit {
  constructor(
    editorHTMLElement,
    eventEmitter,
    annotationData,
    selectionModel,
    commander,
    autocompletionWs,
    buttonController
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
      buttonController
    )

    const getAutocompletionWs = () =>
      autocompletionWs || annotationData.typeDefinition.autocompletionWs

    const handler = new EditRelationHandler(
      editorHTMLElement,
      annotationData.typeDefinition.relation,
      commander,
      annotationData,
      selectionModel,
      relationPallet,
      getAutocompletionWs
    )

    super(
      editorHTMLElement,
      bindMouseEvents,
      new MouseEventHandler(
        editorHTMLElement,
        selectionModel,
        commander,
        annotationData.typeDefinition,
        relationPallet
      ),
      handler,
      selectionModel,
      annotationData,
      relationPallet,
      commander,
      getAutocompletionWs,
      annotationData.typeDefinition.relation
    )

    this._buttonController = buttonController
    this._attributeEditor = new AttributeEditor(
      commander,
      annotationData,
      selectionModel.relation,
      new SelectionAttributePallet(editorHTMLElement),
      () => this.editTypeValues(),
      relationPallet
    )
  }

  applyTextSelection() {
    this._buttonController.updateManipulateSpanButtons(false, false, false)
  }

  editTypeValues() {
    if (this._selectionModel.relation.some) {
      new EditTypeValuesDialog(
        this._editorHTMLElement,
        'Relation',
        'Relation',
        this._definitionContainer,
        this._annotationData.typeDefinition.attribute,
        this._getAutocompletionWs(),
        this._selectionModel.relation.all,
        this._typeValuesPallet
      )
        .open()
        .then((values) => this._typeValuesChanged(values))
    }
  }
}
