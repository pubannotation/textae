import getUri from '../../../getUri'
import getEntityEndpoint from './getEntityEndpoint'
import SVGConnection from './SVGConnection'

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

  isSameType(typeName) {
    return this.typeName === typeName
  }

  getColor(definitionContainer) {
    return definitionContainer.getColor(this.typeName)
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

  select() {
    if (this._connect) this._connect.select()
  }

  deselect() {
    if (this._connect) this._connect.deselect()
  }

  // Relationships are rendered asynchronously.
  // You can create a relationship fast
  // by holding down the control or command key
  // and hitting the object entity continuously.
  // When you do this, a mouse-out event may occur
  // before the rendering of the relationship is complete.
  // You need to make sure that the relationship has been rendered.
  pointUp() {
    if (this.isRendered) {
      this._connect.pointUp()
    }
  }

  pointDown() {
    if (this.isRendered) {
      this._connect.pointDown()
    }
  }

  renderElement(editor, annotationData, typeDefinition) {
    const connection = new SVGConnection(
      this,
      annotationData.namespace,
      typeDefinition.relation,
      (_, event) =>
        editor.eventEmitter.emit(
          'textae-event.editor.js-plumb-connection.click',
          event,
          this
        ),
      editor
    )

    this._connect = connection
  }

  renderElementAgain() {
    this._connect.recreate()
  }

  destroyElement() {
    if (!this.isRendered) {
      return
    }

    this._connect.destroy()
    this._connect = undefined
  }

  getLink(namespace, definitionContainer) {
    return getUri(
      namespace,
      this.typeName,
      definitionContainer.getUri(this.typeName)
    )
  }
}
