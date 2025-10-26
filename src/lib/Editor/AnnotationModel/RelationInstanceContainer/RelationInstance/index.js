import TypeValues from '../../../../TypeValues'
import getDisplayName from '../../../getDisplayName'
import getURI from '../../../getURI'
import toAnchorElement from '../../../toAnchorElement'
import Arrow from './Arrow'
import Label from './Label'

export default class RelationInstance {
  #editorHTMLElement
  #eventEmitter
  #entityInstanceContainer
  #attributeInstanceContainer
  #id
  #typeName
  #subj
  #obj
  #namespaceInstanceContainer
  #definitionContainer
  #toolBarHeight
  #isSelected
  #isHovered
  #arrow
  #label

  constructor(
    editorHTMLElement,
    eventEmitter,
    entityInstanceContainer,
    attributeInstanceContainer,
    namespaceInstanceContainer,
    { id, pred, subj, obj },
    definitionContainer,
    toolBarHeight
  ) {
    this.#editorHTMLElement = editorHTMLElement
    this.#eventEmitter = eventEmitter
    this.#entityInstanceContainer = entityInstanceContainer
    this.#attributeInstanceContainer = attributeInstanceContainer
    this.#id = id
    this.#subj = subj
    this.#obj = obj
    this.#namespaceInstanceContainer = namespaceInstanceContainer
    this.#definitionContainer = definitionContainer
    this.#toolBarHeight = toolBarHeight
    this.#isSelected = false

    // When you click on a relation to deselect it, the display of the relation will be in hover.
    // When you click on the body and deselect the relation, the display of the relation becomes non-hover.
    // To make this distinction, the hover state is retained.
    this.#isHovered = false

    // Preprocessing is required, so use the property
    this.typeName = pred
  }

  get id() {
    return this.#id
  }

  set id(val) {
    this.#id = val
  }

  get typeName() {
    return this.#typeName
  }

  set typeName(val) {
    // Replace null to 'null' if type is null and undefined too.
    this.#typeName = String(val)
  }

  get typeValues() {
    return new TypeValues(
      this.#typeName,
      this.#attributeInstanceContainer.getAttributesFor(this.#id)
    )
  }

  get subj() {
    return this.#subj
  }

  get obj() {
    return this.#obj
  }

  get attributes() {
    return this.#attributeInstanceContainer.getAttributesFor(this.#id)
  }

  /** @returns {import('../../../EntityInstance').EntityInstance} */
  get sourceEntity() {
    return this.#entityInstanceContainer.get(this.subj)
  }

  /** @returns {import('../../../EntityInstance').EntityInstance} */
  get targetEntity() {
    return this.#entityInstanceContainer.get(this.obj)
  }

  get sourceColor() {
    return this.sourceEntity.color
  }

  get targetColor() {
    return this.targetEntity.color
  }

  get isSelected() {
    return this.#isSelected
  }

  get isHovered() {
    return this.#isHovered
  }

  select() {
    if (!this.#isSelected) {
      this.#isSelected = true
      // When we select a relation,
      // it is hovering and we have already highlighted the line,
      // so we only need to update the label.
      if (this.#label) {
        this.#label.updateHighlighting()
      }
    }
  }

  deselect() {
    if (this.#isSelected) {
      this.#isSelected = false
      if (this.#arrow || this.#label) {
        this.redrawLineConsideringSelection()
      }
    }
  }

  render(clientHeight, clientWidth) {
    if (
      this.sourceEntity.isInViewport(clientHeight, clientWidth) ||
      this.targetEntity.isInViewport(clientHeight, clientWidth)
    ) {
      if (!this.#arrow) {
        this.#arrow = new Arrow(
          this.#editorHTMLElement,
          this,
          this.#toolBarHeight,
          (event) => {
            this.#eventEmitter.emit(
              'textae-event.editor.relation.click',
              event,
              this
            )
            event.stopPropagation()
          },
          (event, entity) => {
            this.#eventEmitter.emit(
              'textae-event.editor.relation-bollard.click',
              event,
              entity
            )
            event.stopPropagation()
          },
          () => this.#pointUpSelfAndEntities(),
          () => this.#pointDownSelfAndEntities()
        )

