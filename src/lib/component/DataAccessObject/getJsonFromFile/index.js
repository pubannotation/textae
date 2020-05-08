import loadData from './loadData'

export default function(file, fileType, done) {
  console.assert(
    ['annotation', 'config'].includes(fileType),
    `Cannot read data type of ${fileType}`
  )

  const firstFile = file.files[0]
  const reader = new FileReader()

  reader.onload = () => {
    const data = {
      annotation: null,
      config: null,
      source: `${firstFile.name}(local file)`
    }
    data[fileType] = loadData(reader.result, firstFile.name)

    done(data)
  }
  reader.readAsText(firstFile)
}
