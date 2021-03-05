export default class RelationRenderer {
  constructor(annotationData) {
    this._annotationData = annotationData
  }

  arrangePositionAll() {
    for (const relation of this._annotationData.relation.all) {
      relation.renderElementAgain()
    }
  }

  change(relation) {
    relation.renderElementAgain()
  }

  changeType(typeName) {
    for (const relation of this._annotationData.relation.all) {
      // If the type name ends in a wildcard, look for the DOMs to update with a forward match.
      if (
        relation.typeName === typeName ||
        (typeName.lastIndexOf('*') === typeName.length - 1 &&
          relation.typeName.indexOf(typeName.slice(0, -1) === 0))
      ) {
        relation.renderElementAgain()
      }
    }
  }

  changeAll() {
    this._annotationData.relation.all.map((relation) => {
      relation.renderElementAgain()
    })
  }

  remove(relation) {
    relation.destroyElement()
  }
}
