import CompositeCommand from './CompositeCommand'
import { RemoveCommand } from './commandTemplate'
import aggregateTargetEntities from './aggregateTargetEntities'
import aggregateTargetRelations from './aggregateTargetRelations'

export default class RemoveSelectedCommand extends CompositeCommand {
  constructor(editor, annotationData, selectionModel) {
    super()

    // Aggregate seleceted targets
    const targetSpans = new Set()
    const targetEntities = new Set()
    const targetRelations = new Set()
    const targetAttributes = new Set()
    for (const span of selectionModel.span.all) {
      targetSpans.add(span)
      for (const entity of span.entities) {
        aggregateTargetEntities(
          targetEntities,
          targetRelations,
          targetAttributes,
          entity
        )
      }
    }
    for (const entity of selectionModel.entity.all) {
      aggregateTargetEntities(
        targetEntities,
        targetRelations,
        targetAttributes,
        entity
      )
    }
    for (const relation of selectionModel.relation.all) {
      aggregateTargetRelations(targetRelations, targetAttributes, relation)
    }

    // Aggregate spans to lose all entities.
    for (const span of annotationData.span.all) {
      if (span.entities.every((e) => selectionModel.entity.all.includes(e))) {
        if (!span.styleOnly) {
          targetSpans.add(span)
        }
      }
    }

    this._subCommands = []
    for (const attribute of targetAttributes) {
      this._subCommands.push(
        new RemoveCommand(editor, annotationData, 'attribute', attribute)
      )
    }
    for (const relation of targetRelations) {
      this._subCommands.push(
        new RemoveCommand(editor, annotationData, 'relation', relation)
      )
    }
    for (const entity of targetEntities) {
      this._subCommands.push(
        new RemoveCommand(editor, annotationData, 'entity', entity)
      )
    }
    for (const span of targetSpans) {
      this._subCommands.push(
        new RemoveCommand(editor, annotationData, 'span', span)
      )
    }

    this._logMessage = `remove selected ${[
      ...targetSpans,
      ...targetEntities,
      ...targetRelations,
      ...targetAttributes
    ]
      .map(({ id }) => id)
      .join(', ')}`
  }
}
