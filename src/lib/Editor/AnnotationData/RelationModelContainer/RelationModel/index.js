import getDisplayName from '../../../getDisplayName'
import getUri from '../../../getUri'
import toAnchorElement from '../../../toAnchorElement'
import TypeValues from '../../../../TypeValues'
import Connection from './Connection'

export default class RelationModel {
  constructor(
    editorHTMLElement,
    eventEmitter,
    entityContainer,
    attributeContainer,
    { id, pred, subj, obj },
    namespace,
    definitionContainer
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

  get sourceEntity() {
    return this._entityContainer.get(this.subj)
  }

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
      if (this._connection) {
        this._connection.updateLabelHighlighting()
      }
    }
  }

  deselect() {
    if (this._isSelected) {
      this._isSelected = false
      if (this._connection) {
        this.redrawLineConsideringSelection()
      }
    }
  }

  render(clientHeight, clientWidth) {
    if (
      this.sourceEntity.span.isGridInViewport(clientWidth, clientHeight) ||
      this.targetEntity.span.isGridInViewport(clientHeight, clientWidth)
    ) {
      const connection = new Connection(
        this._editorHTMLElement,
        this,
        this._namespace,
        this._definitionContainer,
        (event, attribute) => {
          this._eventEmitter.emit(
            'textae-event.editor.relation.click',
            event,
            this,
            attribute
          )
          event.stopPropagation()
        },
        (connection) => this._pointUpSelfAndEntities(connection),
        () => this._pointDownSelfAndEntities()
      )

      this._connection = connection
    } else {
      if (this._connection) {
        this.erase()
      }
    }
  }

  updateElement() {
    if (this._connection) {
      this._connection.updateValue()
    }
  }

  redrawLineConsideringSelection() {
    if (this._connection) {
      if (this.sourceEntity.isSelected && this.targetEntity.isSelected) {
        this._connection.pointUpPath()
      } else if (this.sourceEntity.isSelected) {
        this._connection.pointUpPathAndSourceBollards()
      } else if (this.targetEntity.isSelected) {
        this._connection.pointUpPathAndTargetBollards()
      } else {
        this._connection.pointDownPath()
      }
    }
  }

  pointUpPathAndSourceBollards() {
    if (this._connection) {
      if (this.targetEntity.isSelected) {
        this._connection.pointUpPath()
      } else {
        this._connection.pointUpPathAndSourceBollards()
      }
    }
  }

  pointUpPathAndTargetBollards() {
    if (this._connection) {
      if (this.sourceEntity.isSelected) {
        this._connection.pointUpPath()
      } else {
        this._connection.pointUpPathAndTargetBollards()
      }
    }
  }

  pointUpSourceBollardsAndTargetBollards() {
    if (this._connection) {
      this._connection.pointUpSourceBollardsAndTargetBollards()
    }
  }

  pointUpSourceBollards() {
    if (this._connection) {
      this._connection.pointUpSourceBollards()
    }
  }

  pointUpTargetBollards() {
    if (this._connection) {
      this._connection.pointUpTargetBollards()
    }
  }

  erase() {
    if (this._connection) {
      this._connection.destroy()
      this._connection = undefined
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
    return getUri(
      this._namespace,
      this.typeName,
      this._definitionContainer.getUri(this.typeName)
    )
  }

  _pointUpSelfAndEntities(connection) {
    this._isHovered = true
    connection.pointUpPath()

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
}
