import arrowConfig from '../../../../arrowConfig'
import createJsPlumbConnecttion from './createJsPlumbConnecttion'

export default class JsPlumbConnectionWrapper {
  constructor(
    jsPlumbInstance,
    relation,
    namespace,
    definitionContainer,
    onClick,
    annotationBox
  ) {
    this._jsPlumbInstance = jsPlumbInstance
    this._relation = relation
    this._namespace = namespace
    this._definitionContainer = definitionContainer
    this._onClick = onClick

    this._create(arrowConfig.normal)
  }

  destroy() {
    this._jsPlumbConnection._jsPlumb.instance.detach(this._jsPlumbConnection)
  }

  select() {
    this._isSelected = true
    this.destroy()
    this._create(arrowConfig.hover, 'ui-selected')
  }

  deselect() {
    this._isSelected = false
    this.recreate()
  }

  pointUp() {
    if (!this._isSelected && !this._isHovered) {
      this._isHovered = true
      this._jsPlumbConnection.addClass('hover')

      // Remove a normal arrow and add a new big arrow.
      // Because an arrow is out of position if hideOverlay and showOverlay is used.
      this._jsPlumbConnection.removeOverlay(arrowConfig.normal.id)
      this._jsPlumbConnection.addOverlay(['Arrow', arrowConfig.hover])
    }
  }

  pointDown() {
    if (!this._isSelected) {
      this._isHovered = false
      this.recreate()
    }
  }

  recreate() {
    this.destroy()
    this._create(arrowConfig.normal)
  }

  // Private APIs
  _create(arrow, className = '') {
    this._jsPlumbConnection = createJsPlumbConnecttion(
      this._jsPlumbInstance,
      this._relation,
      this._namespace,
      this._definitionContainer,
      arrow,
      className
    )

    // Bind a jsPlumbConnection event.
    this._bind('click', this._onClick)
    this._bind('mouseenter', () => this.pointUp())
    this._bind('mouseexit', () => this.pointDown())
  }

  _bind(event, eventHandler) {
    this._jsPlumbConnection.bind(event, eventHandler)
  }
}
