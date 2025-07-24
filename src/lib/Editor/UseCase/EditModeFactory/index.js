import BlockEditMode from './BlockEditMode'
import RelationEditMode from './RelationEditMode'
import TermEditMode from './TermEditMode'
import TextEditMode from './TextEditMode'
import ViewMode from './ViewMode'

export default class EditModeFactory {
  static createTermEditMode(
    editorHTMLElement,
    eventEmitter,
    annotationModel,
    selectionModel,
    spanConfig,
    commander,
    menuState,
    mousePoint
  ) {
    return new TermEditMode(
      editorHTMLElement,
      eventEmitter,
      annotationModel,
      selectionModel,
      spanConfig,
      commander,
      menuState,
      mousePoint
    )
  }

  static createBlockEditMode(
    editorHTMLElement,
    eventEmitter,
    annotationModel,
    selectionModel,
    spanConfig,
    commander,
    menuState,
    mousePoint
  ) {
    return new BlockEditMode(
      editorHTMLElement,
      eventEmitter,
      annotationModel,
      selectionModel,
      spanConfig,
      commander,
      menuState,
      mousePoint
    )
  }

  static createRelationEditMode(
    editorHTMLElement,
    eventEmitter,
    annotationModel,
    selectionModel,
    commander,
    menuState,
    mousePoint
  ) {
    return new RelationEditMode(
      editorHTMLElement,
      eventEmitter,
      annotationModel,
      selectionModel,
      commander,
      menuState,
      mousePoint
    )
  }
  static createTextEditMode(
    editorHTMLElement,
    annotationModel,
    spanConfig,
    menuState,
    commander
  ) {
    return new TextEditMode(
      editorHTMLElement,
      annotationModel,
      spanConfig,
      menuState,
      commander
    )
  }

  static createViewMode(editorHTMLElement, eventEmitter, annotationModel) {
    return new ViewMode(editorHTMLElement, eventEmitter, annotationModel)
  }
}
