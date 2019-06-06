var typeCounter = [],
  makeTypePrefix = function(editorId, prefix) {
    return editorId + '__' + prefix
  },
  makeId = function(editorId, prefix, id) {
    return makeTypePrefix(editorId, prefix) + id
  },
  spanDelimiter = '_'

module.exports = {
  // The ID of spans has editorId and begin and end, like 'editor1__S0_15'.
  makeSpanId: function(editor, span) {
    var spanPrefix = makeTypePrefix(editor.editorId, 'S')
    return spanPrefix + span.begin + spanDelimiter + span.end
  },
  // The ID of type has number of type.
  // This IDs are used for id of DOM element and css selector for jQuery.
  // But types are inputed by users and may have `!"#$%&'()*+,./:;<=>?@[\]^`{|}~` which can not be used for css selecor.
  makeTypeId: function(spanId, type) {
    const hash = hashString(String(type))

    if (typeCounter.indexOf(hash) === -1) {
      typeCounter.push(hash)
    }
    return spanId + '-' + typeCounter.indexOf(hash)
  },
  makeEntityDomId: function(editor, id) {
    // Exclude : and . from a dom id to use for ID selector.
    return makeId(editor.editorId, 'E', id.replace(/[:¥.]/g, ''))
  },
  makeAttributeDomId: function(editor, id) {
    // Exclude : and . from a dom id to use for ID selector.
    return makeId(editor.editorId, 'A', id.replace(/[:¥.]/g, ''))
  },
  makeParagraphId: function(editor, id) {
    return makeId(editor.editorId, 'P', id)
  }
}

// see: https://lowrey.me/implementing-javas-string-hashcode-in-javascript/
function hashString(str) {
  let hash = 0

  for (let i = 0; i < str.length; i++) {
    hash += Math.pow(str.charCodeAt(i) * 31, str.length - i)
    hash &= hash // Convert to 32bit integer
  }

  return hash
}
