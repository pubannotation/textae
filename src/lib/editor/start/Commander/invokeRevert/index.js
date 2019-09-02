import invoke from '../invoke'
import RevertCommands from './RevertCommands'

export default function(commands) {
  invoke(RevertCommands(commands))
}
