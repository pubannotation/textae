export default function (attributes, node) {
  return (
    attributes.filter(
      (a) => a.subj === node.subj && a.pred === node.pred && a.obj === node.obj
    ).length === 1
  )
}
