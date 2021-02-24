import arrowConfig from '../../../../arrowConfig'
import toDisplayName from '../toDisplayName'
import converseHEXinotRGBA from './converseHEXinotRGBA'
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
    this._jsPlumbConnection = createJsPlumbConnecttion(
      jsPlumbInstance,
      relation,
      namespace,
      definitionContainer
    )

    // Bind a jsPlumbConnection event.
    this._bind('click', onClick)
    this._bind('mouseenter', () => this.pointup())
    this._bind('mouseexit', () => this.pointdown())
  }

  deselect() {
    this.resetColor()
    this._removeClass('ui-selected')
    this._hideBigArrow()
  }

  destroy() {
    this._jsPlumbConnection._jsPlumb.instance.detach(this._jsPlumbConnection)
  }

  get relation() {
    return this._relation
  }

  pointdown() {
    if (!this._isSelected) {
      this.resetColor()
      this._removeClass('hover')
      this._hideBigArrow()
    }
  }

  pointup() {
    if (!this._isSelected) {
      this.resetColor()
      this._addClass('hover')
      this._showBigArrow()
    }
  }

  select() {
    this.resetColor()
    this._addClass('ui-selected')
    this._removeClass('hover')
    this._showBigArrow()
  }

  resetColor() {
    this._jsPlumbConnection.setPaintStyle({
      strokeStyle: converseHEXinotRGBA(
        this._relation.getColor(this._definitionContainer)
      )
    })
  }

  resetLabel() {
    this._labelOverlay.setLabel(
      toDisplayName(this._relation, this._namespace, this._definitionContainer)
    )
  }

  resetCurviness() {
    this.destroy()
    this._jsPlumbConnection = createJsPlumbConnecttion(
      this._jsPlumbInstance,
      this._relation,
      this._namespace,
      this._definitionContainer
    )

    // Bind a jsPlumbConnection event.
    this._bind('click', this._onClick)
    this._bind('mouseenter', () => this.pointup())
    this._bind('mouseexit', () => this.pointdown())
  }

  // Private APIs
  _addClass(className) {
    this._jsPlumbConnection.addClass(className)
    this._labelOverlay.addClass(className)
  }

  _removeClass(className) {
    this._jsPlumbConnection.removeClass(className)
    this._labelOverlay.removeClass(className)
  }

  _bind(event, eventHandler) {
    this._jsPlumbConnection.bind(event, eventHandler)
    // In jsPlumb, when you draw a connection for the first time,
    // clicking on a label fires a connection click event.
    // But after resizing and redrawing a connection,
    // the connection click event won't fire when you click on a label.
    // So we will bind the label event in addition to the connection.
    this._labelOverlay.bind(event, eventHandler)
  }

  get _arrowOverlays() {
    return this._jsPlumbConnection
      .getOverlays()
      .filter((overlay) => overlay.type === 'Arrow')
  }

  get _isSelected() {
    return this._jsPlumbConnection.connector.canvas.classList.contains(
      'ui-selected'
    )
  }

  get _labelOverlay() {
    // Find the label overlay by self,
    // because the function 'getLabelOverlays' returns no label overlay.
    const labelOverlay = this._jsPlumbConnection.getOverlay(
      'textae-relation-label'
    )

    if (!labelOverlay) {
      throw new Error('no label overlay')
    }

    return labelOverlay
  }

  _hideBigArrow() {
    if (this._jsPlumbConnection.getOverlay(arrowConfig.normal.id)) {
      return
    }

    this._jsPlumbConnection.removeOverlay(arrowConfig.hover.id)
    this._jsPlumbConnection.addOverlay(['Arrow', arrowConfig.normal])
  }

  // Re-set arrow because it is disappered when setConnector is called.
  _resetArrow() {
    for (const overlay of this._arrowOverlays) {
      this._resetOverlay(overlay)
    }
  }

  _resetOverlay(overlay) {
    this._jsPlumbConnection.removeOverlay(overlay.id)
    this._jsPlumbConnection.addOverlay([
      'Arrow',
      {
        id: overlay.id,
        width: overlay.width,
        length: overlay.length,
        location: overlay.loc
      }
    ])
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
}
