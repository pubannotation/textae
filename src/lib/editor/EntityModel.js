import TypeValues from './TypeValues'
import createSignboardHTMLElement from './createSignboardHTMLElement'
import typeGapUnitHeight from './typeGapUnitHeight'
import getDisplayName from './getDisplayName'
import getUri from './getUri'
import toAnchorElement from './toAnchorElement'
import getAnnotationBox from './AnnotationData/getAnnotationBox'

const CSS_CLASS_SELECTED = 'textae-editor__signboard--selected'
const CSS_CLASS_CUTTING = 'textae-editor__signboard--cutting'

export default class EntityModel {
  constructor(
    editor,
    attributeContainer,
    relationContaier,
    entityGap,
    typeDefinition,
    span,
    typeName,
    namespace,
    id = null
  ) {
    this._editor = editor
    this._span = span
    this.typeName = typeName
    this._id = id
    this._attributeContainer = attributeContainer
    this._relationContaier = relationContaier
    this._entityGap = entityGap
    this._typeDefinition = typeDefinition
    this._namespace = namespace
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

  get center() {
    return (
      this._clientRect.left +
      this._clientRect.width / 2 -
      getAnnotationBox(this._editor).getBoundingClientRect().left
    )
  }

  get top() {
    return (
      this._clientRect.top -
      getAnnotationBox(this._editor).getBoundingClientRect().top
    )
  }

  get bottom() {
    return (
      this._clientRect.top -
      getAnnotationBox(this._editor).getBoundingClientRect().top +
      this._clientRect.height
    )
  }

  get width() {
    return this._clientRect.width
  }

  get isDenotation() {
    return this._span.isDenotation
  }

  get isBlock() {
    return this._span.isBlock
  }

  select() {
    if (!this._selected) {
      this._selected = true
      this._selectElement()
    }
  }

  deselect() {
    if (this._selected) {
      this._selected = false
      this._element.classList.remove(CSS_CLASS_SELECTED)
    }
  }

  startCut() {
    if (this._element) {
      this._element.classList.add(CSS_CLASS_CUTTING)
    }
  }

  cancelCut() {
    if (this._element) {
      this._element.classList.remove(CSS_CLASS_CUTTING)
    }
  }

  render() {
    // Don't delete child Span on span moves.
    // Check if a child span is already present so that it is not drawn twice.
    if (this._element) {
      return
    }

    // A span have one grid and a grid can have multi types and a type can have multi entities.
    // A grid is only shown when at least one entity is owned by a correspond span.
    const grid = this.span.gridElement || this.span.renderGridElement()

    // Append a new entity to the type
    const element = this._renderElement()
    grid.insertAdjacentElement('beforeend', element)

    this.reflectEntityGapInTheHeight()
  }

  erase() {
    if (this.span.entities.length === 0) {
      // Destroy a grid when all entities are remove.
      this.span.destroyGridElement()
    } else {
      // Destroy whole of type DOM.
      this.destroyElement()
    }
  }

  updateElement() {
    const element = this._renderElement()
    this._element.replaceWith(element)

    // Re-select a new entity element.
    if (this._selected) {
      this._selectElement()
    }

    this.reflectEntityGapInTheHeight()
  }

  destroyElement() {
    this._element.remove()
  }

  reflectEntityGapInTheHeight() {
    if (this.isDenotation) {
      const entityElement = this._element
      if (entityElement) {
        entityElement.setAttribute(
          'style',
          `padding-top: ${typeGapUnitHeight * this._entityGap.value}px;`
        )
      }
    }
  }

  _renderElement() {
    const element = createSignboardHTMLElement(
      this,
      this.isDenotation ? 'denotation' : 'block',
      null,
      this._entityHTMLElementID
    )

    // Highlight retaitons when related entity is hoverd.
    element.addEventListener('mouseenter', () => this._pointUpRelations())
    element.addEventListener('mouseleave', () => this._pointDownRelations())

    return element
  }

  get _clientRect() {
    return this._typeValuesElement.getBoundingClientRect()
  }

  get _element() {
    return document.querySelector(`#${this._entityHTMLElementID}`)
  }

  get _typeValuesElement() {
    return document.querySelector(
      `#${this._entityHTMLElementID} .textae-editor__signboard__type-values`
    )
  }

  get _entityHTMLElementID() {
    return `${this._editor.editorId}__E${this.id.replace(/[:¥.]/g, '')}`
  }

  _selectElement() {
    const el = this._element
    el.classList.add(CSS_CLASS_SELECTED)

    // The block span renders as a div HTML element.
    // Because the positioning of div HTML elements is slower than that of span HTML elements,
    // block span grids do not move at render time.
    // Focusing before moving causes the browser to scroll to the top of the document.
    // So focus after the move, not at render time.
    if (this.span.isGridBeforePositioned) {
      this.span.entityToFocusOn = this
    } else {
      // Set focus to the label element in order to scroll the browser to the position of the element.
      el.querySelector('.textae-editor__signboard__type-label').focus()
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

  _pointUpRelations() {
    for (const relation of this.relationsWhereThisIsSource) {
      relation.pointUpPathAndSourceBollards()
    }
    for (const relation of this.relationsWhereThisIsTarget) {
      relation.pointUpPathAndTargetBollards()
    }
  }

  _pointDownRelations() {
    for (const relation of this.relations) {
      relation.pointDown()
    }
  }
}
