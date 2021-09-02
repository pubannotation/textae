export default function (annotationData) {
  return annotationData.attribute.all.map((attribute) => {
    return {
      id: attribute.id,
      subj: attribute.subj,
      pred: attribute.pred,
      obj: attribute.obj
    }
  })
}
