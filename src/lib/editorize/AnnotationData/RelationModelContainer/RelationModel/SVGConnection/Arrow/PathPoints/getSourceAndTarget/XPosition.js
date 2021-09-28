export default class XPosition {
  constructor(anchorPositions, type, anchor) {
    this.anchor = anchor
    this.x = anchorPositions[type][anchor]
  }
}
