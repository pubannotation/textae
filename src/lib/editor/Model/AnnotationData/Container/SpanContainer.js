import idFactory from '../../../idFactory'
import ModelContainer from './ModelContainer'
import {
  isBoundaryCrossingWithOtherSpans
}
from '../parseAnnotation/validateAnnotation'
import $ from 'jquery'
import _ from 'underscore'

export default function(editor, emitter, paragraph) {
  let toSpanModel = function() {
      let spanExtension = {
        // for debug. print myself only.
        toStringOnlyThis: function() {
          return toStringOnlyThis(this, emitter)
        },
        // for debug. print with children.
        toString: function(depth) {
          depth = depth || 1 // default depth is 1

          let childrenString = this.children && this.children.length > 0 ?
            "\n" + this.children.map(function(child) {
              return new Array(depth + 1).join("\t") + child.toString(depth + 1)
            }).join("\n") : ""

          return this.toStringOnlyThis() + childrenString
        },
        // Get online for update is not grantieed.
        getTypes: function() {
          let spanId = this.id
          // Return an array of type like { id : "editor2__S1741_1755-1", name: "Negative_regulation", entities: ["E16", "E17"], attributes: ["A16", "A17"] }.
          return emitter.entity.all()
            .filter(function(entity) {
              return spanId === entity.span
            })
            .reduce(function(a, b) {
              let typeId = idFactory.makeTypeId(b.span, b.type),
                type = a.filter(function (type) {
                  return type.id === typeId
                }),
                attributes = emitter.attribute.all()
                  .filter(function(attribute) {
                    return attribute.subj === b.id
                  })
                  .map(function(attribute) {
                    return attribute.id
                  })

              if (type.length > 0) {
                type[0].entities.push(b.id)
              } else {
                a.push({
                  id: typeId,
                  name: b.type,
                  entities: [b.id],
                  attributes: attributes
                })
              }
              return a
            }, [])
        },
        getEntities: function() {
          return _.flatten(this.getTypes().map(function(type) {
            return type.entities
          }))
        },
        getAttributes: function() {
          return _.flatten(this.getTypes().map(function(type) {
            return type.attributes
          }))
        }
      }

      return function(span) {
        return $.extend({},
          span, {
            id: idFactory.makeSpanId(editor, span),
            paragraph: paragraph.getBelongingTo(span),
          },
          spanExtension)
      }
    }(),
    mappingFunction = function(denotations) {
      denotations = denotations || []
      return denotations
        .map((entity) => entity.span)
        .map(toSpanModel)
        .filter((span, index, array) => !isBoundaryCrossingWithOtherSpans(
          array.slice(0, index - 1),
          span
        ))
    },
    spanContainer = new ModelContainer(emitter, 'span', mappingFunction),
    spanTopLevel = [],
    adopt = function(parent, span) {
      parent.children.push(span)
      span.parent = parent
    },
    getParet = function(parent, span) {
      if (isChildOf(editor, spanContainer, span, parent)) {
        return parent
      } else if (parent.parent) {
        return getParet(parent.parent, span)
      } else {
        return null
      }
    },
    updateSpanTree = function() {
      // Sort id of spans by the position.
      let sortedSpans = spanContainer.all().sort(spanComparator)

      // the spanTree has parent-child structure.
      let spanTree = []

      sortedSpans
        .map(function(span, index, array) {
          return $.extend(span, {
            // Reset parent
            parent: null,
            // Reset children
            children: [],
            // Order by position
            left: index !== 0 ? array[index - 1] : null,
            right: index !== array.length - 1 ? array[index + 1] : null,
          })
        })
        .forEach(function(span) {
          if (span.left) {
            let parent = getParet(span.left, span)
            if (parent) {
              adopt(parent, span)
            } else {
              spanTree.push(span)
            }
          } else {
            spanTree.push(span)
          }
        })

      // this for debug.
      spanTree.toString = function() {
        return this.map(function(span) {
          return span.toString()
        }).join("\n")
      }

      //  console.log(spanTree.toString())

      spanTopLevel = spanTree
    },
    spanComparator = function(a, b) {
      return a.begin - b.begin || b.end - a.end
    },
    api = {

      // expected span is like { "begin": 19, "end": 49 }
      add: function(span) {
        if (span)
          return spanContainer.add(toSpanModel(span), updateSpanTree)
        throw new Error('span is undefined.')
      },
      addSource: function(spans) {
        spanContainer.addSource(spans)
        updateSpanTree()
      },
      get: function(spanId) {
        return spanContainer.get(spanId)
      },
      all: spanContainer.all,
      range: function(firstId, secondId) {
        let first = spanContainer.get(firstId)
        let second = spanContainer.get(secondId)

        // switch if seconfId before firstId
        if (spanComparator(first, second) > 0) {
          let temp = first
          first = second
          second = temp
        }

        return spanContainer.all()
          .filter((span) => first.begin <= span.begin && span.end <= second.end)
          .map((span) => span.id)
      },
      topLevel: function() {
        return spanTopLevel
      },
      multiEntities: function() {
        return spanContainer.all()
          .filter(function(span) {
            let multiEntitiesTypes = span.getTypes().filter(function(type) {
              return type.entities.length > 1
            })

            return multiEntitiesTypes.length > 0
          })
      },
      remove: (id) => {
        let span = spanContainer.remove(id)
        updateSpanTree()
        return span
      },
      clear: function() {
        spanContainer.clear()
        spanTopLevel = []
      }
    }

  return api
}

function isChildOf(editor, spanContainer, span, maybeParent) {
  if (!maybeParent) return false

  let id = idFactory.makeSpanId(editor, maybeParent)
  if (!spanContainer.get(id)) throw new Error('maybeParent is removed. ' + maybeParent.toStringOnlyThis())

  return maybeParent.begin <= span.begin && span.end <= maybeParent.end
}

function toStringOnlyThis(span, emitter) {
  return "span " + span.begin + ":" + span.end + ":" + emitter.sourceDoc.substring(span.begin, span.end)
}
