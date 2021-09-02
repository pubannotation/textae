export default function (buttonController, spanConfig) {
  if (buttonController.valueOf('boundary-detection')) {
    return (char) => spanConfig.isDelimiter(char)
  } else {
    return () => true
  }
}
