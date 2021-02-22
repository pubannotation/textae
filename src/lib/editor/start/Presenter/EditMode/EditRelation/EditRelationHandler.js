import DefaultHandler from '../DefaultHandler'
import EditRelationDialog from '../../../../../component/EditRelationDialog'

export default class EditHandler extends DefaultHandler {
  constructor(definitionContainer, commander, annotationData, selectionModel) {
    super('relation', definitionContainer, commander)

    this._annotationData = annotationData
    this._selectionModel = selectionModel
  }

  changeLabelHandler(autocompletionWs) {
    if (this._selectionModel.relation.some) {
      const type = this._getSelectedType()
      new EditRelationDialog(type, this._definitionContainer, autocompletionWs)
        .open()
        .then((values) => this._done(values))
    }
  }

  jsPlumbConnectionClicked(jsPlumbConnection, event) {
    // Select or deselect relation.
    // This function is expected to be called when Relation-Edit-Mode.
    const { relationId } = jsPlumbConnection

    if (event.ctrlKey || event.metaKey) {
      this._selectionModel.relation.add(relationId)
    } else {
      this._selectionModel.selectRelation(relationId)
    }
  }

  selectAll(typeName) {
    this._selectionModel.relation.clear()
    for (const { id } of this._annotationData.relation.findByType(typeName)) {
      this._selectionModel.relation.add(id)
    }
  }

  manipulateAttribute() {}

  _getSelectedType() {
    const relation = this._selectionModel.relation.single

    if (relation) {
      return relation.typeName
    }

    return ''
  }
}