        this.#label = new Label(
          this.#editorHTMLElement,
          this,
          this.#arrow,
          (event, attribute) => {
            this.#eventEmitter.emit(
              'textae-event.editor.relation.click',
              event,
              this,
              attribute
            )
            event.stopPropagation()
          },
          () => this.#pointUpSelfAndEntities(),
          () => this.#pointDownSelfAndEntities()
        )
      } else {
        this.#redrawArrowConsideringSelection()
      }

      if (
        (this.sourceEntity.clientTop > this.targetEntity.clientTop &&
          this.targetEntity.isInViewport(clientHeight, clientWidth)) ||
        (this.sourceEntity.clientTop < this.targetEntity.clientTop &&
          this.sourceEntity.isInViewport(clientHeight, clientWidth)) ||
        this.sourceEntity.clientTop === this.targetEntity.clientTop
      ) {
        if (!this.#label) {
          this.#label = new Label(
            this.#editorHTMLElement,
            this,
            this.#arrow,
            (event, attribute) => {
              this.#eventEmitter.emit(
                'textae-event.editor.relation.click',
                event,
                this,
                attribute
              )
              event.stopPropagation()
            },
            () => this.#pointUpSelfAndEntities(),
            () => this.#pointDownSelfAndEntities()
          )

          // When scrolling out of a selected relation and then scrolling in again,
          // the selected state will be highlighted.
          this.#label.updateHighlighting()
        } else {
          this.#redrawLabelConsideringSelection()
        }
      } else {
        if (this.#label) {
          this.#label.destructor()
          this.#label = undefined
        }
      }
    } else {
      if (this.#arrow || this.#label) {
        this.erase()
      }
    }
  }

  updateElement() {
    if (this.#arrow) {
      this.#arrow.update(this.isSelected, this.isSelected, this.isSelected)
    }

    if (this.#label) {
      this.#label.updateValue()
    }
  }

  redrawLineConsideringSelection() {
    this.#redrawArrowConsideringSelection()
    this.#redrawLabelConsideringSelection()
  }

  pointUpPathAndSourceBollards() {
    if (this.#arrow) {
      if (this.targetEntity.isSelected) {
        this.#arrow.update(true, true, true)
      } else {
        this.#arrow.update(true, true, this.isSelected)
      }
    }

    if (this.#label) {
      this.#label.updateHighlighting()
    }
  }

  pointUpPathAndTargetBollards() {
    if (this.#arrow) {
      if (this.sourceEntity.isSelected) {
        this.#arrow.update(true, true, true)
      } else {
        this.#arrow.update(true, this.isSelected, true)
      }
    }

    if (this.#label) {
      this.#label.updateHighlighting()
    }
  }

  pointUpSourceBollardsAndTargetBollards() {
    if (this.#arrow) {
      this.#arrow.update(this.isSelected, true, true)
    }

    if (this.#label) {
      this.#label.updateHighlighting()
    }
  }

  pointUpSourceBollards() {
    if (this.#arrow) {
      this.#arrow.update(this.isSelected, true, this.isSelected)
    }

    if (this.#label) {
      this.#label.updateHighlighting()
    }
  }

  pointUpTargetBollards() {
    if (this.#arrow) {
      this.#arrow.update(this.isSelected, this.isSelected, true)
    }

    if (this.#label) {
      this.#label.updateHighlighting()
    }
  }

  erase() {
    if (this.#arrow) {
      this.#arrow.destructor()
      this.#arrow = undefined
    }

    if (this.#label) {
      this.#label.destructor()
      this.#label = undefined
    }
  }

  get title() {
    return `[${this.id}] pred: type, value: ${this.typeName}`
  }

  get color() {
    return this.#definitionContainer.getColor(this.typeName)
  }

  get anchorHTML() {
    return toAnchorElement(this.#displayName, this.#href)
  }

  get #displayName() {
    return getDisplayName(
      this.#namespaceInstanceContainer,
      this.typeName,
      this.#definitionContainer.getLabel(this.typeName)
    )
  }

  get #href() {
    return getURI(
      this.#namespaceInstanceContainer,
      this.typeName,
      this.#definitionContainer.getURI(this.typeName)
    )
  }

  #pointUpSelfAndEntities() {
    this.#isHovered = true
    this.#arrow.update(true, true, true)
    if (this.#label) {
      this.#label.updateHighlighting()
    }

    const bothRelations = new Set()
    const sourceRelations = new Set()
    const targetRelations = new Set()

    for (const r of this.sourceEntity.relationsWhereThisIsSource) {
      if (r === this) {
        continue
      }

      if (r.targetEntity == this.targetEntity) {
        bothRelations.add(r)
      } else {
        sourceRelations.add(r)
      }
    }

    for (const r of this.sourceEntity.relationsWhereThisIsTarget) {
      if (r === this) {
        continue
      }

      if (r.sourceEntity == this.targetEntity) {
        bothRelations.add(r)
      } else {
        targetRelations.add(r)
      }
    }

    for (const r of this.targetEntity.relationsWhereThisIsSource) {
      if (r === this) {
        continue
      }

      if (r.targetEntity == this.sourceEntity) {
        bothRelations.add(r)
      } else {
        sourceRelations.add(r)
      }
    }

    for (const r of this.targetEntity.relationsWhereThisIsTarget) {
      if (r === this) {
        continue
      }

      if (r.sourceEntity == this.sourceEntity) {
        bothRelations.add(r)
      } else {
        targetRelations.add(r)
      }
    }

    for (const r of bothRelations) {
      r.pointUpSourceBollardsAndTargetBollards()
    }

    for (const r of sourceRelations) {
      r.pointUpSourceBollards()
    }

    for (const r of targetRelations) {
      r.pointUpTargetBollards()
    }
  }

  #pointDownSelfAndEntities() {
    this.#isHovered = false

    const relations = new Set()

    for (const r of this.sourceEntity.relations) {
      relations.add(r)
    }

    for (const r of this.targetEntity.relations) {
      relations.add(r)
    }

    for (const r of relations) {
      r.redrawLineConsideringSelection()
    }
  }

  #redrawArrowConsideringSelection() {
    if (this.#arrow) {
      if (this.sourceEntity.isSelected && this.targetEntity.isSelected) {
        this.#arrow.update(true, true, true)
      } else if (this.sourceEntity.isSelected) {
        this.#arrow.update(true, true, this.isSelected)
      } else if (this.targetEntity.isSelected) {
        this.#arrow.update(true, this.isSelected, true)
      } else {
        this.#arrow.update(this.isSelected, this.isSelected, this.isSelected)
      }
    }
  }

  #redrawLabelConsideringSelection() {
    if (this.#label) {
      this.#label.updateHighlighting()
    }
  }
}
