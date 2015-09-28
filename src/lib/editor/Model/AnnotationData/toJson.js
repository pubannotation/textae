var toDenotation = function(dataStore) {
    return dataStore.entity.all()
      .filter(function(entity) {
        // Span may be not exists, because crossing spans are not add to the dataStore.
        return dataStore.span.get(entity.span)
      })
      .map(function(entity) {
        var currentSpan = dataStore.span.get(entity.span)
        return {
          id: entity.id,
          span: {
            begin: currentSpan.begin,
            end: currentSpan.end
          },
          obj: entity.type
        }
      })
  },
  toRelation = function(dataStore) {
    return dataStore.relation.all().map(function(r) {
      return {
        id: r.id,
        pred: r.type,
        subj: r.subj,
        obj: r.obj
      }
    })
  },
  toJson = function(originalData, dataStore) {
    return _.extend({}, originalData, {
      denotations: toDenotation(dataStore),
      relations: toRelation(dataStore),
      modifications: dataStore.modification.all()
    })
  }

module.exports = toJson
