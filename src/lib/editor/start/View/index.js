import delegate from 'delegate'
import CursorChanger from '../../../util/CursorChanger'
import AnnotationPosition from './AnnotationPosition'
import bindClipBoardEvents from './bindClipBoardEvents'
import bindAnnotaitonPositionEvents from './bindAnnotaitonPositionEvents'
import Renderer from './Renderer'
import bindAnnotationDataEvents from './bindAnnotationDataEvents'
import getEntityHTMLelementFromChild from '../getEntityHTMLelementFromChild'

export default class View {
  constructor(editor, annotationData) {
    const renderer = new Renderer(editor, annotationData)
    this._annotationPosition = new AnnotationPosition(
      editor,
      annotationData,
      renderer
    )
    this._annotationData = annotationData

    annotationData.entityGap.bind(() => this._applyEntityGap())
    bindClipBoardEvents(editor)
    bindAnnotationDataEvents(
      editor,
      this._annotationPosition,
      this._annotationData.textBox
    )
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
    this._annotationPosition.update()
  }

  updateLineHeight() {
    this._annotationData.textBox.updateLineHeight()
    this._annotationPosition.update()
  }

  _applyEntityGap() {
    for (const entity of this._annotationData.entity.denotations) {
      entity.reflectEntityGapInTheHeight()
    }
    this.updateLineHeight()
  }
}
