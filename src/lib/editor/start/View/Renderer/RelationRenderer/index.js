export default class RelationRenderer {
  constructor(annotationDataRelation) {
    this._annotationDataRelation = annotationDataRelation
  }

  remove(relation) {
    relation.destroyElement()
  }
}
