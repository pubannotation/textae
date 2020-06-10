import ModelContainer from './ModelContainer'
import ParagraphContainer from './ParagraphContainer'
import SpanContainer from './SpanContainer'
import AttributeContainer from './AttributeContainer'
import RelationContainer from './RelationContainer'
import EntityContainer from './EntityContainer'
import parseDenotation from './parseDenotation'
import clearAnnotationData from './clearAnnotationData'
import toDenotation from './toDenotation'
import toAttribute from './toAttribute'
import toRelation from './toRelation'

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
    this._editor = editor
  }

  reset(annotation) {
    console.assert(annotation.text, 'This is not a json file of anntations.')

    clearAnnotationData(this)

    this.sourceDoc = annotation.text
    this.paragraph.addSource(annotation.text)
    this.config = annotation.config

    const result = parseDenotation(this, annotation)

    this._editor.eventEmitter.emit(
      'textae.annotationData.paragraph.change',
      this.paragraph.all
    )
    this._editor.eventEmitter.emit(
      'textae.annotationData.all.change',
      this,
      result.multitrack,
      result.rejects
    )
  }

  toJson() {
    return {
      denotations: toDenotation(this),
      attributes: toAttribute(this),
      relations: toRelation(this),
      modifications: this.modification.all
    }
  }

  getModificationOf(objectId) {
    return this.modification.all.filter((m) => m.obj === objectId)
  }
}
