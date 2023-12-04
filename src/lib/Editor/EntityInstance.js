import TypeValues from '../TypeValues.js'
import SignboardHTMLElement from './SignboardHTMLElement.js'
import getDisplayName from './getDisplayName/index.js'
import getURI from './getURI.js'
import toAnchorElement from './toAnchorElement.js'
import round from './round.js'

const DistanceToShift = 8
// Leave a gap half the width of the triangle so that the triangle does not intersect the vertical line.
const MinimumDistance = DistanceToShift * 3 + 4

export default class EntityInstance {
  /**
   *
   * @param {import('./AnnotationData/SpanInstanceContainer/SpanInstance/index.js').SpanInstance} span
   */
  constructor(
    editorID,
    attributeContainer,
    relationContainer,
    typeGap,
    typeDefinition,
    span,
    typeName,
    namespace,
    controlBarHeight,
    id = null
  ) {
    this._editorID = editorID
    this.span = span
    this.typeName = typeName
    this._id = id
    this._attributeContainer = attributeContainer
    this._relationContainer = relationContainer
    this._typeGap = typeGap
    this._typeDefinition = typeDefinition
    this._namespace = namespace
    this._controlBarHeight = controlBarHeight

    this._isSelected = false
    this._isHovered = false
    // When in view mode, the mouseleave event will not declarify labels.
    this._isLabelClarified = false

    /** @type {SignboardHTMLElement} */
    this._signboard = null
  }

  get id() {
    return this._id
  }

  set id(val) {
    this._id = val
  }

  get title() {
    return `[${this.id}] pred: type, value: ${this._typeName}`
  }

  get color() {
    return this._definitionContainer.getColor(this.typeName)
  }

  get anchorHTML() {
    return toAnchorElement(this._displayName, this._href)
  }

  get span() {
    return this._span
  }

  set span(val) {
    this._span = val
    val.add(this)
  }

  get typeName() {
    return this._typeName
  }

  set typeName(val) {
    // Replace null to 'null' if type is null and undefined too.
    this._typeName = String(val)
  }

  get typeValues() {
    return new TypeValues(
      this._typeName,
      this._attributeContainer.getAttributesFor(this._id)
    )
  }

  get relations() {
    return this.relationsWhereThisIsSource.concat(
      this.relationsWhereThisIsTarget
    )
  }

  /**
   * @returns {import('./AnnotationData/AttributeInstanceContainer/AttributeInstance.js').AttributeInstance[]}
   */
  get attributes() {
    return this._attributeContainer.getAttributesFor(this._id)
  }

  get relationsWhereThisIsSource() {
    return this._relationContainer.all.filter((r) => r.subj === this.id)
  }

  get relationsWhereThisIsTarget() {
    return this._relationContainer.all.filter((r) => r.obj === this.id)
  }

  get hasMultipleEndpoints() {
    const relations = new Map()
    relations.set('whereThisIsSourceAndTargetIsOnTheLeft', new Set())
    relations.set('whereThisIsSourceAndTargetIsOnTheRight', new Set())
    relations.set('whereThisIsSourceAndTargetIsUpOrDown', new Set())

    for (const r of this.relationsWhereThisIsSource) {
      if (r.targetEntity.offsetCenter < this.offsetCenter) {
        relations.get('whereThisIsSourceAndTargetIsOnTheLeft').add(r)
      } else if (this.offsetCenter < r.targetEntity.offsetCenter) {
        relations.get('whereThisIsSourceAndTargetIsOnTheRight').add(r)
      } else {
        relations.get('whereThisIsSourceAndTargetIsUpOrDown').add(r)
      }
    }

    relations.set('whereThisIsTargetAndSourceIsOnTheLeft', new Set())
    relations.set('whereThisIsTargetAndSourceIsOnTheRight', new Set())
    relations.set('whereThisIsTargetAndSourceIsUpOrDown', new Set())

    for (const r of this.relationsWhereThisIsTarget) {
      if (r.sourceEntity.offsetCenter < this.offsetCenter) {
        relations.get('whereThisIsTargetAndSourceIsOnTheLeft').add(r)
      } else if (this.offsetCenter < r.targetEntity.offsetCenter) {
        relations.get('whereThisIsTargetAndSourceIsOnTheRight').add(r)
      } else {
        relations.get('whereThisIsTargetAndSourceIsUpOrDown').add(r)
      }
    }

    return [...relations.values()].filter((s) => s.size).length > 1
  }

