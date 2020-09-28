import getLabelOverlay from '../../../../../../../getLabelOverlay'

export default function(jsPlumbConnection) {
  getLabelOverlay(jsPlumbConnection).addClass('ui-selected')
}
