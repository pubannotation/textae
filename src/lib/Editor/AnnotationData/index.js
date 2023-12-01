import ModelContainer from './ModelContainer'
import SpanModelContainer from './SpanModelContainer'
import AttributeModelContainer from './AttributeModelContainer'
import RelationModelContainer from './RelationModelContainer'
import EntityModelContainer from './EntityModelContainer'
import AnnotationParser from './AnnotationParser'
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
import LineHeightAuto from './LineHeightAuto'

export default class AnnotationData {
  constructor(
    editorID,
    editorHTMLElement,
    eventEmitter,
    editorCSSClass,
    startJQueryUIDialogWait,
    endJQueryUIDialogWait,
    isConfigLock
  ) {
    this._sourceDoc = ''
    this.namespace = new ModelContainer(eventEmitter, 'namespace')
    const relationDefinitionContainer = new DefinitionContainer(
      eventEmitter,
      'relation',
      () => this.relation.all,
      '#00CC66'
    )

    this.relation = new RelationModelContainer(
      editorHTMLElement,
      eventEmitter,
      this,
      this.namespace,
      relationDefinitionContainer
    )
    this._typeGap = new TypeGap(() => {
      for (const entity of this.entity.denotations) {
        entity.reflectTypeGapInTheHeight()
      }
      this._textBox.updateLineHeight()
      eventEmitter.emit('textae-event.annotation-data.entity-gap.change')
    })

    this.entity = new EntityModelContainer(
      editorID,
      eventEmitter,
      this,
      this._typeGap,
      this.namespace
    )

    this.attributeDefinitionContainer = new AttributeDefinitionContainer(
      eventEmitter,
      () => this.attribute.all
    )
    this.attribute = new AttributeModelContainer(
      eventEmitter,
      this.entity,
      this.relation,
      this.namespace,
      this.attributeDefinitionContainer
    )

    this.updatePosition = () => {
      try {
        editorCSSClass.startWait()
        startJQueryUIDialogWait()

        this._rearrangeAllAnnotations()
      } catch (e) {
        console.error(e)
      } finally {
        editorCSSClass.endWait()
        endJQueryUIDialogWait()
      }
    }
    this._textBox = createTextBox(editorHTMLElement, this)
    this._lineHeightAuto = new LineHeightAuto(eventEmitter, this._textBox)
    this.span = new SpanModelContainer(
      editorID,
      editorHTMLElement,
      eventEmitter,
      this.entity,
      this._textBox
    )

    this.denotationDefinitionContainer = new DefinitionContainer(
      eventEmitter,
      'entity',
      () => this.entity.denotations,
      '#77DDDD'
    )
    const blockDefinitionContainer = new DefinitionContainer(
      eventEmitter,
      'entity',
      () => this.entity.blocks,
      '#77DDDD'
    )
    this._typeDefinition = new TypeDefinition(
      eventEmitter,
      this.denotationDefinitionContainer,
      blockDefinitionContainer,
      relationDefinitionContainer,
      this.attributeDefinitionContainer
    )
    if (isConfigLock) {
      this._typeDefinition.lockEdit()
    } else {
      this._typeDefinition.unlockEdit()
    }

    eventEmitter
      .on('textae-event.annotation-data.span.add', (span) => {
        if (span.isDenotation || span.isBlock) {
          this._textBox.forceUpdate()
          this._rearrangeAllAnnotations()
        }
      })
      .on('textae-event.annotation-data.span.remove', (span) => {
        if (span.isDenotation || span.isBlock) {
          this._textBox.forceUpdate()
          this._rearrangeAllAnnotations()
        }
      })
      .on('textae-event.annotation-data.entity.add', (entity) => {
        if (entity.span.isDenotation) {
          this._lineHeightAuto.updateLineHeight()
        }
      })
      .on('textae-event.annotation-data.entity.remove', (entity) => {
        if (entity.span.isDenotation) {
          this._lineHeightAuto.updateLineHeight()
        }
      })

    // Bind type-definition events.
    eventEmitter
      .on('textae-event.type-definition.entity.change', (typeName) => {
        for (const entity of this.entity.all) {
          // If the type name ends in a wildcard, look for the DOMs to update with a forward match.
          if (
            entity.typeName === typeName ||
            (typeName.lastIndexOf('*') === typeName.length - 1 &&
              entity.typeName.indexOf(typeName.slice(0, -1) === 0))
          ) {
            entity.updateElement()
          }
        }
      })
      .on('textae-event.type-definition.attribute.change', (pred) =>
        this.entity.redrawEntitiesWithSpecifiedAttribute(pred)
      )
      .on('textae-event.type-definition.attribute.move', (pred) =>
        this.entity.redrawEntitiesWithSpecifiedAttribute(pred)
      )
      .on('textae-event.type-definition.relation.change', (typeName) => {
        for (const relation of this.relation.all) {
          // If the type name ends in a wildcard, look for the DOMs to update with a forward match.
          if (
            relation.typeName === typeName ||
            (typeName.lastIndexOf('*') === typeName.length - 1 &&
              relation.typeName.indexOf(typeName.slice(0, -1) === 0))
          ) {
            relation.updateElement()
          }
        }
      })

    this._editorHTMLElement = editorHTMLElement
    this._eventEmitter = eventEmitter
  }

