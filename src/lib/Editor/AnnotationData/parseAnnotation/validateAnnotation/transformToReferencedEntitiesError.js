export default function (attributeSubj, relationObj, relationSubj) {
  // Combine rejects for referenced object errer.
  // Mark the column you want to highlight.
  return attributeSubj
    .map((attribute) => {
      attribute.sourceProperty = 'attributes'
      attribute.alertSubj = true
      return attribute
    })
    .concat(
      relationObj.map((relation) => {
        relation.sourceProperty = 'relations'
        relation.alertObj = true
        return relation
      })
    )
    .concat(
      relationSubj.map((relation) => {
        relation.sourceProperty = 'relations'
        relation.alertSubj = true
        return relation
      })
    )
}
