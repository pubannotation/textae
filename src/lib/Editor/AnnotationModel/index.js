import InstanceContainer from './InstanceContainer'
import SpanInstanceContainer from './SpanInstanceContainer'
import AttributeInstanceContainer from './AttributeInstanceContainer'
import RelationInstanceContainer from './RelationInstanceContainer'
import EntityInstanceContainer from './EntityInstanceContainer'
import AnnotationEvaluator from './AnnotationEvaluator'
import toDenotations from './toDenotations'
import toRelations from './toRelations'
import toBlocks from './toBlocks'
import getReplicationRanges from './getReplicationRanges'
import TypeGap from './TypeGap'
import createTextBox from './createTextBox'
import TypeDictionary from './TypeDictionary'
import DefinitionContainer from './DefinitionContainer'
import AttributeDefinitionContainer from '../AttributeDefinitionContainer'
import getAnnotationBox from './getAnnotationBox'
import LineHeightAuto from './LineHeightAuto'

export default class AnnotationModel {
  #sourceDoc
  #typeGap
  #textBox
  #lineHeightAuto
  #namespaceInstanceContainer
  #spanInstanceContainer
  #entityInstanceContainer
  #relationInstanceContainer
  #attributeInstanceContainer
  #typeDictionary
  #editorHTMLElement
  #eventEmitter

  constructor(
    editorID,
    editorHTMLElement,
    eventEmitter,
    editorCSSClass,
    startJQueryUIDialogWait,
    endJQueryUIDialogWait,
    isConfigLocked,
    additionalPaddingTop
  ) {
    this.#sourceDoc = ''
    this.#namespaceInstanceContainer = new InstanceContainer(
      eventEmitter,
      'namespace'
    )
    const relationDefinitionContainer = new DefinitionContainer(
      eventEmitter,
      'relation',
      () => this.#relationInstanceContainer.all,
      '#00CC66'
    )

