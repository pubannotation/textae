import hasWaitingEditor from './hasWaitingEditor'
import switchVeil from './switchVeil'

export default function (mutationRecords) {
  mutationRecords.forEach((m) => switchVeil(hasWaitingEditor(m.target)))
}
