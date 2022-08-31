export default function (controlViewModel, spanConfig) {
  if (controlViewModel.isPushed('boundary detection')) {
    return (char) => spanConfig.isDelimiter(char)
  } else {
    return () => true
  }
}
