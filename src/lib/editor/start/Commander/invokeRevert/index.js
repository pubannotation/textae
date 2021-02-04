import RevertCommands from './RevertCommands'

export default function (commands) {
  RevertCommands(commands).map((c) => c.execute())
}
