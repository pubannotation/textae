import getLabelOverlay from '../../../../../../../getLabelOverlay'
import connectorStrokeStyle from '../../../../connectorStrokeStyle'
import hasClass from './hasClass'
import showBigArrow from './showBigArrow'
import hideBigArrow from './hideBigArrow'

export default class {
  constructor(annotationData, typeDefinition, jsPlumbConnection, relationId) {
    this._annotationData = annotationData
    this._typeDefinition = typeDefinition
    this._jsPlumbConnection = jsPlumbConnection
    this._relationId = relationId
  }

  pointup() {
    if (!hasClass(this._jsPlumbConnection, 'ui-selected')) {
      this._setConnectionColor()
      this._addCssClass('hover')
      showBigArrow(this._jsPlumbConnection)
    }
  }

  pointdown() {
    if (!hasClass(this._jsPlumbConnection, 'ui-selected')) {
      this._setConnectionColor()
      this._removeCssClass('hover')
      hideBigArrow(this._jsPlumbConnection)
    }
  }

  select() {
    if (!this._jsPlumbConnection.dead) {
      this._setConnectionColor()
      this._addCssClass('ui-selected')
      this._removeCssClass('hover')
      showBigArrow(this._jsPlumbConnection)
    }
  }

  deselect() {
    if (!this._jsPlumbConnection.dead) {
      this._setConnectionColor()
      this._removeCssClass('ui-selected')
      hideBigArrow(this._jsPlumbConnection)
    }
  }

  _setConnectionColor() {
    this._jsPlumbConnection.setPaintStyle(
      connectorStrokeStyle(
        this._annotationData,
        this._typeDefinition,
        this._relationId
      )
    )
  }

  _addCssClass(className) {
    this._jsPlumbConnection.addClass(className)
    getLabelOverlay(this._jsPlumbConnection).addClass(className)
  }

  _removeCssClass(className) {
    this._jsPlumbConnection.removeClass(className)
    getLabelOverlay(this._jsPlumbConnection).removeClass(className)
  }
}
