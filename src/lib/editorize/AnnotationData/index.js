import ModelContainer from './ModelContainer'
import SpanModelContainer from './SpanModelContainer'
import AttributeModelContainer from './AttributeModelContainer'
import RelationModelContainer from './RelationModelContainer'
import EntityModelContainer from './EntityModelContainer'
import parseAnnotation from './parseAnnotation'
import clearAnnotationData from './clearAnnotationData'
import toDenotations from './toDenotations'
import toRelations from './toRelations'
import toBlocks from './toBlocks'
import getReplicationRanges from './getReplicationRanges'
import TypeGap from './TypeGap'
import createTextBox from './createTextBox'
import TypeDefinition from './TypeDefinition'
import DefinitionContainer from './DefinitionContainer'
import AttributeDefinitionContainer from '../AttributeDefinitionContainer'
import getAnnotationBox from './getAnnotationBox'

export default class AnnotationData {
  constructor(editor) {
    this._sourceDoc = ''
    this.namespace = new ModelContainer(editor.eventEmitter, 'namespace')
    const relationDefinitionContainer = new DefinitionContainer(
      editor.eventEmitter,
      'relation',
      () => this.relation.all,
      '#00CC66'
    )
    this.relation = new RelationModelContainer(
      editor,
      editor.eventEmitter,
      this,
      this.namespace,
      relationDefinitionContainer
    )
    this._typeGap = new TypeGap(() => {
      for (const entity of this.entity.denotations) {
        entity.reflectTypeGapInTheHeight()
      }
      this._textBox.updateLineHeight()
      this._editor.eventEmitter.emit(
        'textae-event.annotation-data.entity-gap.change'
      )
    })

    this.entity = new EntityModelContainer(
      editor,
      editor.eventEmitter,
      this,
      this._typeGap,
      this.namespace
    )

    this.attributeDefinitionContainer = new AttributeDefinitionContainer(
      editor.eventEmitter,
      () => this.attribute.all
    )
    this.attribute = new AttributeModelContainer(
      editor.eventEmitter,
      this.entity,
      this.relation,
      this.namespace,
      this.attributeDefinitionContainer
    )

    this._textBox = createTextBox(editor, this)
    this.span = new SpanModelContainer(
      editor,
      editor.eventEmitter,
      this.entity,
      this._textBox,
      this._typeGap
    )
    this._editor = editor

    this.denotationDefinitionContainer = new DefinitionContainer(
      editor.eventEmitter,
      'entity',
      () => this.entity.denotations,
      '#77DDDD'
    )
    const blockDefinitionContainer = new DefinitionContainer(
      editor.eventEmitter,
      'entity',
      () => this.entity.blocks,
      '#77DDDD'
    )
    this._typeDefinition = new TypeDefinition(
      editor,
      this.denotationDefinitionContainer,
      blockDefinitionContainer,
      relationDefinitionContainer,
      this.attributeDefinitionContainer
    )
  }

  reset(rawData, config) {
    console.assert(rawData.text, 'This is not a json file of anntations.')

    this._typeDefinition.setTypeConfig(config)
    this._sourceDoc = rawData.text
    this._textBox.render(this.sourceDoc)

    clearAnnotationData(this)
    const { multitrack, hasError, rejects } = parseAnnotation(this, rawData)

    this._clearAndDrawAllAnnotations()

    this.span.arrangeDenotationEntityPosition()
    this.span.arrangeBlockEntityPosition()
    for (const relation of this.relation.all) {
      relation.updateHighlighting()
    }

    this._editor.eventEmitter.emit(
      'textae-event.annotation-data.all.change',
      this,
      multitrack,
      hasError,
      rejects
    )
  }

  get JSON() {
    return {
      denotations: toDenotations(this),
      attributes: this.attribute.all.map(({ JSON }) => JSON),
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

  get typeGap() {
    return this._typeGap
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

  get hasRelations() {
    return this.relation.some
  }

  updatePosition() {
    try {
      this._editor.startWait()
      // jQuery Ui dialogs are not in the editor.
      for (const dialog of document.querySelectorAll('.ui-dialog')) {
        dialog.classList.add('textae-editor--wait')
      }
      for (const dialog of document.querySelectorAll('.ui-widget-overlay')) {
        dialog.classList.add('textae-editor--wait')
      }

      this._rearrangeAllAnnotations()
    } catch (e) {
      console.error(e)
    } finally {
      this._editor.endWait()
      for (const dialog of document.querySelectorAll('.ui-dialog')) {
        dialog.classList.remove('textae-editor--wait')
      }
      for (const dialog of document.querySelectorAll('.ui-widget-overlay')) {
        dialog.classList.remove('textae-editor--wait')
      }
    }
  }

  drawGridsInSight() {
    for (const span of this.span.allBlockSpans) {
      span.drawGridInSight()
      span.updateBackgroundPosition()
    }
  }

  _clearAndDrawAllAnnotations() {
    getAnnotationBox(this._editor[0]).innerHTML = ''
    for (const span of this.span.topLevel) {
      span.render()
    }

    this._textBox.updateLineHeight()

    for (const relation of this.relation.all) {
      relation.render()
    }
  }

  _rearrangeAllAnnotations() {
    this.span.arrangeDenotationEntityPosition()

    // When you undo the deletion of a block span,
    // if you move the background first, the grid will move to a better position.
    this.span.arrangeBackgroundOfBlockSpanPosition()
    this.span.arrangeBlockEntityPosition()

    for (const relation of this.relation.all) {
      relation.updateHighlighting()
    }
  }
}
