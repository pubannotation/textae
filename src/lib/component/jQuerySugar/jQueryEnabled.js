import makeDomEnabled from '../makeDomEnabled'

export default function($target, enable) {
  makeDomEnabled($target[0], enable)
}