    this.#relationInstanceContainer = new RelationInstanceContainer(
      editorHTMLElement,
      eventEmitter,
      this,
      relationDefinitionContainer
    )
    this.#typeGap = new TypeGap(() => {
      for (const entity of this.entityInstanceContainer.denotations) {
        entity.reflectTypeGapInTheHeight()
      }
      this.#textBox.updateLineHeight()
      eventEmitter.emit('textae-event.annotation-data.entity-gap.change')
    })

    this.#entityInstanceContainer = new EntityInstanceContainer(
      editorID,
      eventEmitter,
      this,
      this.#typeGap
    )

    this.attributeDefinitionContainer = new AttributeDefinitionContainer(
      eventEmitter,
      () => this.#attributeInstanceContainer.all
    )
    this.#attributeInstanceContainer = new AttributeInstanceContainer(
      eventEmitter,
      this.#entityInstanceContainer,
      this.#relationInstanceContainer,
      this.#namespaceInstanceContainer,
      this.attributeDefinitionContainer
    )

    this.updatePosition = () => {
      try {
        editorCSSClass.startWait()
        startJQueryUIDialogWait()

        this.#rearrangeAllAnnotations()
      } catch (e) {
        console.error(e)
      } finally {
        editorCSSClass.endWait()
        endJQueryUIDialogWait()
      }
    }
    this.#textBox = createTextBox(editorHTMLElement, this, additionalPaddingTop)
    this.#lineHeightAuto = new LineHeightAuto(eventEmitter, this.#textBox)
    this.#spanInstanceContainer = new SpanInstanceContainer(
      editorID,
      editorHTMLElement,
      eventEmitter,
      this.#textBox
    )

    this.denotationDefinitionContainer = new DefinitionContainer(
      eventEmitter,
      'entity',
      () => this.#entityInstanceContainer.denotations,
      '#77DDDD'
    )
    const blockDefinitionContainer = new DefinitionContainer(
      eventEmitter,
      'entity',
      () => this.#entityInstanceContainer.blocks,
      '#77DDDD'
    )
    this.#typeDictionary = new TypeDictionary(
      eventEmitter,
      this.denotationDefinitionContainer,
      blockDefinitionContainer,
      relationDefinitionContainer,
      this.attributeDefinitionContainer,
      isConfigLocked
    )

    eventEmitter
      .on('textae-event.annotation-data.span.add', (span) => {
        if (span.isDenotation || span.isBlock) {
          this.#textBox.forceUpdate()
          this.#rearrangeAllAnnotations()
        }
      })
      .on('textae-event.annotation-data.span.remove', (span) => {
        if (span.isDenotation || span.isBlock) {
          this.#textBox.forceUpdate()
          this.#rearrangeAllAnnotations()
        }
      })
      .on('textae-event.annotation-data.entity.add', (entity) => {
        if (entity.span.isDenotation) {
          this.#lineHeightAuto.updateLineHeight()
        }
      })
      .on('textae-event.annotation-data.entity.remove', (entity) => {
        if (entity.span.isDenotation) {
          this.#lineHeightAuto.updateLineHeight()
        }
      })

    // Bind type-definition events.
    eventEmitter
      .on('textae-event.type-definition.entity.change', (typeName) => {
        for (const entity of this.#entityInstanceContainer.all) {
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
        this.#entityInstanceContainer.redrawEntitiesWithSpecifiedAttribute(pred)
      )
      .on('textae-event.type-definition.attribute.move', (pred) =>
        this.#entityInstanceContainer.redrawEntitiesWithSpecifiedAttribute(pred)
      )
      .on('textae-event.type-definition.relation.change', (typeName) => {
        for (const relation of this.#relationInstanceContainer.all) {
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

    this.#editorHTMLElement = editorHTMLElement
    this.#eventEmitter = eventEmitter
  }

  reset(rawData, config) {
    console.assert(rawData.text, 'This is not a json file of annotations.')

    this.#typeDictionary.setTypeConfig(config)
    this.#sourceDoc = rawData.text
    this.#textBox.render(this.sourceDoc)

    this.#clear()

    const annotationEvaluator = new AnnotationEvaluator(this, rawData)
    annotationEvaluator.eval()

    this.#drawAllAnnotations()

    this.#eventEmitter.emit(
      'textae-event.annotation-data.all.change',
      annotationEvaluator.hasMultiTracks,
      annotationEvaluator.rejects
    )

    // When reading some annotation Grid may be drawn out of alignment.
    // For example, http://pubannotation.org/projects/GlyCosmos6-Glycan-Motif-Structure/docs/sourcedb/PubMed/sourceid/3571288/annotations.json .
    // This seems to happen especially when the browser is wide with only one editor.
    // The true cause is unknown, but it can be avoided by doing the layout twice.
    this.reLayout()
  }

  get externalFormat() {
    return {
      text: this.#sourceDoc,
      denotations: toDenotations(this),
      attributes: this.#attributeInstanceContainer.all.map(
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
      this.#spanInstanceContainer,
      isDelimiterFunc
    )
  }

  get typeGap() {
    return this.#typeGap
  }

  get textBox() {
    return this.#textBox
  }

  get sourceDoc() {
    // Since 6.0.0, the text-box is set to "white-space: pre-wrap;"
    // in order to render line breaks contained in text as they are in the browser.
    // "\r\n" is rendered as a single character.
    // Replace "\r\n" with "\n" so that the browser can render "\r\n" as two characters.
    return this.#sourceDoc.replaceAll(/\r\n/g, ' \n')
  }

  get typeDictionary() {
    return this.#typeDictionary
  }

  /** @returns {import('./SpanInstanceContainer').default} */
  get spanInstanceContainer() {
    return this.#spanInstanceContainer
  }

  getSpan(spanID) {
    return this.#spanInstanceContainer.get(spanID)
  }

  get entityInstanceContainer() {
    return this.#entityInstanceContainer
  }

  get relationInstanceContainer() {
    return this.#relationInstanceContainer
  }

  get attributeInstanceContainer() {
    return this.#attributeInstanceContainer
  }

  get namespaceInstanceContainer() {
    return this.#namespaceInstanceContainer
  }

  get textSelection() {
    return this.#spanInstanceContainer.textSelection
  }

  getTextBetween(begin, end) {
    return this.sourceDoc.substring(begin, end)
  }

  changeTextBetween(begin, end, newText) {
    this.#sourceDoc = `${this.#sourceDoc.slice(0, begin)}${newText}${this.#sourceDoc.slice(end)}`
    const offset = newText.length - (end - begin)
    const effectedSpans = this.#spanInstanceContainer.offsetSpans(
      begin,
      end,
      offset
    )

    this.#textBox.render(this.sourceDoc)
    this.#drawAllAnnotations()

    this.#eventEmitter.emit('textae-event.annotation-data.text.change')

    return effectedSpans
  }

  get #selectedText() {
    const { begin, end } = this.textSelection
    return this.getTextBetween(begin, end)
  }

  hasCharacters(spanConfig) {
    return spanConfig.removeBlankCharacters(this.#selectedText).length > 0
  }

  getTextSelection(spanConfig, textSelectionAdjuster) {
    const { begin, end } = this.textSelection

    return {
      begin: textSelectionAdjuster.backFromBegin(
        this.sourceDoc,
        begin,
        spanConfig
      ),
      end:
        textSelectionAdjuster.forwardFromEnd(
          this.sourceDoc,
          end - 1,
          spanConfig
        ) + 1
    }
  }

  validateNewDenotationSpan(begin, end) {
    return this.#spanInstanceContainer.validateNewDenotationSpan(begin, end)
  }

  validateNewBlockSpan(begin, end, spanID) {
    return this.#spanInstanceContainer.validateNewBlockSpan(begin, end, spanID)
  }

  validateEditableText(begin, end) {
    return this.#spanInstanceContainer.validateEditableText(begin, end)
  }

  getInstanceContainerFor(annotationType) {
    switch (annotationType) {
      case 'span':
        return this.#spanInstanceContainer
      case 'relation':
        return this.#relationInstanceContainer
      case 'entity':
        return this.#entityInstanceContainer
      case 'attribute':
        return this.#attributeInstanceContainer
    }
  }

  drawGridsInSight() {
    if (this.#isEditorInSight) {
      const { clientHeight, clientWidth } = document.documentElement

      for (const span of this.#spanInstanceContainer.allDenotationSpans) {
        span.drawGrid(clientHeight, clientWidth)
      }

      for (const span of this.#spanInstanceContainer.allBlockSpans) {
        span.drawGrid(clientHeight, clientWidth)
        span.updateBackgroundPosition()
      }

      for (const relation of this.#relationInstanceContainer.all) {
        relation.render(clientHeight, clientWidth)
      }
    }
  }

  reLayout() {
    this.#textBox.forceUpdate()

    if (this.#isEditorInSight) {
      this.updatePosition()
    }
  }

  /** @param {number} value */
  set toolBarHeight(value) {
    this.#entityInstanceContainer.toolBarHeight = value
    this.#relationInstanceContainer.toolBarHeight = value
  }

  get #isEditorInSight() {
    const { clientHeight } = document.documentElement
    const { top, bottom } = this.#editorHTMLElement.getBoundingClientRect()

    return 0 <= bottom && top <= clientHeight
  }

  focusDenotation(denotationID) {
    console.assert(
      this.#entityInstanceContainer.hasDenotation(denotationID),
      'The denotation does not exist.'
    )

    const { span } = this.#entityInstanceContainer.get(denotationID)
    span.focus()
  }

  #drawAllAnnotations() {
    this.#spanInstanceContainer.renderAll()

    this.#textBox.updateLineHeight()

    this.drawGridsInSight()
  }

  #rearrangeAllAnnotations() {
    this.#spanInstanceContainer.arrangeDenotationEntityPosition()

    // When you undo the deletion of a block span,
    // if you move the background first, the grid will move to a better position.
    this.#spanInstanceContainer.arrangeBackgroundOfBlockSpanPosition()
    this.#spanInstanceContainer.arrangeBlockEntityPosition()

    for (const relation of this.#relationInstanceContainer.all) {
      // The Grid disappears while the span is moving.
      if (
        relation.sourceEntity.span.isGridRendered &&
        relation.targetEntity.span.isGridRendered
      ) {
        relation.redrawLineConsideringSelection()
      }
    }
  }

  #clear() {
    // Clear data models.
    this.#spanInstanceContainer.clear()
    this.#entityInstanceContainer.clear()
    this.#attributeInstanceContainer.clear()
    this.#relationInstanceContainer.clear()
    this.#namespaceInstanceContainer.clear()

    // Clear rendered annotations.
    getAnnotationBox(this.#editorHTMLElement).innerHTML = ''
  }
}
