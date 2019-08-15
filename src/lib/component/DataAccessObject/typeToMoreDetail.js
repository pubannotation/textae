export default function(type) {
  switch (type) {
    case 'annotation':
      return 'annotation'
    case 'config':
      return 'configuration'
    default:
      throw 'unknow type!'
  }
}
