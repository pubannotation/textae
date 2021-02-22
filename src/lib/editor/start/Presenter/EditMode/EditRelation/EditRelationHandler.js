import DefaultHandler from '../DefaultHandler'
import EditRelationDialog from '../../../../../component/EditRelationDialog'

export default class EditHandler extends DefaultHandler {
  constructor(definitionContainer, commander, annotationData, selectionModel) {
    super('relation', definitionContainer, commander)

    this._annotationData = annotationData
    this._selectionModel = selectionModel
  }

  changeInstance(autocompletionWs) {
    if (this._selectionModel.relation.some) {
      const type = this._getSelectedType()
      new EditRelationDialog(type, this._definitionContainer, autocompletionWs)
        .open()
        .then((values) => this._labelChanged(values))
    }
  }

  jsPlumbConnectionClicked(jsPlumbConnection, event, relation) {
    if (event.originalEvent.ctrlKey || event.originalEvent.metaKey) {
      this._selectionModel.relation.add(relation.id)
    } else {
      this._selectionModel.selectRelation(relation.id)
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
