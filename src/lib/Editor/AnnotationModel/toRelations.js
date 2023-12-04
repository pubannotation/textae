export default function (annotationModel) {
  return annotationModel.relation.all.map((r) => {
    return {
      id: r.id,
      pred: r.typeName,
      subj: r.subj,
      obj: r.obj
    }
  })
}
