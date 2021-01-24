import isUri from '../../isUri'
import getUrlMatches from '../getUrlMatches'

// Display short name for URL(http or https);
export default function (type) {
  // For tunning, search the scheme before execute a regular-expression.
  if (isUri(type)) {
    const matches = getUrlMatches(type)

    if (matches) {
      // Order to dispaly.
      // 1. The anchor without #.
      if (matches[9]) return matches[9].slice(1)

      // 2. The file name with the extention.
      if (matches[6]) return matches[6] + (matches[7] || '')

      // 3. The last directory name.
      // Exclude slash only. cf. http://hoge.com/
      if (matches[5] && matches[5].length > 1)
        return matches[5]
          .split('/')
          .filter((s) => {
            return s !== ''
          })
          .pop()

      // 4. The domain name.
      return matches[3]
    }
  }
  return type
}
