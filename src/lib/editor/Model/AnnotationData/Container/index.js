import { EventEmitter } from 'events'
import ModelContainer from './ModelContainer'
import ParagraphContainer from './ParagraphContainer'
import SpanContainer from './SpanContainer'
import EntityContainer from './EntityContainer'
import AttributeContainer from './AttributeContainer'
import RelationContaner from './RelationContaner'

export default class extends EventEmitter {
  constructor(editor) {
    super()

    this.sourceDoc = ''
    this.namespace = new ModelContainer(this, 'namespace')
    this.paragraph = new ParagraphContainer(editor, this)
    this.span = new SpanContainer(editor, this, this.paragraph)
    this.attribute = new AttributeContainer(this)
    this.relation = new RelationContaner(this)
    this.entity = new EntityContainer(editor, this)
    this.modification = new ModelContainer(this, 'modification')
  }
}
