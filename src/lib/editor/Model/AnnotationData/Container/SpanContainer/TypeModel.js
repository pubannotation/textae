export default class {
  constructor(name, id = null, entity = null) {
    this.name = name
    this.id = id

    if (entity) {
      this.entities = [entity]
    }
  }
}
