import arrowConfig from '../../../../arrowConfig'
import connectorStrokeStyle from './connectorStrokeStyle'
import createJsPlumbConnecttion from './createJsPlumbConnecttion'

export default class JsPlumbConnectionWrapper {
  constructor(
    jsPlumbInstance,
    relation,
    annotationData,
    typeDefinition,
    onClick
  ) {
    this._relationId = relation.id
    this._annotationData = annotationData
    this._typeDefinition = typeDefinition
    this._jsPlumbConnection = createJsPlumbConnecttion(
      jsPlumbInstance,
      relation,
      annotationData,
      typeDefinition
    )

    // Bind a jsPlumbConnection event.
    this._bind('click', onClick)
    this._bind('mouseenter', () => this.pointup())
    this._bind('mouseexit', () => this.pointdown())
  }

  _addClass(className) {
    this._jsPlumbConnection.addClass(className)
    this._labelOverlay.addClass(className)
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

  deselect() {
    this.setColor()
    this.removeClass('ui-selected')
    this._hideBigArrow()
  }

  detach() {
    this._jsPlumbConnection._jsPlumb.instance.detach(this._jsPlumbConnection)
  }

  get link() {
    return this._labelOverlay.canvas.querySelector('a')
  }

  get relationId() {
    return this._jsPlumbConnection.getParameter('id')
  }

  pointdown() {
    if (!this._isSelected) {
      this.setColor()
      this.removeClass('hover')
      this._hideBigArrow()
    }
  }

  pointup() {
    if (!this._isSelected) {
      this.setColor()
      this._addClass('hover')
      this._showBigArrow()
    }
  }

  select() {
    this.setColor()
    this._addClass('ui-selected')
    this.removeClass('hover')
    this._showBigArrow()
  }

  setColor() {
    const strokeStyle = connectorStrokeStyle(
      this._annotationData,
      this._typeDefinition,
      this._relationId
    )

    this._jsPlumbConnection.setPaintStyle(strokeStyle)
  }

  set label(lableString) {
    this._labelOverlay.setLabel(lableString)
  }

  removeClass(className) {
    this._jsPlumbConnection.removeClass(className)
    this._labelOverlay.removeClass(className)
  }

  resetCurviness(curviness) {
    // Set changed values only.
    if (this._jsPlumbConnection.connector.getCurviness() !== curviness) {
      this._jsPlumbConnection.setConnector([
        'Bezier',
        {
          curviness
        }
      ])

      this._resetArrow()
    }
  }

  // Private APIs
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
