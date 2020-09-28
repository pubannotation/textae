import getLabelOverlay from '../../../../../../../getLabelOverlay'

export default function(jsPlumbConnection) {
  getLabelOverlay(jsPlumbConnection).removeClass('hover')
}
