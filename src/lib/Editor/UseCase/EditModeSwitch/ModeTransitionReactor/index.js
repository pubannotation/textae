import { MODE } from '../../../../MODE'
import EditorCSS from './EditorCSS'

export default class ModeTransitionReactor {
  #listeners

  constructor(
    editorHTMLElement,
    eventEmitter,
    annotationModel,
    termEditMode,
    blockEditMode,
    relationEditMode,
    textEditMode
  ) {
    this.#listeners = []

    const editorCSS = new EditorCSS(editorHTMLElement)
    eventEmitter.on(
      'textae-event.edit-mode.transition',
      (mode, showRelation) => {
        this.#unbindAllMouseEventHandler()
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
            this.#listeners = termEditMode.bindMouseEvents()
            if (showRelation) {
              editorCSS.setFor('denotation-with-relation')
            } else {
              editorCSS.setFor('denotation-without-relation')
            }
            break
          case MODE.EDIT_BLOCK:
            annotationModel.typeGap.show = showRelation
            this.#listeners = blockEditMode.bindMouseEvents()
            if (showRelation) {
              editorCSS.setFor('block-with-relation')
            } else {
              editorCSS.setFor('block-without-relation')
            }
            break
          case MODE.EDIT_RELATION:
            annotationModel.typeGap.show = true
            this.#listeners = relationEditMode.bindMouseEvents()
            editorCSS.setFor('relation')
            break
          case MODE.EDIT_TEXT:
            annotationModel.typeGap.show = showRelation
            this.#listeners = textEditMode.bindMouseEvents()
            if (showRelation) {
              editorCSS.setFor('text-with-relation')
            } else {
              editorCSS.setFor('text-without-relation')
            }
            break
          default:
            throw new Error(`Unknown mode: ${mode}`)
        }
      }
    )
  }

  #unbindAllMouseEventHandler() {
    for (const listener of this.#listeners) {
      listener.destroy()
    }
    this.#listeners = []
  }
}
