import _ from 'underscore'
import idFactory from '../../../../../idFactory'
import toStringOnlyThis from './toStringOnlyThis'

export default function(emitter) {
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
          let typeId = idFactory.makeTypeId(b.span, b.type), type = a.filter(function(type) {
            return type.id === typeId
          }), attributes = emitter.attribute.all()
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
