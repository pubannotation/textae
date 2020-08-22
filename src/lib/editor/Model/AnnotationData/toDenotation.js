export default function(dataStore) {
  return (
    dataStore.entity.all
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
          obj: entity.typeName
        }
      })
  )
}
