import ModelContainer from './ModelContainer'
import SpanContainer from './SpanContainer'
import AttributeContainer from './AttributeContainer'
import RelationContainer from './RelationContainer'
import EntityContainer from './EntityContainer'
import parseAnnotation from './parseAnnotation'
import clearAnnotationData from './clearAnnotationData'
import toDenotations from './toDenotations'
import toAttributes from './toAttributes'
import toRelations from './toRelations'
import toBlocks from './toBlocks'
import getReplicationRanges from './getReplicationRanges'
import EntityGap from './EntityGap'
import GridRectangle from './GridRectangle'
import createTextBox from './createTextBox'

export default class AnnotationData {
  constructor(editor) {
    this.sourceDoc = ''
    this.namespace = new ModelContainer(editor.eventEmitter, 'namespace')
    this.relation = new RelationContainer(editor, editor.eventEmitter)
    this._entityGap = new EntityGap()
    this.entity = new EntityContainer(
      editor,
      editor.eventEmitter,
      this,
      this._entityGap
    )
    this.attribute = new AttributeContainer(editor.eventEmitter, this.entity)
    this._gridRectangle = new GridRectangle(this)
    this.span = new SpanContainer(
      editor,
      editor.eventEmitter,
      this.entity,
      this._gridRectangle
    )
    this._editor = editor
    this._textBox = createTextBox(editor, this)
  }

  reset(rawData) {
    console.assert(rawData.text, 'This is not a json file of anntations.')

    this.sourceDoc = rawData.text
    this._textBox.render(rawData.text)

    clearAnnotationData(this)
    const { multitrack, hasError, rejects } = parseAnnotation(this, rawData)

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
      denotations: toDenotations(this),
      attributes: toAttributes(this),
      relations: toRelations(this),
      blocks: toBlocks(this)
    }
  }

  getReplicationRanges(span, isDelimiterFunc) {
    return getReplicationRanges(
      this.sourceDoc,
      span.begin,
      span.end,
      this.span,
      isDelimiterFunc
    )
  }

  get entityGap() {
    return this._entityGap
  }

  get gridRectangle() {
    return this._gridRectangle
  }

  get textBox() {
    return this._textBox
  }
}
