import copyEntities from './copyEntities'
import pasteEntities from './pasteEntities'

export default function(command, annotationData, selectionModel, clipBoard) {
  return {
    copyEntities: () => copyEntities(clipBoard, selectionModel, annotationData),
    pasteEntities: () => pasteEntities(selectionModel, clipBoard, command)
  }
}
