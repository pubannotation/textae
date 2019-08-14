export default function(persistenceInterface) {
  return new Map([
    [
      'textae.pallet.button.read.click',
      () => persistenceInterface.importConfiguration()
    ],
    [
      'textae.pallet.button.write.click',
      () => persistenceInterface.uploadConfiguration()
    ]
  ])
}
