export default function(reject) {
  // Combine rejects for referenced object errer.
  reject.referencedItems = reject.relationObj
    .map((relation) => {
      relation.alertObj = true
      return relation
    })
    .concat(
      reject.relationSubj.map((relation) => {
        relation.alertSubj = true
        return relation
      })
    )
    .concat(
      reject.modification.map((modification) => {
        modification.subj = '-'
        modification.alertObj = true
        return modification
      })
    )

  return reject
}
