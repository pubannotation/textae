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

  get relation() {
    return this._relation
  }

  select() {
    this.destroy()
    this._create(arrowConfig.hover, 'ui-selected')
  }

  deselect() {
    this.recreate()
  }

  pointUp() {
    if (!this._isSelected) {
      this._addClass('hover')
      this._showBigArrow()
    }
  }

  pointDown() {
    if (!this._isSelected) {
      this._removeClass('hover')
      this._hideBigArrow()
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

  _addClass(className) {
    this._jsPlumbConnection.addClass(className)
  }

  _removeClass(className) {
    this._jsPlumbConnection.removeClass(className)
  }

  _bind(event, eventHandler) {
    this._jsPlumbConnection.bind(event, eventHandler)
  }

  get _isSelected() {
    return this._jsPlumbConnection.connector.canvas.classList.contains(
      'ui-selected'
    )
  }

  _showBigArrow() {
    if (this._jsPlumbConnection.getOverlay(arrowConfig.hover.id)) {
      return
    }

    // Remove a normal arrow and add a new big arrow.
    // Because an arrow is out of position if hideOverlay and showOverlay is used.
    this._jsPlumbConnection.removeOverlay(arrowConfig.normal.id)
    this._jsPlumbConnection.addOverlay(['Arrow', arrowConfig.hover])
  }

  _hideBigArrow() {
    if (this._jsPlumbConnection.getOverlay(arrowConfig.normal.id)) {
      return
    }

    this._jsPlumbConnection.removeOverlay(arrowConfig.hover.id)
    this._jsPlumbConnection.addOverlay(['Arrow', arrowConfig.normal])
  }
}
