var getFromContainer = function(container, id) {
    return container[id]
  },
  addToContainer = function(container, id, object) {
    container[id] = object
    return object
  }

// Cash a div for dialog by self, because $('#dialog_id') cannot find exists div element.
// The first parameter of an createFunction must be id.
// A createFunction must return an object having a parameter 'id'.
module.exports = function(createFunction) {
  var cache = {},
    serachCache = _.partial(getFromContainer, cache),
    addCache = _.partial(addToContainer, cache),
    createAndCache = function(createFunction, params) {
      var object = createFunction(...params)
      return addCache(object.id, object)
    }

  return function(id, title, $content, options) {
    return serachCache(id) ||
      createAndCache(createFunction, arguments)
  }
}
