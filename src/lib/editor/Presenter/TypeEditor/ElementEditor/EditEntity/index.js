import SelectEnd from '../../SelectEnd'
import unbindAllEventhandler from '../unbindAllEventhandler'
import changeTypeIfSelected from '../changeTypeIfSelected'
import spanClicked from './spanClicked'
import SelectSpan from './SelectSpan'
import bodyClicked from './bodyClicked'
import typeLabelClicked from './typeLabelClicked'
import entityClicked from './entityClicked'
import entityPaneClicked from './entityPaneClicked'

export default function(editor, model, command, modeAccordingToButton, typeContainer, spanConfig, cancelSelect) {
  let selectEnd = new SelectEnd(editor, model, command, modeAccordingToButton, typeContainer),
    selectSpan = new SelectSpan(editor, model.annotationData, model.selectionModel, typeContainer),
    selectionModel = model.selectionModel,
    bind = () => {
      editor
        .on('mouseup', '.textae-editor__body', () => bodyClicked(cancelSelect, selectEnd, spanConfig))
        .on('mouseup', '.textae-editor__span', (e) => spanClicked(spanConfig, selectEnd, selectSpan, e))
        .on('mouseup', '.textae-editor__type-label', (e) => typeLabelClicked(selectionModel, e))
        .on('mouseup', '.textae-editor__entity-pane', (e) => entityPaneClicked(selectionModel, e))
        .on('mouseup', '.textae-editor__entity', (e) => entityClicked(selectionModel, e))
    },
    getSelectedIdEditable = selectionModel.entity.all,
    handler = {
      changeTypeOfSelected: (newType) => changeTypeIfSelected(
        command,
        getSelectedIdEditable,
        model.annotationData.entity, (id, newType) => command.factory.entityChangeTypeCommand(
          id,
          newType,
          typeContainer.entity.isBlock(newType)
        ),
        newType
      ),
      getSelectedIdEditable: getSelectedIdEditable,
      getSelectedType: () => {
        let id = selectionModel.entity.single()

        if (id)
          return model.annotationData.entity.get(id).type
        else
          return ''
      },
      typeContainer: typeContainer.entity,
      jsPlumbConnectionClicked: null
    }

  return () => [bind, handler]
}
