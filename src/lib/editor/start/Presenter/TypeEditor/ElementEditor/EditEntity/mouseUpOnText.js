import getSelectionSnapShot from './getSelectionSnapShot'

export default function(selectEnd, spanConfig) {
  selectEnd.onText({
    spanConfig,
    selection: getSelectionSnapShot()
  })
}
