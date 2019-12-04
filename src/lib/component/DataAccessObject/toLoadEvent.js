import typeToMoreDetail from './typeToMoreDetail'

export default function(type) {
  return `textae.dataAccessObject.${typeToMoreDetail(type)}.load`
}