  reset(rawData, config) {
    console.assert(rawData.text, 'This is not a json file of annotations.')

    this._typeDefinition.setTypeConfig(config)
    this._sourceDoc = rawData.text
    this._textBox.render(this.sourceDoc)

    clearAnnotationData(this)
    const { namespace, span, entity, attribute, relation } = this
    const annotationParser = new AnnotationParser(
      namespace,
      span,
      entity,
      attribute,
      relation,
      rawData
    )
    annotationParser.parse()

    this._clearAndDrawAllAnnotations()

    this._eventEmitter.emit(
      'textae-event.annotation-data.all.change',
      this,
      annotationParser.hasMultiTracks,
      annotationParser.rejects
    )

    // When reading some annotation Grid may be drawn out of alignment.
    // For example, http://pubannotation.org/projects/GlyCosmos6-Glycan-Motif-Structure/docs/sourcedb/PubMed/sourceid/3571288/annotations.json .
    // This seems to happen especially when the browser is wide with only one editor.
    // The true cause is unknown, but it can be avoided by doing the layout twice.
    this.reLayout()
  }

  get externalFormat() {
    return {
      denotations: toDenotations(this),
      attributes: this.attribute.all.map(
        ({ externalFormat }) => externalFormat
      ),
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

  drawGridsInSight() {
    if (this._isEditorInSight) {
      const { clientHeight, clientWidth } = document.documentElement

      for (const span of this.span.allDenotationSpans) {
        span.drawGrid(clientHeight, clientWidth)
      }

      for (const span of this.span.allBlockSpans) {
        span.drawGrid(clientHeight, clientWidth)
        span.updateBackgroundPosition()
      }

      for (const relation of this.relation.all) {
        relation.render(clientHeight, clientWidth)
      }
    }
  }

  reLayout() {
    this._textBox.forceUpdate()

    if (this._isEditorInSight) {
      this.updatePosition()
    }
  }

  /** @param {number} value */
  set controlBarHeight(value) {
    this.entity.controlBarHeight = value
    this.relation.controlBarHeight = value
  }

  get _isEditorInSight() {
    const { clientHeight } = document.documentElement
    const { top, bottom } = this._editorHTMLElement.getBoundingClientRect()

    return 0 <= bottom && top <= clientHeight
  }

  _clearAndDrawAllAnnotations() {
    getAnnotationBox(this._editorHTMLElement).innerHTML = ''

    this._textBox.updateLineHeight()

    for (const span of this.span.topLevel) {
      span.render()
    }

    // Reflects the addition and deletion of line breaks by span.
    this._textBox.forceUpdate()

    const { clientHeight, clientWidth } = document.documentElement

    for (const span of this.span.allDenotationSpans) {
      span.drawGrid(clientHeight, clientWidth)
    }

    for (const span of this.span.allBlockSpans) {
      span.drawGrid(clientHeight, clientWidth)
    }

    for (const relation of this.relation.all) {
      relation.render(clientHeight, clientWidth)
    }
  }

  _rearrangeAllAnnotations() {
    this.span.arrangeDenotationEntityPosition()

    // When you undo the deletion of a block span,
    // if you move the background first, the grid will move to a better position.
    this.span.arrangeBackgroundOfBlockSpanPosition()
    this.span.arrangeBlockEntityPosition()

    for (const relation of this.relation.all) {
      // The Grid disappears while the span is moving.
      if (
        relation.sourceEntity.span.isGridRendered &&
        relation.targetEntity.span.isGridRendered
      ) {
        relation.redrawLineConsideringSelection()
      }
    }
  }
}
