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
    const arrowWeights = isBold ? 0.5 : 1

    const path = document.createElementNS(NS.SVG, 'path')

    const annotationBox = this._editor[0]
      .querySelector('.textae-editor__annotation-box')
      .getBoundingClientRect()
    const sourceEndpoint = this._relation.sourceEndpoint.getBoundingClientRect()
    const targetEndpoint = this._relation.targetEndpoint.getBoundingClientRect()

    const x1 =
      sourceEndpoint.left + sourceEndpoint.width / 2 - annotationBox.left
    const y1 = sourceEndpoint.top - annotationBox.top
    const x2 =
      targetEndpoint.left + targetEndpoint.width / 2 - annotationBox.left
    const y2 = targetEndpoint.top - annotationBox.top
    const controleY = Math.min(y1, y2) - Math.abs(x2 - x1) / 6 - 10
    path.setAttribute(
      'd',
      `M ${x1}, ${y1} C ${x1} ${controleY}, ${x2} ${controleY}, ${x2} ${y2}`
    )

    path.setAttribute(
      'style',
      `fill:none; stroke: ${this._relation.getColor(
        this._definitionContainer
      )};`
    )
    // IDはWindowでグローバル。ユニークにしないと、別のエディターの矢印を使ってしまう
    path.setAttribute(
      'marker-end',
      `url(#${this._editor.editorId}_${this._relation.id})`
    )

    if (isBold) {
      path.classList.add('textae-editor__relation--isBold')
    }

    const svg = this._editor[0].querySelector('.textae-editor__relation-box')
    const defs = svg.children[0]
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
    svg.appendChild(path)

    path.addEventListener('click', (e) => this._onClick(null, e))
    path.addEventListener('mouseenter', () => this.pointUp())
    path.addEventListener('mouseleave', () => this.pointDown())
    this._path = path

    this.createLabel(isBold)
  }

  createLabel(isBold) {
    const svg = this._editor[0].querySelector('.textae-editor__relation-box')
    const pathBBox = this._path.getBBox()
    const labelX = pathBBox.x + pathBBox.width / 2
    const labelY = pathBBox.y - 2

    // // https://ja.javascript.info/bezier-curve
    // // (1−t)3P1 + 3(1−t)2tP2 +3(1−t)t2P3 + t3P4
    // const t = 0.5
    // const labelX =
    //   Math.pow(1 - t, 3) * x1 +
    //   3 * Math.pow(1 - t, 2) * t * x1 +
    //   3 * (1 - t) * Math.pow(t, 2) * x2 +
    //   Math.pow(t, 3) * x2
    // const labelY =
    //   Math.pow(1 - t, 3) * y1 +
    //   3 * Math.pow(1 - t, 2) * t * controleY +
    //   3 * (1 - t) * Math.pow(t, 2) * controleY +
    //   Math.pow(t, 3) * y2
    const label = document.createElementNS(NS.SVG, 'text')
    label.textContent = `[${this._relation.id}] ${getDisplayName(
      this._namespace,
      this._relation.typeName,
      this._definitionContainer.getLabel(this._relation.typeName)
    )}`
    svg.appendChild(label)
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

    label.addEventListener('click', (e) => this._onClick(null, e))
    this._label = label

    const labelBackground = document.createElementNS(NS.SVG, 'rect')
    labelBackground.setAttribute('x', labelX - labelBBox.width / 2)
    labelBackground.setAttribute('y', labelY - labelBBox.height / 2 - 3)
    labelBackground.setAttribute('width', labelBBox.width)
    labelBackground.setAttribute('height', labelBBox.height)
    labelBackground.style.fill = 'yellow'
    labelBackground.style.fillOpacity = 0.6
    svg.insertBefore(labelBackground, label)
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

      arrowPolygon.setAttribute(
        'style',
        `fill: ${this._relation
          .getColor(this._definitionContainer)
          .toLowerCase()}`
      )
    } else {
      const arrowPolygon = document.createElementNS(NS.SVG, 'polygon')
      arrowPolygon.setAttribute(
        'points',
        `0 0, ${12 * weight} ${6 * weight}, 0 ${12 * weight}, ${6 * weight} ${
          6 * weight
        }`
      )

      arrowPolygon.setAttribute(
        'style',
        `fill: ${this._relation
          .getColor(this._definitionContainer)
          .toLowerCase()}`
      )

      arrow.appendChild(arrowPolygon)
    }
  }

  _destoryPath() {
    const svg = this._editor[0].querySelector('.textae-editor__relation-box')
    svg.removeChild(this._path)
    svg.removeChild(this._label)
    svg.removeChild(this._labelBackground)
  }
}
