import getNextId from './getNextId'

var ERROR_MESSAGE = 'Set the mappingFunction by the constructor to use the method "ModelContainer.setSource".'

module.exports = function(emitter, prefix, mappingFunction, idPrefix) {
  var contaier = {},
    getIds = function() {
      return Object.keys(contaier)
    },
    getNewId = _.partial(getNextId, idPrefix ? idPrefix : prefix.charAt(0).toUpperCase()),
    add = function(model) {
      // Overwrite to revert
      model.id = model.id || getNewId(getIds())
      contaier[model.id] = model
      return model
    },
    concat = function(collection) {
      if (!collection) return

      // Move medols without id behind others, to prevet id duplication generated and exists.
      collection.sort(function(a, b) {
        if (!a.id) return 1
        if (!b.id) return -1
        if (a.id < b.id) return -1
        if (a.id > b.id) return 1

        return 0
      })

      collection.forEach(add)
    },
    get = function(id) {
      return contaier[id]
    },
    all = function() {
      return _.map(contaier, _.identity)
    },
    clear = function() {
      contaier = {}
    }

  return {
    name: prefix,
    addSource: function(source) {
      if (!_.isFunction(mappingFunction)) {
        throw new Error(ERROR_MESSAGE)
      }

      concat(mappingFunction(source))
    },
    // The doAfter is avoked before a event emitted.
    add: function(model, doAfter) {
      var newModel = add(model)
      if (_.isFunction(doAfter)) doAfter()

      emitter.emit(prefix + '.add', newModel)
      return newModel
    },
    get: get,
    all: all,
    some: function() {
      return _.some(contaier)
    },
    types: function() {
      return all().map(function(model) {
        return model.type
      })
    },
    changeType: function(id, newType) {
      var model = get(id)
      model.type = newType
      emitter.emit(prefix + '.change', model)
      return model
    },
    remove: function(id) {
      var model = contaier[id]
      if (model) {
        delete contaier[id]
        emitter.emit(prefix + '.remove', model)
      }
      return model
    },
    clear: clear
  }
}
