import delegate from 'delegate'
import debounce from 'debounce'
import CursorChanger from '../../../util/CursorChanger'
import bindClipBoardEvents from './bindClipBoardEvents'
import bindAnnotaitonPositionEvents from './bindAnnotaitonPositionEvents'
import Renderer from './Renderer'
import getEntityHTMLelementFromChild from '../getEntityHTMLelementFromChild'
import LineHeightAuto from './LineHeightAuto'

export default class View {
  constructor(editor, annotationData) {
    const renderer = new Renderer(editor, annotationData)
    this._updateAnnotationPosition = function () {
      editor.eventEmitter.emit(
        'textae-event.annotation-position.position-update.start'
      )

      annotationData.span.arrangeDenotationEntityPosition()

      // When you undo the deletion of a block span,
      // if you move the background first, the grid will move to a better position.
      annotationData.span.arrangeBackgroundOfBlockSpanPosition()
      annotationData.span.arrangeBlockEntityPosition()

      for (const relation of annotationData.relation.all) {
        relation.updateElement()
      }

      editor.eventEmitter.emit(
        'textae-event.annotation-position.position-update.end'
      )
    }

    this._annotationData = annotationData

    annotationData.entityGap.bind(() => this._applyEntityGap())
    bindClipBoardEvents(editor)

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

    bindAnnotaitonPositionEvents(editor, new CursorChanger(editor))

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

  _applyEntityGap() {
    for (const entity of this._annotationData.entity.denotations) {
      entity.reflectEntityGapInTheHeight()
    }
    this.updateLineHeight()
  }
}
