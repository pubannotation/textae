import idFactory from '../../../../../idFactory'
import toStringOnlyThis from './toStringOnlyThis'

export default function(emitter) {
  return {
    // for debug. print myself only.
    toStringOnlyThis() {
      return toStringOnlyThis(this, emitter)
    },
    // for debug. print with children.
    toString(depth) {
      depth = depth || 1 // default depth is 1

      const childrenString = this.children && this.children.length > 0 ?
        "\n" + this.children.map(function(child) {
          return new Array(depth + 1).join("\t") + child.toString(depth + 1)
        }).join("\n") : ""

      return this.toStringOnlyThis() + childrenString
    },
    // Get online for update is not grantieed.
    getTypes() {
      const spanId = this.id

      // Return an array of type like { id : "editor2__S1741_1755-1", name: "Negative_regulation", entities: ["E16", "E17"], attributes: ["A16", "A17"] }.
      return emitter.entity.all()
        .filter((entity) => spanId === entity.span)
        .reduce((array, entity) => {
          const id = idFactory.makeTypeId(entity)

          const type = array.filter((type) => type.id === id)

          const attributes = emitter.attribute.all()
            .filter((attribute) => attribute.subj === entity.id)
            .map((attribute) => attribute.id)

          if (type.length > 0) {
            type[0].entities.push(entity.id)
          } else {
            array.push({
              id,
              name: entity.type,
              entities: [entity.id],
              attributes
            })
          }

          return array
        }, [])
    },
    getEntities() {
      return this.getTypes()
        .map((type) => type.entities)
        .reduce((prev, current) => prev.concat(current), [])
    },
    getAttributes() {
      return this.getTypes()
        .map((type) => type.attributes)
        .reduce((prev, current) => prev.concat(current), [])
    }
  }
}
