import getDisplayName from '../../../getDisplayName'

const NS = {
  SVG: 'http://www.w3.org/2000/svg'
}

export default class SVGConnection {
  constructor(relation, namespace, definitionContainer, onClick, editor) {
    this._relation = relation
    this._namespace = namespace
    this._definitionContainer = definitionContainer
    this._onClick = onClick
    this._editor = editor
    this._relationBox = editor[0].querySelector('.textae-editor__relation-box')

    this._createPath(false)
  }

  destroy() {
    this._destoryPath()
  }

  select() {
    if (!this._isSelected) {
      this._isSelected = true
      this.destroy()
      this._createPath(true)
    }
  }

  deselect() {
    if (this._isSelected) {
      this._isSelected = false
      this.recreate()
    }
  }

  pointUp() {
    if (!this._isSelected && !this._isHovered) {
      this._isHovered = true

      this._destoryPath()
      this._createPath(true)
    }
  }

  pointDown() {
    if (!this._isSelected && this._isHovered) {
      this._isHovered = false
      this.recreate()
    }
  }

  recreate() {
    this.destroy()
    if (this._isSelected) {
      this._createPath(true)
    } else {
      this._createPath(false)
    }
  }

  // Private APIs
  _createPath(isBold) {
    // Markers are affected by the stroke-width of the path.
    // If the path is made thicker, the marker will be larger than intended.
    //  When the path is made thicker, the marker should be smaller.
    const arrow = this._createArrow(isBold ? 0.5 : 1)

    const annotationBox = this._editor[0]
      .querySelector('.textae-editor__annotation-box')
      .getBoundingClientRect()
    const sourceEndpoint = this._relation.sourceEndpoint.getBoundingClientRect()
    const targetEndpoint = this._relation.targetEndpoint.getBoundingClientRect()
    const color = this._color

    const path = createPath(
      sourceEndpoint,
      annotationBox,
      targetEndpoint,
      color,
      arrow,
      isBold
    )

    this._relationBox.appendChild(path)

    path.addEventListener('click', this._onClick)
    path.addEventListener('mouseenter', () => this.pointUp())
    path.addEventListener('mouseleave', () => this.pointDown())
    this._path = path

    this._createLabel(isBold)
  }

  _createArrow(arrowWeights) {
    const defs = this._relationBox.children[0]
    if (defs.querySelector(`#${this._editor.editorId}_${this._relation.id}`)) {
      this._setArrowStyle(
        defs.querySelector(`#${this._editor.editorId}_${this._relation.id}`),
        arrowWeights
      )
    } else {
      const arrow = document.createElementNS(NS.SVG, 'marker')
      arrow.setAttribute('id', `${this._editor.editorId}_${this._relation.id}`)
      arrow.setAttribute('orient', 'auto')
      this._setArrowStyle(arrow, arrowWeights)
      defs.appendChild(arrow)
    }

    return defs.querySelector(`#${this._editor.editorId}_${this._relation.id}`)
  }

  _createLabel(isBold) {
    const pathBBox = this._path.getBBox()
    const labelX = pathBBox.x + pathBBox.width / 2
    const labelY = pathBBox.y - 2

    const label = document.createElementNS(NS.SVG, 'text')
    label.textContent = `[${this._relation.id}] ${getDisplayName(
      this._namespace,
      this._relation.typeName,
      this._definitionContainer.getLabel(this._relation.typeName)
    )}`
    this._relationBox.appendChild(label)
    const labelBBox = label.getBBox()
    label.setAttribute('x', labelX - labelBBox.width / 2)
    label.setAttribute('y', labelY)

    const link = this._relation.getLink(
      this._namespace,
      this._definitionContainer
    )
    if (link) {
      label.classList.add('textae-editor__relation-label--isLink')
    }
    if (isBold) {
      label.classList.add('textae-editor__relation-label--isBold')
    }

    label.addEventListener('click', this._onClick)
    this._label = label

    const labelBackground = document.createElementNS(NS.SVG, 'rect')
    labelBackground.setAttribute('x', labelX - labelBBox.width / 2)
    labelBackground.setAttribute('y', labelY - labelBBox.height / 2 - 3)
    labelBackground.setAttribute('width', labelBBox.width)
    labelBackground.setAttribute('height', labelBBox.height)
    labelBackground.style.fill = 'yellow'
    labelBackground.style.fillOpacity = 0.6
    this._relationBox.insertBefore(labelBackground, label)
    this._labelBackground = labelBackground
  }

  _setArrowStyle(arrow, weight) {
    arrow.setAttribute('markerWidth', 12 * weight)
    arrow.setAttribute('markerHeight', 12 * weight)
    arrow.setAttribute('refX', 12 * weight)
    arrow.setAttribute('refY', 6 * weight)

    if (arrow.children.length) {
      const arrowPolygon = arrow.children[0]
      arrowPolygon.setAttribute(
        'points',
        `0 0, ${12 * weight} ${6 * weight}, 0 ${12 * weight}, ${6 * weight} ${
          6 * weight
        }`
      )

      arrowPolygon.setAttribute('style', `fill: ${this._color}`)
    } else {
      const arrowPolygon = document.createElementNS(NS.SVG, 'polygon')
      arrowPolygon.setAttribute(
        'points',
        `0 0, ${12 * weight} ${6 * weight}, 0 ${12 * weight}, ${6 * weight} ${
          6 * weight
        }`
      )

      arrowPolygon.setAttribute('style', `fill: ${this._color}`)

      arrow.appendChild(arrowPolygon)
    }
  }

  get _color() {
    return this._relation.getColor(this._definitionContainer)
  }

  _destoryPath() {
    this._relationBox.removeChild(this._path)
    this._relationBox.removeChild(this._label)
    this._relationBox.removeChild(this._labelBackground)
  }
}

function createPath(
  sourceEndpoint,
  annotationBox,
  targetEndpoint,
  color,
  arrow,
  isBold
) {
  const path = document.createElementNS(NS.SVG, 'path')
  const x1 = sourceEndpoint.left + sourceEndpoint.width / 2 - annotationBox.left
  const y1 = sourceEndpoint.top - annotationBox.top
  const x2 = targetEndpoint.left + targetEndpoint.width / 2 - annotationBox.left
  const y2 = targetEndpoint.top - annotationBox.top
  const controleY = Math.min(y1, y2) - Math.abs(x2 - x1) / 6 - 10
  path.setAttribute(
    'd',
    `M ${x1}, ${y1} C ${x1} ${controleY}, ${x2} ${controleY}, ${x2} ${y2}`
  )

  path.setAttribute('style', `fill:none; stroke: ${color};`)

  // The ID of the SVG element is global scope in the Window.
  // If you don't make it unique, it will use another editor's arrow.
  path.setAttribute('marker-end', `url(#${arrow.id})`)

  if (isBold) {
    path.classList.add('textae-editor__relation--isBold')
  }
  return path
}
