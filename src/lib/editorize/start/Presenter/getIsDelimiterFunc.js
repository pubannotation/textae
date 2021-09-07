export default function (buttonController, spanConfig) {
  if (buttonController.isPushed('boundary-detection')) {
    return (char) => spanConfig.isDelimiter(char)
  } else {
    return () => true
  }
}
