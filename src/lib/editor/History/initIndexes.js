import KINDS from '../start/Command/Factory/kinds'

export default function() {
  const map = {}
  Object.keys(KINDS).forEach((kind) => {
    map[KINDS[kind]] = -1
  })
  return map
}
