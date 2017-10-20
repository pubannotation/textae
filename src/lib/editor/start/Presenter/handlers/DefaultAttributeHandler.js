import {
  EventEmitter
}
  from 'events'
import _ from 'underscore'

export default function DefaultAttributeHandler(annotationData, command, selectionModel, attribute) {
  let emitter = new EventEmitter(),
    createAttributeImple = function() {
      let attributes = selectionModel.attribute.all(),
        commands = attributes.map(function(attributeId) {
          let entityId = annotationData.attribute.get(attributeId).subj
          return command.factory.attributeCreateCommand({
            id: null,
            subj: entityId,
            pred: attribute.getDefaultPred(),
            value: attribute.getDefaultValue()
          })
        })

      command.invoke(commands)

      // Cancel selections here.
      // Because attributes are selected only during processing click events of add, edit and delete buttons.
      selectionModel.clear()
    }

  return _.extend(emitter, {
    createAttribute: createAttributeImple
  })
}
