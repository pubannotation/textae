export default function(command, presenter, daoHandler, buttonController, updateLineHeight) {
  return new Map([
    ['textae.control.button.view.click', presenter.event.toViewMode],
    ['textae.control.button.term.click', presenter.event.toTermMode],
    ['textae.control.button.relation.click', presenter.event.toRelationMode],
    ['textae.control.button.simple.click', presenter.event.toggleSimpleMode],
    ['textae.control.button.read.click', daoHandler.showAccess],
    ['textae.control.button.write.click', daoHandler.showSave],
    ['textae.control.button.undo.click', command.undo],
    ['textae.control.button.redo.click', command.redo],
    ['textae.control.button.replicate.click', presenter.event.replicate],
    ['textae.control.button.replicate_auto.click', () => buttonController.modeAccordingToButton['replicate-auto'].toggle()],
    ['textae.control.button.boundary_detection.click', presenter.event.toggleDetectBoundaryMode],
    ['textae.control.button.entity.click', presenter.event.createEntity],
    ['textae.control.button.change_label.click', presenter.event.changeLabel],
    ['textae.control.button.pallet.click', presenter.event.showPallet],
    ['textae.control.button.negation.click', presenter.event.negation],
    ['textae.control.button.speculation.click', presenter.event.speculation],
    ['textae.control.button.delete.click', presenter.event.removeSelectedElements],
    ['textae.control.button.copy.click', presenter.event.copyEntities],
    ['textae.control.button.paste.click', presenter.event.pasteEntities],
    ['textae.control.button.setting.click', presenter.event.showSettingDialog],
    ['textae.control.button.line_height.click', updateLineHeight]
  ])
}
