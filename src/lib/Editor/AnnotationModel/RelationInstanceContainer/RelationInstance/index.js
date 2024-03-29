import getDisplayName from '../../../getDisplayName'
import getURI from '../../../getURI'
import toAnchorElement from '../../../toAnchorElement'
import TypeValues from '../../../../TypeValues'
import Arrow from './Arrow'
import Label from './Label'

export default class RelationInstance {
  constructor(
    editorHTMLElement,
    eventEmitter,
    entityContainer,
    attributeContainer,
    { id, pred, subj, obj },
    namespace,
    definitionContainer,
    controlBarHeight
  ) {
    this._editorHTMLElement = editorHTMLElement
    this._eventEmitter = eventEmitter
    this._entityContainer = entityContainer
    this._attributeContainer = attributeContainer
    this._id = id
    this.typeName = pred
    this._subj = subj
    this._obj = obj
    this._namespace = namespace
    this._definitionContainer = definitionContainer
    this._controlBarHeight = controlBarHeight
    this._isSelected = false

    // When you click on a relation to deselect it, the display of the relation will be in hover.
    // When you click on the body and deselect the relation, the display of the relation becomes non-hover.
    // To make this distinction, the hover state is retained.
    this._isHovered = false
  }

  get id() {
    return this._id
  }

