export default function(api, file, fileType) {
  let firstFile = file.files[0],
    reader = new FileReader(),
    params = {
      annotation: null,
      config: null,
      source: firstFile.name + '(local file)'
    }

  if (['annotation', 'config'].indexOf(fileType) === -1) {
    throw new Error('Cannot read data type of ' + fileType)
  }

  reader.onload = function() {
    // Load json or .txt
    let loadData
    if (isJSON(this.result)) {
      loadData = JSON.parse(this.result)
    } else if (isTxtFile(firstFile.name)) {
      // If this is .txt, New annotation json is made from .txt
      loadData = {
        text: this.result
      }
    }

    params[fileType] = loadData
    api.emit('load--' + fileType, params)
  }
  reader.readAsText(firstFile)
}

function isJSON(arg) {
  arg = typeof arg === "function" ? arg() : arg
  if (typeof arg !== "string") {
    return false
  }
  try {
    arg = JSON.parse(arg)
    return true
  } catch (e) {
    return false
  }
}

function isTxtFile($fileName) {
  const f = $fileName.split('.')
  return f[f.length - 1].toLowerCase() === 'txt'
}
