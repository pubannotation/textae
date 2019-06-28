export default function(daoHandler) {
  return new Map([
    ['textae.pallet.button.read.click', daoHandler.showAccessConf],
    ['textae.pallet.button.write.click', daoHandler.showSaveConf]
  ])
}