  get clientTop() {
    const { span } = this

    // Calculates the top without referencing the HTML element of entities.
    if (span.isDenotation) {
      let top = span.clientTopOfGrid + this._typeGap.height

      for (const entity of span.entities) {
        if (entity === this) {
          break
        }

        top += this._typeGap.height + entity.height
      }

      return round(top)
    }

    if (span.isBlock) {
      const paddingBottomOfGridOfBlockSpan = 15
      return round(
        span.clientBottomOfGrid - this.height - paddingBottomOfGridOfBlockSpan
      )
    }

    throw new Error('Unexpected type of span')
  }

  get offsetTop() {
    return (
      this.clientTop -
      this.span.element.offsetParent.offsetParent.getBoundingClientRect().top
    )
  }

  get clientBottom() {
    return this.clientTop + this.height
  }

  isInViewport(clientHeight) {
    return (
      this._controlBarHeight <= this.clientBottom &&
      this.clientTop <= clientHeight
    )
  }

  get width() {
    return this.span.widthOfGrid
  }

  get height() {
    const labelUnitHeight = 18

    return labelUnitHeight + this._attributesHeight
  }

  get heightWithTypeGap() {
    return this.height + this._typeGap.height
  }

  get offsetCenter() {
    return round(this.span.offsetCenterOfGrid)
  }

  get isDenotation() {
    return this._span.isDenotation
  }

  get isBlock() {
    return this._span.isBlock
  }

  get isSelected() {
    return this._isSelected
  }

  getSourceAnchorPosition(alignBollards) {
    // When the entity width is small and the endpoint is displayed in the center of the entity and the entity has only one endpoint,
    // hovering will not move the entity left or right.
    const isJettyDeployed =
      this.width / 2 >= MinimumDistance ||
      (this.hasMultipleEndpoints && alignBollards)

    return {
      left: isJettyDeployed
        ? this.offsetCenter - DistanceToShift * 3
        : this.offsetCenter,
      right: isJettyDeployed
        ? this.offsetCenter + DistanceToShift * 3
        : this.offsetCenter
    }
  }

  getTargetAnchorPosition(alignBollards) {
    // When the entity width is small and the endpoint is displayed in the center of the entity and the entity has only one endpoint,
    // hovering will not move the entity left or right.
    const isJettyDeployed =
      this.width / 2 >= MinimumDistance ||
      (this.hasMultipleEndpoints && alignBollards)

    return {
      left: isJettyDeployed
        ? this.offsetCenter - DistanceToShift
        : this.offsetCenter,
      right: isJettyDeployed
        ? this.offsetCenter + DistanceToShift
        : this.offsetCenter
    }
  }

  focus() {
    if (this.isDenotation) {
      this.span.focus()
    } else if (this.isBlock) {
      // Entities outside the drawing area are not rendered.
      // Attempting to focus will result in an error.
      // Force rendering before focusing.
      this.span.forceRenderGrid()
      this._signboard.focus()
    } else {
      throw new Error('Unexpected type of entity')
    }
  }

  select() {
    if (!this._isSelected) {
      this._isSelected = true
      this._selectElement()
      this._updateRelationHighlighting()
    }
  }

  deselect() {
    if (this._isSelected) {
      this._isSelected = false
      if (this._signboard) {
        this._signboard.deselect()
      }
      this._updateRelationHighlighting()
    }
  }

  startCut() {
    if (this._signboard) {
      this._signboard.startCut()
    }
  }

  cancelCut() {
    if (this._signboard) {
      this._signboard.cancelCut()
    }
  }

