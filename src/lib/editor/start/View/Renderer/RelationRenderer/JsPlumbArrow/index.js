import resetArrows from './resetArrows'
import showBigArrow from './showBigArrow'
import hideBigArrow from './hideBigArrow'

export default class {
  constructor(jsPlumbConnection) {
    console.assert(jsPlumbConnection, 'jsPlumbConncetion is necessary.')
    this._jsPlumConnection = jsPlumbConnection
  }

  showBigArrow() {
    showBigArrow(this._jsPlumConnection)
  }

  hideBigArrow() {
    hideBigArrow(this._jsPlumConnection)
  }

  resetArrows() {
    resetArrows(this._jsPlumConnection)
  }
}
