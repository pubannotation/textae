export default function(dataStore) {
  return dataStore.attribute.all.map((attribute) => {
    return {
      id: attribute.id,
      subj: attribute.subj,
      pred: attribute.pred,
      obj: attribute.obj
    }
  })
}
