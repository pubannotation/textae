import idFactory from '../../../idFactory'
import ModelContainer from './ModelContainer'
import {
  isBoundaryCrossingWithOtherSpans
}
from '../parseAnnotation/validateAnnotation'
import _ from 'underscore'

export default class extends ModelContainer {
  constructor(editor, emitter, paragraph) {
    super(emitter, 'span', (denotations) => mappingFunction(editor, emitter, paragraph, denotations))
    this.editor = editor
    this.emitter = emitter
    this.paragraph = paragraph
    this.spanTopLevel = []
  }

  updateSpanTree() {
    // Sort id of spans by the position.
    const sortedSpans = super.all().sort(spanComparator)

    // the spanTree has parent-child structure.
    const spanTree = []

    sortedSpans
      .map((span, index, array) => Object.assign(span, {
          // Reset parent
          parent: null,
          // Reset children
          children: [],
          // Order by position
          left: index !== 0 ? array[index - 1] : null,
          right: index !== array.length - 1 ? array[index + 1] : null,
        })
      )
      .forEach((span) => {
        if (span.left) {
          const parent = getParet(this.editor, this, span.left, span)
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
      return this.map((span) => span.toString()).join("\n")
    }

    //  console.log(spanTree.toString())

    return spanTree
  }

  // expected span is like { "begin": 19, "end": 49 }
  add(span) {
    if (span)
      return super.add(toSpanModel(this.editor, this.emitter, this.paragraph, span), () => {
        this.spanTopLevel = this.updateSpanTree()
      })
    throw new Error('span is undefined.')
  }
  addSource(spans) {
    super.addSource(spans)
    this.spanTopLevel = this.updateSpanTree()
  }
  get(spanId) {
    return super.get(spanId)
  }
  range(firstId, secondId) {
    let first = super.get(firstId)
    let second = super.get(secondId)

    // switch if seconfId before firstId
    if (spanComparator(first, second) > 0) {
      let temp = first
      first = second
      second = temp
    }

    return super.all()
      .filter((span) => first.begin <= span.begin && span.end <= second.end)
      .map((span) => span.id)
  }
  topLevel() {
    return this.spanTopLevel
  }
  multiEntities() {
    return super.all()
      .filter(function(span) {
        let multiEntitiesTypes = span.getTypes().filter(function(type) {
          return type.entities.length > 1
        })

        return multiEntitiesTypes.length > 0
      })
  }
  remove(id) {
    const span = super.remove(id)
    this.spanTopLevel = this.updateSpanTree()
    return span
  }
  clear() {
    super.clear()
    this.spanTopLevel = []
  }
  move(id, newSpan) {
    const oldOne = super.remove(id)
    const newOne = super.add(toSpanModel(this.editor, this.emitter, this.paragraph, newSpan), (newOne) => {
      this.spanTopLevel = this.updateSpanTree()

      // Update entities before 'span.add' event, because span.getTypes depends on entities and used to render span.
      this.emitter.entity.all()
      .filter((entity) => {
        return id === entity.span
      })
      .forEach((entity) => entity.span = newOne.id)
    })

    this.emitter.emit('span.move', {oldId: id, newId: newOne.id})

    return [{
      begin: oldOne.begin,
      end: oldOne.end
    }, newOne.id]
  }
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

function makeSpanExtension(emitter) {
  return {
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
            type = a.filter(function(type) {
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
}

function toSpanModel(editor, emitter, paragraph, span) {
  return Object.assign({},
    span, {
      id: idFactory.makeSpanId(editor, span),
      paragraph: paragraph.getBelongingTo(span),
    },
    makeSpanExtension(emitter))
}

function mappingFunction(editor, emitter, paragraph, denotations) {
  denotations = denotations || []
  return denotations
    .map((entity) => entity.span)
    .map((span) => toSpanModel(editor, emitter, paragraph, span))
    .filter((span, index, array) => !isBoundaryCrossingWithOtherSpans(
      array.slice(0, index - 1),
      span
    ))
}

function adopt(parent, span) {
  parent.children.push(span)
  span.parent = parent
}

function getParet(editor, spanContainer, parent, span) {
  if (isChildOf(editor, spanContainer, span, parent)) {
    return parent
  } else if (parent.parent) {
    return getParet(editor, spanContainer, parent.parent, span)
  } else {
    return null
  }
}

function spanComparator(a, b) {
  return a.begin - b.begin || b.end - a.end
}
