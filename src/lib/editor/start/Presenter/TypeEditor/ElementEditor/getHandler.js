import DefaultHandler from './DefaultHandler'

export default function(handler, editEntity, editRelation) {
  switch (handler) {
    case 'entity':
      return editEntity.entityHandler()
    case 'relation':
      return editRelation.handlers
    default:
      return new DefaultHandler()
  }
}
