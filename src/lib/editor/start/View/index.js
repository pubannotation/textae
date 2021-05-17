import delegate from 'delegate'
import debounce from 'debounce'
import getEntityHTMLelementFromChild from '../getEntityHTMLelementFromChild'
import LineHeightAuto from './LineHeightAuto'

export default class View {
  constructor(editor, annotationData) {
    this._editor = editor
    this._annotationData = annotationData

    // Bind annotation data events
    const lineHeightAuto = new LineHeightAuto(
      editor,
      this._annotationData.textBox
    )
    const debouncedUpdatePosition = debounce(() => {
      lineHeightAuto.updateLineHeight()
      this._updateAnnotationPosition()
    }, 100)

    editor.eventEmitter
      .on('textae-event.annotation-data.all.change', debouncedUpdatePosition)
      .on('textae-event.annotation-data.entity.add', debouncedUpdatePosition)
      .on('textae-event.annotation-data.entity.change', debouncedUpdatePosition)
      .on('textae-event.annotation-data.entity.remove', debouncedUpdatePosition)
      .on('textae-event.annotation-data.entity.move', debouncedUpdatePosition)
      .on('textae-event.annotation-data.relation.add', debouncedUpdatePosition)
      .on('textae-event.annotation-data.attribute.add', debouncedUpdatePosition)
      .on(
        'textae-event.annotation-data.attribute.change',
        debouncedUpdatePosition
      )
      .on(
        'textae-event.annotation-data.attribute.remove',
        debouncedUpdatePosition
      )
      .on('textae-event.annotation-data.span.move', () => {
        // Move grids and relations synchronously.
        // If grid and relations move asynchronously,
        // grid positions in cache may be deleted before render relation when moving span frequently.
        // Position of relation depends on position of grid and position of grid is cached for perfermance.
        // If position of grid is not cached, relation can not be rendered.
        this._updateAnnotationPosition()
      })
      .on('textae-event.annotation-data.entity-gap.change', () =>
        this._updateAnnotationPosition()
      )

    // Bind clipBoard events.
    editor.eventEmitter.on(
      'textae-event.clip-board.change',
      (added, removed) => {
        for (const entity of added) {
          entity.startCut()
        }

        for (const entity of removed) {
          entity.cancelCut()
        }
      }
    )

    // Bind commander events.
    editor.eventEmitter.on(
      'textae-event.commander.attributes.change',
      (attributes) => {
        for (const subjectModel of attributes.reduce(
          (prev, curr) => prev.add(curr.subjectModel),
          new Set()
        )) {
          subjectModel.updateElement()
        }
      }
    )

    // Bind type-definition events.
    editor.eventEmitter
      .on('textae-event.type-definition.entity.change', (typeName) => {
        for (const entity of annotationData.entity.all) {
          // If the type name ends in a wildcard, look for the DOMs to update with a forward match.
          if (
            entity.typeName === typeName ||
            (typeName.lastIndexOf('*') === typeName.length - 1 &&
              entity.typeName.indexOf(typeName.slice(0, -1) === 0))
          ) {
            entity.updateElement()
          }
        }
      })
      .on('textae-event.type-definition.attribute.change', (pred) =>
        annotationData.entity.redrawEntitiesWithSpecifiedAttribute(pred)
      )
      .on('textae-event.type-definition.attribute.move', (pred) =>
        annotationData.entity.redrawEntitiesWithSpecifiedAttribute(pred)
      )
      .on('textae-event.type-definition.relation.change', (typeName) => {
        for (const relation of annotationData.relation.all) {
          // If the type name ends in a wildcard, look for the DOMs to update with a forward match.
          if (
            relation.typeName === typeName ||
            (typeName.lastIndexOf('*') === typeName.length - 1 &&
              relation.typeName.indexOf(typeName.slice(0, -1) === 0))
          ) {
            relation.updateElement()
          }
        }
      })

    // Highlight retaitons when related entity is heverd.
    const dom = editor[0]
    delegate(
      dom,
      '.textae-editor__signboard__type-values',
      'mouseover',
      (e) => {
        const entityElement = getEntityHTMLelementFromChild(e.target)
        if (
          entityElement.dataset.entityType === 'denotation' ||
          entityElement.dataset.entityType === 'block'
        ) {
          const entityId = entityElement.dataset.id
          annotationData.entity.get(entityId).pointUpRelations()
        }
      }
    )
    delegate(dom, '.textae-editor__signboard__type-values', 'mouseout', (e) => {
      const entityElement = getEntityHTMLelementFromChild(e.target)
      if (
        entityElement.dataset.entityType === 'denotation' ||
        entityElement.dataset.entityType === 'block'
      ) {
        const entityId = entityElement.dataset.id
        annotationData.entity.get(entityId).pointDownRelations()
      }
    })
  }

  updateDisplay() {
    this._annotationData.textBox.forceUpdate()
    this._updateAnnotationPosition()
  }

  updateLineHeight() {
    this._annotationData.textBox.updateLineHeight()
    this._updateAnnotationPosition()
  }

  _updateAnnotationPosition() {
    this._annotationData.updatePosition()
  }
}
