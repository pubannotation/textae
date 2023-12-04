import { MODE } from '../../../../../MODE'
import EditorCSS from './EditorCSS'

export default class ModeReactor {
  constructor(
    editorHTMLElement,
    eventEmitter,
    annotationModel,
    cancelSelect,
    editDenotation,
    editBlock,
    editRelation
  ) {
    this._listeners = []

    const editorCSS = new EditorCSS(editorHTMLElement)
    eventEmitter.on(
      'textae-event.edit-mode.transition',
      (mode, showRelation) => {
        cancelSelect()
        this._unbindAllMouseEventHandler()
        editorCSS.clear()

        switch (mode) {
          case MODE.VIEW:
            annotationModel.typeGap.show = showRelation
            if (showRelation) {
              editorCSS.setFor('view-with-relation')
            } else {
              editorCSS.setFor('view-without-relation')
            }
            break
          case MODE.EDIT_DENOTATION:
            annotationModel.typeGap.show = showRelation
            this._listeners = editDenotation.bindMouseEvents()
            if (showRelation) {
              editorCSS.setFor('denotation-with-relation')
            } else {
              editorCSS.setFor('denotation-without-relation')
            }
            break
          case MODE.EDIT_BLOCK:
            annotationModel.typeGap.show = showRelation
            this._listeners = editBlock.bindMouseEvents()
            if (showRelation) {
              editorCSS.setFor('block-with-relation')
            } else {
              editorCSS.setFor('block-without-relation')
            }
            break
          case MODE.EDIT_RELATION:
            annotationModel.typeGap.show = true
            this._listeners = editRelation.bindMouseEvents()
            editorCSS.setFor('relation')
            break
          default:
            throw new Error(`Unknown mode: ${mode}`)
        }
      }
    )
  }

  _unbindAllMouseEventHandler() {
    for (const listener of this._listeners) {
      listener.destroy()
    }
    this._listeners = []
  }
}
