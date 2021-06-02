import delegate from 'delegate'
import alertifyjs from 'alertifyjs'
import CreateAttributeDefinitionDialog from '../../CreateAttributeDefinitionDialog'
import EditAttributeDefinitionDialog from '../../EditAttributeDefinitionDialog'
import EditValueOfAttributeDefinitionDialog from '../../EditValueOfAttributeDefinitionDialog'
import enableAttributeTabDrag from './enableAttributeTabDrag'
import enableAttributeTabDrop from './enableAttributeTabDrop'
import openEditNumericAttributeDialog from '../../../editor/start/Presenter/openEditNumericAttributeDialog'
import openEditStringAttributeDialog from '../../../editor/start/Presenter/openEditStringAttributeDialog'

export default function (pallet, el, commander, selectionModelEntity) {
  enableAttributeTabDrag(el)
  enableAttributeTabDrop(el, commander)

  delegate(el, '.textae-editor__type-pallet__attribute', 'click', (e) => {
    pallet.showAttribute(e.target.dataset['attribute'])
  })

  delegate(el, '.textae-editor__type-pallet__create-predicate', 'click', () =>
    new CreateAttributeDefinitionDialog().open().then((attrDef) => {
      // Predicate is necessary and Ignore without predicate.
      if (attrDef.pred) {
        commander.invoke(
          commander.factory.createAttributeDefinitionCommand(attrDef)
        )
      }
    })
  )

  delegate(el, '.textae-editor__type-pallet__edit-predicate', 'click', () =>
    new EditAttributeDefinitionDialog(pallet.attrDef)
      .open()
      .then((changedProperties) => {
        // Predicate is necessary and Ignore without predicate.
        if (changedProperties.size && changedProperties.get('pred') !== '') {
          commander.invoke(
            commander.factory.changeAttributeDefinitionCommand(
              pallet.attrDef,
              changedProperties
            )
          )
        }
      })
  )

  delegate(el, '.textae-editor__type-pallet__delete-predicate', 'click', () =>
    commander.invoke(
      commander.factory.deleteAttributeDefinitionCommand(pallet.attrDef)
    )
  )

  delegate(
    el,
    '.textae-editor__type-pallet__selection-attribute-label',
    'click',
    (e) => {
      if (selectionModelEntity.selectedWithAttributeOf(pallet.attrDef.pred)) {
        if (
          selectionModelEntity.isDupulicatedPredAttrributeSelected(
            pallet.attrDef.pred
          )
        ) {
          alertifyjs.warning(
            'An item among the selected has this attribute multiple times.'
          )
        } else {
          const command = commander.factory.changeAttributesOfItemsCommand(
            selectionModelEntity.all,
            pallet.attrDef,
            e.target.dataset.id
          )
          commander.invoke(command)
        }
      } else {
        const command = commander.factory.createAttributeToItemsCommand(
          selectionModelEntity.all,
          pallet.attrDef,
          e.target.dataset.id
        )
        commander.invoke(command)
      }
    }
  )

  delegate(
    el,
    '.textae-editor__type-pallet__add-attribute-value-button',
    'click',
    () =>
      new EditValueOfAttributeDefinitionDialog(pallet.attrDef.valueType)
        .open()
        .then((value) => {
          if (value.range || value.id || value.pattern) {
            commander.invoke(
              commander.factory.addValueToAttributeDefinitionCommand(
                pallet.attrDef,
                value
              )
            )
          }
        })
  )

  delegate(el, '.textae-editor__type-pallet__edit-value', 'click', (e) => {
    const oldValue = pallet.attrDef.values[e.target.dataset.index]
    new EditValueOfAttributeDefinitionDialog(pallet.attrDef.valueType, oldValue)
      .open()
      .then((newValue) => {
        if (newValue.range || newValue.id || newValue.pattern) {
          const changed =
            Object.keys(newValue).reduce((acc, cur) => {
              return acc || newValue[cur] !== oldValue[cur]
            }, false) ||
            Object.keys(oldValue).reduce((acc, cur) => {
              return acc || newValue[cur] !== oldValue[cur]
            }, false)
          // Ignore if there is no change
          if (!changed) {
            return
          }

          commander.invoke(
            commander.factory.changeValueOfAttributeDefinitionAndObjectOfSelectionAttributeCommand(
              pallet.attrDef.JSON,
              e.target.dataset.index,
              newValue
            )
          )
        }
      })
  })

  delegate(el, '.textae-editor__type-pallet__remove-value', 'click', (e) =>
    commander.invoke(
      commander.factory.removeValueFromAttributeDefinitionCommand(
        pallet.attrDef,
        e.target.dataset.index
      )
    )
  )

  delegate(el, '.textae-editor__type-pallet__add-attribute', 'click', () =>
    commander.invoke(
      commander.factory.createAttributeToItemsCommand(
        selectionModelEntity.all,
        pallet.attrDef
      )
    )
  )

  delegate(el, '.textae-editor__type-pallet__edit-object', 'click', () => {
    const attribute =
      selectionModelEntity.findSelectedAttributeWithSamePredicate(
        pallet.attrDef.pred
      )
    switch (pallet.attrDef.valueType) {
      case 'numeric':
        openEditNumericAttributeDialog(
          selectionModelEntity,
          pallet.attrDef,
          attribute,
          commander,
          false
        )
        break
      case 'string':
        openEditStringAttributeDialog(
          selectionModelEntity,
          attribute,
          commander,
          pallet.attrDef
        )
        break
      default:
        throw new Error(
          `Invalid attribute valueType: ${pallet.attrDef.valueType}`
        )
    }
  })

  delegate(el, '.textae-editor__type-pallet__remove-attribute', 'click', () =>
    commander.invoke(
      commander.factory.removeAttributesFromItemsByPredCommand(
        selectionModelEntity.all,
        pallet.attrDef
      )
    )
  )
}
