import ModelContainer from './ModelContainer'
import ParagraphContainer from './ParagraphContainer'
import SpanContainer from './SpanContainer'
import EntityContainer from './EntityContainer'
import AttributeContainer from './AttributeContainer'
import RelationContaner from './RelationContaner'

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
    this.relation = new RelationContaner(editor.eventEmitter)
    this.entity = new EntityContainer(editor, editor.eventEmitter, this)
    this.modification = new ModelContainer(editor.eventEmitter, 'modification')
  }
}
