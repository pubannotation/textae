import determineCurviness from '../../../determineCurviness'
import getEntityEndpoint from './getEntityEndpoint'

export default class RelationModel {
  constructor(editor, { id, pred, subj, obj }) {
    this._editor = editor
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

  get sourceEndpoint() {
    return getEntityEndpoint(this._editor, this.subj)
  }

  get targetEndpoint() {
    return getEntityEndpoint(this._editor, this.obj)
  }

  get isRendered() {
    return this._connect !== undefined
  }

  get jsPlumbConnection() {
    if (!this._connect) {
      throw new Error(`no connect for id: ${this._id}`)
    }

    return this._connect
  }

  set jsPlumbConnection(val) {
    this._connect = val
  }

  deleteJsPlumbConnection() {
    this._connect.detach()
    this._connect = undefined
  }

  select() {
    setTimeout(() => {
      if (this._connect) this._connect.select()
    }, 150)
  }

  deselect() {
    setTimeout(() => {
      if (this._connect) this._connect.deselect()
    }, 150)
  }

  resetCurviness() {
    const curviness = determineCurviness(
      this.sourceEndpoint,
      this.targetEndpoint
    )

    this.jsPlumbConnection.resetCurviness(curviness)
  }
}
