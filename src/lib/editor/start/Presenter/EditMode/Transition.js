import { EventEmitter } from 'events'
import setEditableStyle from './setEditableStyle'
import ViewMode from './ViewMode'
import event from './event'

const TERM = 'term'
const INSTANCE = 'instance'
const RELATION = 'relation'

export default class extends EventEmitter {
  constructor(
    editor,
    annotationData,
    selectionModel,
    typeEditor,
    buttonStateHelper
  ) {
    super()

    this.editor = editor
    this.typeEditor = typeEditor
    this.viewMode = new ViewMode(
      editor,
      annotationData,
      selectionModel,
      buttonStateHelper
    )
    this.buttonStateHelper = buttonStateHelper
  }

  toTerm() {
    super.emit(event.HIDE)
    super.emit(event.CHANGE, true, TERM)

    this.typeEditor.editEntity()
    this.viewMode.setTerm()
    setEditableStyle(this.editor, this.buttonStateHelper, true)
  }

  toInstance() {
    super.emit(event.SHOW)
    super.emit(event.CHANGE, true, INSTANCE)

    this.typeEditor.editEntity()
    this.viewMode.setInstance()
    setEditableStyle(this.editor, this.buttonStateHelper, true)
  }

  toRelation() {
    super.emit(event.SHOW)
    super.emit(event.CHANGE, true, RELATION)

    this.typeEditor.editRelation()
    this.viewMode.setRelation()
    setEditableStyle(this.editor, this.buttonStateHelper, true)
  }

  toViewTerm() {
    super.emit(event.HIDE)
    super.emit(event.CHANGE, false, TERM)

    this.typeEditor.noEdit()
    this.viewMode.setTerm()
    setEditableStyle(this.editor, this.buttonStateHelper, false)
  }

  toViewInstance() {
    super.emit(event.SHOW)
    super.emit(event.CHANGE, false, INSTANCE)

    this.typeEditor.noEdit()
    this.viewMode.setInstance()
    setEditableStyle(this.editor, this.buttonStateHelper, false)
  }
}
