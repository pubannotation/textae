import DefaultHandler from './DefaultHandler'

export default function (handler, editEntity, editRelation) {
  switch (handler) {
    case 'entity':
      return editEntity.handler
    case 'relation':
      return editRelation.handler
    default:
      return new DefaultHandler()
  }
}
