export default class RelationModel {
  constructor({ id, pred, subj, obj }) {
    this._id = id
    this.typeName = pred
    this._subj = subj
    this._obj = obj
  }

  get id() {
    return this._id
  }

  set id(val) {
    this._id = val
  }

  get typeName() {
    return this._typeName
  }

  set typeName(val) {
    // Replace null to 'null' if type is null and undefined too.
    this._typeName = String(val)
  }

  get subj() {
    return this._subj
  }

  get obj() {
    return this._obj
  }

  get isRendered() {
    return this.render === undefined
  }

  get jsPlumbConnection() {
    if (!this._connect) {
      throw new Error(`no connect for id: ${this._id}`)
    }

    return this._connect
  }

  set jsPlumbConnection(val) {
    console.assert(
      val instanceof jsPlumb.Connection,
      'A connect must be an instance of jsPlumb.Connection!'
    )

    this._connect = val
  }

  deleteJsPlumbConnection(jsPlumbInstance) {
    jsPlumbInstance.detach(this._connect)

    // Set the flag dead already to delay selection.
    this._connect.dead = true

    // Set a flag to extract relations from target to move relations asynchronously.
    this.removed = true
  }
}
