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
import createTextBox from './createTextBox'
import TypeDefinition from './TypeDefinition'
import DefinitionContainer from './TypeDefinition/DefinitionContainer'
import AttributeDefinitionContainer from './TypeDefinition/AttributeDefinitionContainer'

export default class AnnotationData {
  constructor(editor) {
    this._sourceDoc = ''
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
    this._textBox = createTextBox(editor, this)
    this.span = new SpanContainer(
      editor,
      editor.eventEmitter,
      this.entity,
      this._textBox,
      this._entityGap
    )
    this._editor = editor

    const denotationDefinitionContainer = new DefinitionContainer(
      editor,
      'entity',
      () => this.entity.denotations,
      '#77DDDD'
    )
    const blockDefinitionContainer = new DefinitionContainer(
      editor,
      'entity',
      () => this.entity.blocks,
      '#77DDDD'
    )
    const relationDefinitionContainer = new DefinitionContainer(
      editor,
      'relation',
      () => this.relation.all,
      '#555555'
    )
    const attributeDefinitionContainer = new AttributeDefinitionContainer(
      editor,
      this.attribute
    )
    this._typeDefinition = new TypeDefinition(
      editor,
      denotationDefinitionContainer,
      blockDefinitionContainer,
      relationDefinitionContainer,
      attributeDefinitionContainer
    )
  }

  reset(rawData, config) {
    console.assert(rawData.text, 'This is not a json file of anntations.')

    this._typeDefinition.setTypeConfig(config)
    this._sourceDoc = rawData.text
    this._textBox.render(this.sourceDoc)

    clearAnnotationData(this)
    const { multitrack, hasError, rejects } = parseAnnotation(this, rawData)

    this._editor.eventEmitter.emit(
      'textae-event.annotation-data.all.change',
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

  get textBox() {
    return this._textBox
  }

  get sourceDoc() {
    // Since 6.0.0, the text-box is set to "white-space: pre-wrap;"
    // in order to render line breaks contained in text as they are in the browser.
    // "\r\n" is rendered as a single character.
    // Replace "\r\n" with "\n" so that the browser can render "\r\n" as two characters.
    return this._sourceDoc.replaceAll(/\r\n/g, ' \n')
  }

  get typeDefinition() {
    return this._typeDefinition
  }
}
