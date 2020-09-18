import ModelContainer from './ModelContainer'
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
    this.relation = new RelationContainer(editor.eventEmitter)
    this.entity = new EntityContainer(editor, editor.eventEmitter, this)
    this.attribute = new AttributeContainer(editor.eventEmitter, this.entity)
    this.span = new SpanContainer(editor, editor.eventEmitter, this.entity)
    this._editor = editor
  }

  reset(annotation) {
    console.assert(annotation.text, 'This is not a json file of anntations.')

    clearAnnotationData(this)

    this.sourceDoc = annotation.text
    this.config = annotation.config

    const { multitrack, hasError, rejects } = parseDenotation(this, annotation)

    this._editor.eventEmitter.emit(
      'textae.annotationData.all.change',
      this,
      multitrack,
      hasError,
      rejects
    )
  }

  toJson() {
    return {
      denotations: toDenotation(this),
      attributes: toAttribute(this),
      relations: toRelation(this)
    }
  }
}