  set id(val) {
    this._id = val
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

  get subj() {
    return this._subj
  }

  get obj() {
    return this._obj
  }

  get attributes() {
    return this._attributeContainer.getAttributesFor(this._id)
  }

  /** @returns {import('../../../EntityInstance').EntityInstance} */
  get sourceEntity() {
    return this._entityContainer.get(this.subj)
  }

  /** @returns {import('../../../EntityInstance').EntityInstance} */
  get targetEntity() {
    return this._entityContainer.get(this.obj)
  }

  get sourceColor() {
    return this.sourceEntity.color
  }

  get targetColor() {
    return this.targetEntity.color
  }

  get isSelected() {
    return this._isSelected
  }

  get isHovered() {
    return this._isHovered
  }

  select() {
    if (!this._isSelected) {
      this._isSelected = true
      // When we select a relation,
      // it is hovering and we have already highlighted the line,
      // so we only need to update the label.
      if (this._label) {
        this._label.updateHighlighting()
      }
    }
  }

  deselect() {
    if (this._isSelected) {
      this._isSelected = false
      if (this._arrow || this._label) {
        this.redrawLineConsideringSelection()
      }
    }
  }

  render(clientHeight, clientWidth) {
    if (
      this.sourceEntity.isInViewport(clientHeight, clientWidth) ||
      this.targetEntity.isInViewport(clientHeight, clientWidth)
    ) {
      if (!this._arrow) {
        this._arrow = new Arrow(
          this._editorHTMLElement,
          this,
          this._controlBarHeight,
          (event) => {
            this._eventEmitter.emit(
              'textae-event.editor.relation.click',
              event,
              this
            )
            event.stopPropagation()
          },
          (event, entity) => {
            this._eventEmitter.emit(
              'textae-event.editor.relation-bollard.click',
              event,
              entity
            )
            event.stopPropagation()
          },
          () => this._pointUpSelfAndEntities(),
          () => this._pointDownSelfAndEntities()
        )

        this._label = new Label(
          this._editorHTMLElement,
          this,
          this._arrow,
          (event, attribute) => {
            this._eventEmitter.emit(
              'textae-event.editor.relation.click',
              event,
              this,
              attribute
            )
            event.stopPropagation()
          },
          () => this._pointUpSelfAndEntities(),
          () => this._pointDownSelfAndEntities()
        )
      } else {
        this._redrawArrowConsideringSelection()
      }

      if (
        (this.sourceEntity.clientTop > this.targetEntity.clientTop &&
          this.targetEntity.isInViewport(clientHeight, clientWidth)) ||
        (this.sourceEntity.clientTop < this.targetEntity.clientTop &&
          this.sourceEntity.isInViewport(clientHeight, clientWidth)) ||
        this.sourceEntity.clientTop === this.targetEntity.clientTop
      ) {
        if (!this._label) {
          this._label = new Label(
            this._editorHTMLElement,
            this,
            this._arrow,
            (event, attribute) => {
              this._eventEmitter.emit(
                'textae-event.editor.relation.click',
                event,
                this,
                attribute
              )
              event.stopPropagation()
            },
            () => this._pointUpSelfAndEntities(),
            () => this._pointDownSelfAndEntities()
          )

          // When scrolling out of a selected relation and then scrolling in again,
          // the selected state will be highlighted.
          this._label.updateHighlighting()
        } else {
          this._redrawLabelConsideringSelection()
        }
      } else {
        if (this._label) {
          this._label.destructor()
          this._label = undefined
        }
      }
    } else {
      if (this._arrow || this._label) {
        this.erase()
      }
    }
  }

  updateElement() {
    if (this._arrow) {
      this._arrow.update(
        this.isSelected || this._relation.isHovered,
        this.isSelected || this._relation.isHovered,
        this.isSelected || this._relation.isHovered
      )
    }

    if (this._label) {
      this._label.updateValue()
    }
  }

  redrawLineConsideringSelection() {
    this._redrawArrowConsideringSelection()
    this._redrawLabelConsideringSelection()
  }

  pointUpPathAndSourceBollards() {
    if (this._arrow) {
      if (this.targetEntity.isSelected) {
        this._arrow.update(true, true, true)
      } else {
        this._arrow.update(true, true, this.isSelected)
      }
    }

    if (this._label) {
      this._label.updateHighlighting()
    }
  }

  pointUpPathAndTargetBollards() {
    if (this._arrow) {
      if (this.sourceEntity.isSelected) {
        this._arrow.update(true, true, true)
      } else {
        this._arrow.update(true, this.isSelected, true)
      }
    }

    if (this._label) {
      this._label.updateHighlighting()
    }
  }

  pointUpSourceBollardsAndTargetBollards() {
    if (this._arrow) {
      this._arrow.update(this.isSelected, true, true)
    }

    if (this._label) {
      this._label.updateHighlighting()
    }
  }

  pointUpSourceBollards() {
    if (this._arrow) {
      this._arrow.update(this.isSelected, true, this.isSelected)
    }

    if (this._label) {
      this._label.updateHighlighting()
    }
  }

  pointUpTargetBollards() {
    if (this._arrow) {
      this._arrow.update(this.isSelected, this.isSelected, true)
    }

    if (this._label) {
      this._label.updateHighlighting()
    }
  }

  erase() {
    if (this._arrow) {
      this._arrow.destructor()
      this._arrow = undefined
    }

    if (this._label) {
      this._label.destructor()
      this._label = undefined
    }
  }

  get title() {
    return `[${this.id}] pred: type, value: ${this.typeName}`
  }

  get color() {
    return this._definitionContainer.getColor(this.typeName)
  }

  get anchorHTML() {
    return toAnchorElement(this._displayName, this._href)
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

  _pointUpSelfAndEntities() {
    this._isHovered = true
    this._arrow.update(true, true, true)
    if (this._label) {
      this._label.updateHighlighting()
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

  _pointDownSelfAndEntities() {
    this._isHovered = false

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

  _redrawArrowConsideringSelection() {
    if (this._arrow) {
      if (this.sourceEntity.isSelected && this.targetEntity.isSelected) {
        this._arrow.update(true, true, true)
      } else if (this.sourceEntity.isSelected) {
        this._arrow.update(true, true, this.isSelected)
      } else if (this.targetEntity.isSelected) {
        this._arrow.update(true, this.isSelected, true)
      } else {
        this._arrow.update(this.isSelected, this.isSelected, this.isSelected)
      }
    }
  }

  _redrawLabelConsideringSelection() {
    if (this._label) {
      this._label.updateHighlighting()
    }
  }
}