  render() {
    if (this._signboard) {
      return
    }

    if (this.span.isGridRendered) {
      // Append a new entity to the type
      this._signboard = this._createSignboardElement()
      this.span.addEntityElementToGridElement(this._signboard.element)

      this.reflectTypeGapInTheHeight()

      for (const entity of this.span.entities.filter((e) => e !== this)) {
        for (const relation of entity.relations) {
          relation.redrawLineConsideringSelection()
        }
      }

      // When scrolling out of a selected entity and then scrolling in again,
      // the selected state will be highlighted.
      if (this._isSelected) {
        this._signboard.select()
      }
    }
  }

  updateElement() {
    if (this._signboard) {
      this._signboard = this._signboard.replaceWith(
        this._createSignboardElement()
      )

      // Re-select a new entity element.
      if (this._isSelected) {
        this._selectElement()
      }

      this.reflectTypeGapInTheHeight()

      this.span.updateSelfAndAncestorsGridPosition()
      for (const entity of this.span.entities) {
        for (const relation of entity.relations) {
          relation.redrawLineConsideringSelection()
        }
      }
    }
  }

  reflectTypeGapInTheHeight() {
    if (this.isDenotation && this._signboard) {
      this._signboard.reflectTypeGapInTheHeight(this._typeGap.height)
    }
  }

  clarifyLabel() {
    if (this._signboard) {
      this._signboard.clarifyLabel()
    }
    this._isLabelClarified = true
  }

  declarifyLabel() {
    if (!this._isHovered && this._signboard) {
      this._signboard.declarifyLabel()
    }
    this._isLabelClarified = false
  }

  erase() {
    if (this._signboard) {
      this._signboard.remove()
      this._signboard = null
      this.span.updateSelfAndAncestorsGridPosition()
    }
  }

  _createSignboardElement() {
    const signboard = new SignboardHTMLElement(
      this,
      this.isDenotation ? 'denotation' : 'block',
      `${this._editorID}__E${this.id.replace(/[:¥.]/g, '')}`
    )

    // Highlight relations when related entity is hovered.
    signboard.addEventListener('mouseenter', () => {
      signboard.clarifyLabel()
      this._pointUpRelations()
      this._isHovered = true
    })
    signboard.addEventListener('mouseleave', () => {
      if (!this._isLabelClarified) {
        signboard.declarifyLabel()
      }
      this._updateRelationHighlighting()
      this._isHovered = false
    })

    return signboard
  }

  _selectElement() {
    // Force rendering to select and focus on entities outside the display area.
    this.span.forceRenderGrid()
    this._signboard.select()

    // The block span renders as a div HTML element.
    // Because the positioning of div HTML elements is slower than that of span HTML elements,
    // block span grids do not move at render time.
    // Focusing before moving causes the browser to scroll to the top of the document.
    // So focus after the move, not at render time.
    if (this.span.isGridBeforePositioned) {
      this.span.entityToFocusOn = this
    } else {
      // Set focus in order to scroll the browser to the position of the element.
      this.focus()
    }
  }

  /** @return {import('./AnnotationData/DefinitionContainer/index.js').default} */
  get _definitionContainer() {
    if (this.isDenotation) {
      return this._typeDefinition.denotation
    } else if (this.isBlock) {
      return this._typeDefinition.block
    } else {
      throw 'unknown entity type'
    }
  }

  get _displayName() {
    return getDisplayName(
      this._namespace,
      this.typeName,
      this._definitionContainer.getLabel(this.typeName)
    )
  }

  get _href() {
    return getURI(
      this._namespace,
      this.typeName,
      this._definitionContainer.getURI(this.typeName)
    )
  }

  get _attributesHeight() {
    return this.attributes
      .map(({ height }) => height)
      .reduce((sum, height) => sum + height, 0)
  }

  _pointUpRelations() {
    for (const relation of this.relationsWhereThisIsSource) {
      relation.pointUpPathAndSourceBollards()
    }
    for (const relation of this.relationsWhereThisIsTarget) {
      relation.pointUpPathAndTargetBollards()
    }
  }

  _updateRelationHighlighting() {
    for (const relation of this.relations) {
      relation.redrawLineConsideringSelection()
    }
  }
}
