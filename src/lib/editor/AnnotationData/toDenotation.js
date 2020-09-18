export default function(dataStore) {
  return dataStore.entity.all.map((entity) => {
    const currentSpan = dataStore.span.get(entity.span)
    return {
      id: entity.id,
      span: {
        begin: currentSpan.begin,
        end: currentSpan.end
      },
      obj: entity.typeName
    }
  })
}
