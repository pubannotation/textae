export default class RelationRenderer {
  constructor(annotationDataRelation) {
    this._annotationDataRelation = annotationDataRelation
  }

  changeAll() {
    this._annotationDataRelation.all.map((relation) => {
      relation.renderElementAgain()
    })
  }

  remove(relation) {
    relation.destroyElement()
  }
}
