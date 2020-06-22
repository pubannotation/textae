export default function(reject) {
  // Combine rejects for referenced object errer.
  // Mark the column you want to highlight.
  reject.referencedItems = reject.attributeSubj
    .map((attribute) => {
      attribute.alertSubj = true
      return attribute
    })
    .concat(
      reject.relationObj.map((relation) => {
        relation.alertObj = true
        return relation
      })
    )
    .concat(
      reject.relationSubj.map((relation) => {
        relation.alertSubj = true
        return relation
      })
    )

  return reject
}
