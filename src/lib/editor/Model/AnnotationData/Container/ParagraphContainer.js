import _ from 'underscore'

var idFactory = require('../../../idFactory'),
  ModelContainer = require('./ModelContainer')

module.exports = function(editor, emitter) {
  var mappingFunction = function(sourceDoc) {
      sourceDoc = sourceDoc || []
      var textLengthBeforeThisParagraph = 0

      return sourceDoc.split("\n")
        .map(function(p, index) {
          var ret = {
            id: idFactory.makeParagraphId(editor, index),
            begin: textLengthBeforeThisParagraph,
            end: textLengthBeforeThisParagraph + p.length,
            text: p,
            order: index
          }

          textLengthBeforeThisParagraph += p.length + 1
          return ret
        })
    },
    contaier = new ModelContainer(emitter, 'paragraph', mappingFunction),
    originAll = contaier.all,
    api = _.extend(contaier, {
      // get the paragraph that span is belong to.
      getBelongingTo: function(span) {
        var match = contaier.all().filter(function(p) {
          return span.begin >= p.begin && span.end <= p.end
        })

        if (match.length === 0) {
          throw new Error('span should belong to any paragraph.')
        } else {
          return match[0]
        }
      },
      all: function() {
        let paragraphs = originAll()

        // The order is important to render.
        paragraphs.sort((a, b) => {
          if (a.order < b.order) {
            return -1
          }

          if (a.order > b.order) {
            return 1
          }

          return 0
        })

        return paragraphs
      }
    })

  return api
}
