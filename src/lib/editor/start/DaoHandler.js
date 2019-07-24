import KINDS from './Command/Factory/kinds'

export default function(
  dataAccessObject,
  history,
  annotationData,
  typeDefinition,
  getOriginalAnnotation,
  params
) {
  const showAccess = () =>
      dataAccessObject.showAccess(
        history.hasAnythingToSave(KINDS.anno),
        params
      ),
    showSave = () =>
      showSaveDialogWithEditedData(
        dataAccessObject,
        annotationData,
        typeDefinition,
        getOriginalAnnotation,
        params
      ),
    showAccessConf = () =>
      dataAccessObject.showAccessConf(
        history.hasAnythingToSave(KINDS.conf),
        params
      ),
    showSaveConf = () =>
      showSaveConfDialogWithEditedData(
        dataAccessObject,
        annotationData,
        typeDefinition,
        getOriginalAnnotation,
        params
      )

  return {
    showAccess,
    showSave,
    showAccessConf,
    showSaveConf
  }
}

function showSaveDialogWithEditedData(
  dataAccessObject,
  annotationData,
  typeDefinition,
  getOriginalAnnotation,
  params
) {
  const originalData = getOriginalAnnotation(),
    config = typeDefinition.getConfig()

  dataAccessObject.showSave(
    originalData,
    Object.assign(
      JSON.parse(JSON.stringify(originalData)),
      annotationData.toJson(),
      { config }
    ),
    params
  )
}

function showSaveConfDialogWithEditedData(
  dataAccessObject,
  annotationData,
  typeDefinition,
  getOriginalAnnotation,
  params
) {
  const originalData = getOriginalAnnotation(),
    config = typeDefinition.getConfig()

  dataAccessObject.showSaveConf(
    originalData,
    Object.assign(
      JSON.parse(JSON.stringify(originalData)),
      annotationData.toJson(),
      { config }
    ),
    params
  )
}
