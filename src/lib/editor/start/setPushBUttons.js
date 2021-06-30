export default function (configuration, buttonController) {
  if (configuration.autosave === true) {
    buttonController.push('write-auto')
  } else {
    buttonController.release('write-auto')
  }

  if (configuration.autolineheight === true) {
    buttonController.push('line-height-auto')
  } else {
    buttonController.release('line-height-auto')
  }

  if (configuration.boundarydetection === false) {
    buttonController.release('boundary-detection')
  } else {
    buttonController.push('boundary-detection')
  }
}
