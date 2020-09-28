import resetArrows from './resetArrows'
import showBigArrow from './showBigArrow'
import hideBigArrow from './hideBigArrow'

export default class {
  constructor(jsPlumbConnection) {
    console.assert(jsPlumbConnection, 'jsPlumbConncetion is necessary.')
    this._jsPlumbConnection = jsPlumbConnection
  }

  showBigArrow() {
    showBigArrow(this._jsPlumbConnection)
  }

  hideBigArrow() {
    hideBigArrow(this._jsPlumbConnection)
  }

  resetArrows() {
    resetArrows(this._jsPlumbConnection)
  }
}
