import ModelContainer from './ModelContainer'
import ParagraphContainer from './ParagraphContainer'
import SpanContainer from './SpanContainer'
import EntityContainer from './EntityContainer'
import AttributeContainer from './AttributeContainer'
import RelationContainer from './RelationContainer'
import parseDennotation from './parseDennotation'

export default class {
  constructor(editor) {
    this.sourceDoc = ''
    this.namespace = new ModelContainer(editor.eventEmitter, 'namespace')
    this.paragraph = new ParagraphContainer(editor, editor.eventEmitter)
    this.span = new SpanContainer(
      editor,
      editor.eventEmitter,
      this,
      this.paragraph
    )
    this.attribute = new AttributeContainer(editor.eventEmitter, this)
    this.relation = new RelationContainer(editor.eventEmitter)
    this.entity = new EntityContainer(editor, editor.eventEmitter, this)
    this.modification = new ModelContainer(editor.eventEmitter, 'modification')
  }

  setNewData(annotation) {
    this.sourceDoc = annotation.text
    this.paragraph.addSource(annotation.text)
    this.config = annotation.config

    return parseDennotation(this, annotation)
  }
}
