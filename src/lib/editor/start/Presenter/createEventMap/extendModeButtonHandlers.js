import ModeButtonHandlers from './handlers/ModeButtonHandlers'

export default function(editMode, event) {
  const modeButtonHandlers = new ModeButtonHandlers(editMode)
  Object.assign(event, modeButtonHandlers)
}
