import delimiterDetectAdjuster from '../../../spanAdjuster/delimiterDetectAdjuster'
import blankSkipAdjuster from '../../../spanAdjuster/blankSkipAdjuster'
import create from './create'
import expand from './expand'
import shrink from './shrink'

export default function(editor, model, command, typeContainer, isDetectDelimiterEnable, isReplicateAuto) {
  const spanAdjuster = isDetectDelimiterEnable ? delimiterDetectAdjuster : blankSkipAdjuster

  return {
    create: (data) => create(model, command, typeContainer, spanAdjuster, isDetectDelimiterEnable, isReplicateAuto, data.selection, data.spanConfig),
    expand: (data) => expand(editor, model, command, spanAdjuster, data.selection, data.spanConfig),
    shrink: (data) => shrink(editor, model, command, spanAdjuster, data.selection, data.spanConfig)
  }
}
