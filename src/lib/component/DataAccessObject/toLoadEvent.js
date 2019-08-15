import typeToMoreDetail from './typeToMoreDetail'

export default function(type) {
  return `${typeToMoreDetail(type)}.load`
}
