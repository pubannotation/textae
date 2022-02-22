import TypeValues from '../TypeValues'
import SignboardHTMLElement from './SignboardHTMLElement'
import getDisplayName from './getDisplayName'
import getUri from './getUri'
import toAnchorElement from './toAnchorElement'
import round from './AnnotationData/SpanModelContainer/round'

export default class EntityModel {
  /**
   *
   * @param {import('./AnnotationData/SpanModelContainer/SpanModel').default} span
   */
  constructor(
    editorID,
    attributeContainer,
    relationContaier,
    typeGap,
    typeDefinition,
    span,
    typeName,
    namespace,
    id = null
  ) {
    this._editorID = editorID
    this._span = span
    this.typeName = typeName
    this._id = id
    this._attributeContainer = attributeContainer
    this._relationContaier = relationContaier
    this._typeGap = typeGap
    this._typeDefinition = typeDefinition
    this._namespace = namespace

    this._isSelected = false
    this._isHovered = false
    // When in view mode, the mousleave event will not declarify labels.
    this._isLabelClarified = false

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
    return this._definitionContainerFor.getColor(this.typeName)
  }

  get anchorHTML() {
    return toAnchorElement(this._displayName, this._href)
  }

  get span() {
    return this._span
  }

  set span(val) {
    this._span = val
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
   * @returns {AttributeModel[]}
   */
  get attributes() {
    return this._attributeContainer.getAttributesFor(this._id)
  }

  get relationsWhereThisIsSource() {
    return this._relationContaier.all.filter((r) => r.subj === this.id)
  }

  get relationsWhereThisIsTarget() {
    return this._relationContaier.all.filter((r) => r.obj === this.id)
  }

  get hasMultipleEndpoints() {
    const relations = new Map()
    relations.set('whereThisIsSourceAndTargetIsOnTheLeft', new Set())
    relations.set('whereThisIsSourceAndTargetIsOnTheRight', new Set())
    relations.set('whereThisIsSourceAndTargetIsUpOrDown', new Set())

    for (const r of this.relationsWhereThisIsSource) {
      if (r.targetEntity.center < this.center) {
        relations.get('whereThisIsSourceAndTargetIsOnTheLeft').add(r)
      } else if (this.center < r.targetEntity.center) {
        relations.get('whereThisIsSourceAndTargetIsOnTheRight').add(r)
      } else {
        relations.get('whereThisIsSourceAndTargetIsUpOrDown').add(r)
      }
    }

    relations.set('whereThisIsTargetAndSourceIsOnTheLeft', new Set())
    relations.set('whereThisIsTargetAndSourceIsOnTheRight', new Set())
    relations.set('whereThisIsTargetAndSourceIsUpOrDown', new Set())

    for (const r of this.relationsWhereThisIsTarget) {
      if (r.sourceEntity.center < this.center) {
        relations.get('whereThisIsTargetAndSourceIsOnTheLeft').add(r)
      } else if (this.center < r.targetEntity.center) {
        relations.get('whereThisIsTargetAndSourceIsOnTheRight').add(r)
      } else {
        relations.get('whereThisIsTargetAndSourceIsUpOrDown').add(r)
      }
    }

    return [...relations.values()].filter((s) => s.size).length > 1
  }

  get offsetTop() {
    const { span } = this

    // Calculates the top without referencing the HTML element of entities.
    if (span.isDenotation) {
      let top = span.offsetTopOfGrid + this._typeGap.height

      for (const entity of span.entities) {
        if (entity === this) {
          break
        }

        top += this._typeGap.height + entity.height
      }

      return top
    }

    if (span.isBlock) {
      const paddingBottomOfGridOfBlockSpan = 15
      return span.bottomOfGrid - this.height - paddingBottomOfGridOfBlockSpan
    }

    throw new Error('Unexpect type of span')
  }

  get bottom() {
    return this.offsetTop + this.height
  }

  get width() {
    return this.span.widthOfGrid
  }

  get height() {
    const labelUnitHegiht = 18

    return labelUnitHegiht + this._attributesHeight
  }

  get center() {
    return round(this.span.centerOfGrid)
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

    // Highlight retaitons when related entity is hoverd.
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
    if (this._signboard) {
      this._signboard.select()

      // The block span renders as a div HTML element.
      // Because the positioning of div HTML elements is slower than that of span HTML elements,
      // block span grids do not move at render time.
      // Focusing before moving causes the browser to scroll to the top of the document.
      // So focus after the move, not at render time.
      if (this.span.isGridBeforePositioned) {
        this.span.entityToFocusOn = this
      } else {
        // Set focus to the label element in order to scroll the browser to the position of the element.
        this._signboard.focus()
      }
    }
  }

  get _definitionContainerFor() {
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
      this._definitionContainerFor.getLabel(this.typeName)
    )
  }

  get _href() {
    return getUri(
      this._namespace,
      this.typeName,
      this._definitionContainerFor.getUri(this.typeName)
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
