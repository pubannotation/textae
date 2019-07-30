import isJSON from './isJSON'
import isTxtFile from './isTxtFile'

// Load json or .txt
export default function(result, fileName) {
  if (isJSON(result)) {
    return JSON.parse(result)
  } else if (isTxtFile(fileName)) {
    // If this is .txt, New annotation json is made from .txt
    return {
      text: result
    }
  }
  return null
}
