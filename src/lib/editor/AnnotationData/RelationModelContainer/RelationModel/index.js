import getDisplayName from '../../../getDisplayName'
import getUri from '../../../getUri'
import toAnchorElement from '../../../toAnchorElement'
import TypeValues from '../../../TypeValues'
import SVGConnection from './SVGConnection'

export default class RelationModel {
  constructor(
    editor,
    entityContainer,
    attributeContainer,
    { id, pred, subj, obj },
    namespace,
    definitionContainer
  ) {
    this._editor = editor
    this._entityContainer = entityContainer
    this._attributeContainer = attributeContainer
    this._id = id
    this.typeName = pred
    this._subj = subj
    this._obj = obj
    this._namespace = namespace
    this._definitionContainer = definitionContainer
    this._isSelected = false
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

  select() {
    if (!this._isSelected) {
      this._isSelected = true
      this.updateElement()
    }
  }

  deselect() {
    if (this._isSelected) {
      this._isSelected = false
      this.updateElement()
    }
  }

  pointUp() {
    this._connect.pointUpPath(this._isSelected)
  }

  pointUpPathAndSourceBollards() {
    this._connect.pointUpPathAndSourceBollards(this._isSelected)
  }

  pointUpPathAndTargetBollards() {
    this._connect.pointUpPathAndTargetBollards(this._isSelected)
  }

  pointUpSourceBollards() {
    this._connect.pointUpSourceBollards(this._isSelected)
  }

  pointUpTargetBollards() {
    this._connect.pointUpTargetBollards(this._isSelected)
  }

  pointUpSourceBollardsAndTargetBollards() {
    this._connect.pointUpSourceBollardsAndTargetBollards(this._isSelected)
  }

  pointDown() {
    this._connect.pointDownPath(this._isSelected)
  }

  render() {
    const connection = new SVGConnection(
      this._editor,
      this,
      this._namespace,
      this._definitionContainer,
      (event, attribute) => {
        this._editor.eventEmitter.emit(
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
    this._connect.redraw(this._isSelected)
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
    this._connect.pointUpPath(this._isSelected)

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
    const relations = new Set()

    for (const r of this.sourceEntity.relations) {
      relations.add(r)
    }

    for (const r of this.targetEntity.relations) {
      relations.add(r)
    }

    for (const r of relations) {
      r.pointDown()
    }
  }
}
