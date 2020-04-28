export default function(dataStore) {
  return dataStore.relation.all.map((r) => {
    return {
      id: r.id,
      pred: r.type.name,
      subj: r.subj,
      obj: r.obj
    }
  })
}
