import NORMAL_ARROW from './NORMAL_ARROW'

const HOVER_ARROW = {
  width: 14,
  length: 18,
  location: 1,
  id: 'hover-arrow'
}

export default class {
  constructor(jsPlumbConnection) {
    console.assert(jsPlumbConnection, 'jsPlumbConncetion is necessary.')
    this._jsPlumbConnection = jsPlumbConnection
  }

  showBigArrow() {
    if (this._jsPlumbConnection.getOverlay(HOVER_ARROW.id)) {
      return
    }

    // Remove a normal arrow and add a new big arrow.
    // Because an arrow is out of position if hideOverlay and showOverlay is used.
    this._jsPlumbConnection.removeOverlay(NORMAL_ARROW.id)
    this._jsPlumbConnection.addOverlay(['Arrow', HOVER_ARROW])
  }

  hideBigArrow() {
    if (this._jsPlumbConnection.getOverlay(NORMAL_ARROW.id)) {
      return
    }

    this._jsPlumbConnection.removeOverlay(HOVER_ARROW.id)
    this._jsPlumbConnection.addOverlay(['Arrow', NORMAL_ARROW])
  }
}
