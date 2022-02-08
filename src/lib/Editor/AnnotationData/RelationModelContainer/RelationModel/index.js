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
    if (this._connect && !this._isSelected) {
      this._isSelected = true
      this._connect.updateHighlighting()
    }
  }

  deselect() {
    if (this._isSelected) {
      this._isSelected = false
      this._connect.updateHighlighting()
      this.updateHighlighting()
    }
  }

  render() {
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
      () => this._pointUpSelfAndEntities(),
      () => this._pointDownSelfAndEntities()
    )

    this._connect = connection
  }

  updateElement() {
    this._connect.updateValue()
  }

  updateHighlighting() {
    if (this._connect) {
      if (this.sourceEntity.isSelected && this.targetEntity.isSelected) {
        this._connect.pointUpPath()
      } else if (this.sourceEntity.isSelected) {
        this._connect.pointUpPathAndSourceBollards()
      } else if (this.targetEntity.isSelected) {
        this._connect.pointUpPathAndTargetBollards()
      } else {
        this._connect.pointDownPath()
      }
    }
  }

  pointUpPathAndSourceBollards() {
    if (this.targetEntity.isSelected) {
      this._connect.pointUpPath()
    } else {
      this._connect.pointUpPathAndSourceBollards()
    }
  }

  pointUpPathAndTargetBollards() {
    if (this.sourceEntity.isSelected) {
      this._connect.pointUpPath()
    } else {
      this._connect.pointUpPathAndTargetBollards()
    }
  }

  pointUpSourceBollardsAndTargetBollards() {
    if (this._connect) {
      this._connect.pointUpSourceBollardsAndTargetBollards()
    }
  }

  pointUpSourceBollards() {
    if (this._connect) {
      this._connect.pointUpSourceBollards()
    }
  }

  pointUpTargetBollards() {
    if (this._connect) {
      this._connect.pointUpTargetBollards()
    }
  }

  erase() {
    this._connect.destroy()
    this._connect = undefined
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

  _pointUpSelfAndEntities() {
    this._isHovered = true
    this._connect.pointUpPath()

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
      r.updateHighlighting()
    }
  }
}
