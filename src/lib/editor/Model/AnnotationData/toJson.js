export default function(dataStore) {
  return {
    denotations: toDenotation(dataStore),
    relations: toRelation(dataStore),
    modifications: dataStore.modification.all()
  }
}

function toDenotation(dataStore) {
  return dataStore.entity.all()
    // Span may be not exists, because crossing spans are not add to the dataStore.
    .filter((entity) => dataStore.span.get(entity.span))
    .map((entity) => {
      const currentSpan = dataStore.span.get(entity.span)

      return {
        id: entity.id,
        span: {
          begin: currentSpan.begin,
          end: currentSpan.end
        },
        obj: entity.type
      }
    })
}

function toRelation(dataStore) {
  return dataStore.relation.all().map((r) => {
    return {
      id: r.id,
      pred: r.type,
      subj: r.subj,
      obj: r.obj
    }
  })
}
