import MouseEventHandler from './MouseEventHandler'
import EditMode from '../EditMode'
import AttributeEditor from '../AttributeEditor'
import SelectionAttributePallet from '../../../../../component/SelectionAttributePallet'
import PropertyEditor from '../EditMode/PropertyEditor'
import forwardMethods from '../../../../forwardMethods'
import PalletFactory from '../PalletFactory'

export default class RelationEditMode extends EditMode {
  #mouseEventHandler
  #propertyEditor
  #selectionModel
  #pallet

  constructor(
    editorHTMLElement,
    eventEmitter,
    annotationModel,
    selectionModel,
    commander,
    menuState,
    mousePoint,
    autocompletionCallbackGetter
  ) {
    super()

    const getAutocompletionWs = () =>
      annotationModel.typeDictionary.autocompletionWs

    this.#pallet = PalletFactory.create(
      editorHTMLElement,
      eventEmitter,
      annotationModel.typeDictionary,
      annotationModel.attributeInstanceContainer,
      annotationModel.typeDictionary.relation,
      selectionModel.relation,
      commander,
      'Relation configuration',
      menuState,
      mousePoint,
      getAutocompletionWs,
      'relation',
      selectionModel,
      annotationModel,
      this
    )

    this.#mouseEventHandler = new MouseEventHandler(
      editorHTMLElement,
      selectionModel,
      commander,
      annotationModel.typeDictionary,
      this.#pallet
    )

    this.#propertyEditor = new PropertyEditor(
      editorHTMLElement,
      commander,
      this.#pallet,
      'Relation',
      mousePoint,
      annotationModel.typeDictionary.relation,
      annotationModel,
      'Relation',
      getAutocompletionWs,
      autocompletionCallbackGetter
    )
    this.#selectionModel = selectionModel

    const attributeEditor = new AttributeEditor(
      commander,
      annotationModel.typeDictionary,
      selectionModel.relation,
      new SelectionAttributePallet(editorHTMLElement, mousePoint),
      () => this.editProperties(),
      this.#pallet
    )
    forwardMethods(this, () => attributeEditor, ['manipulateAttribute'])
  }

  bindMouseEvents() {
    return this.#mouseEventHandler.bind()
  }

  editProperties() {
    this.#propertyEditor.startEditing(this.#selectionModel.relation)
  }

  get isPalletShown() {
    return this.#pallet.visibility
  }

  relationClicked(event, relation) {
    if (event.ctrlKey || event.metaKey) {
      this.#selectionModel.relation.toggle(relation.id)
    } else {
      this.#selectionModel.selectRelation(relation.id)
    }
  }

  relationBollardClicked(entity) {
    entity.span.forceRenderGrid()
    this.#selectionModel.selectEntity(entity.id)
  }
}
