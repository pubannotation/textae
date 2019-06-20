
import jsPlumbArrowOverlayUtil from '../../jsPlumbArrowOverlayUtil'
import LabelOverlay from '../../LabelOverlay'
import connectorStrokeStyle from '../../connectorStrokeStyle'

const POINTUP_LINE_WIDTH = 3

export default class {
  constructor(editor, annotationData, typeContainer, connect) {
    this.editor = editor
    this.annotationData = annotationData
    this.typeContainer = typeContainer
    this.connect = connect
  }

  pointup() {
    pointup(this.connect, this.annotationData, this.typeContainer, this.connect.relationId)
  }

  pointdown() {
    pointdown(this.connect, this.annotationData, this.typeContainer, this.connect.relationId)
  }

  select() {
    select(this.connect, this.editor, this.annotationData, this.typeContainer, this.connect.relationId)
  }

  deselect() {
    deselect(this.connect, this.annotationData, this.typeContainer, this.connect.relationId)
  }
}

function deselect(connect, annotationData, typeContainer, relationId) {
  if (!connect.dead) {
    deselectLine(connect)
    deselectLabel(connect)
    connect.setPaintStyle(connectorStrokeStyle(annotationData, typeContainer, relationId))
    jsPlumbArrowOverlayUtil.hideBigArrow(connect)
  }
}

function select(connect, editor, annotationData, typeContainer, relationId) {
  if (!connect.dead) {
    selectLine(editor, connect)
    selectLabel(connect)
    hoverdownLine(connect)
    hoverdownLabel(connect)
    connect.setPaintStyle(Object.assign(connectorStrokeStyle(annotationData, typeContainer, relationId), {
      lineWidth: POINTUP_LINE_WIDTH
    }))
    jsPlumbArrowOverlayUtil.showBigArrow(connect)
  }
}

function pointdown(connect, annotationData, typeContainer, relationId) {
  if (!hasClass(connect, 'ui-selected')) {
    hoverdownLine(connect)
    hoverdownLabel(connect)
    connect.setPaintStyle(connectorStrokeStyle(annotationData, typeContainer, relationId))
    jsPlumbArrowOverlayUtil.hideBigArrow(connect)
  }
}

function pointup(connect, annotationData, typeContainer, relationId) {
  if (!hasClass(connect, 'ui-selected')) {
    hoverupLine(connect)
    hoverupLabel(connect)
    connect.setPaintStyle(Object.assign(connectorStrokeStyle(annotationData, typeContainer, relationId), {
      lineWidth: POINTUP_LINE_WIDTH
    }))
    jsPlumbArrowOverlayUtil.showBigArrow(connect)
  }
}

function hoverupLabel(connect) {
  new LabelOverlay(connect).addClass('hover')
  return connect
}

function hoverdownLabel(connect) {
  new LabelOverlay(connect).removeClass('hover')
  return connect
}

function selectLabel(connect) {
  new LabelOverlay(connect).addClass('ui-selected')
  return connect
}

function deselectLabel(connect) {
  new LabelOverlay(connect).removeClass('ui-selected')
  return connect
}

function hoverupLine(connect) {
  connect.addClass('hover')
  return connect
}

function hoverdownLine(connect) {
  connect.removeClass('hover')
  return connect
}

function selectLine(editor, connect) {
  connect.addClass('ui-selected')

  // Before creation of e a relation the souce entity is selected. And that entity is deselected at that relation creation.
  // When entities or spans is deselected thier HTML element is blured.
  // Focus the editor manually to prevent the editor lose focus and lose capability of keyboard shortcut.
  editor.focus()
  return connect
}

function deselectLine(connect) {
  connect.removeClass('ui-selected')
  return connect
}

function hasClass(connect, className) {
  return connect.connector.canvas.classList.contains(className)
}
