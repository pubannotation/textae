export default function() {
  return {
    exists,
    get,
    set
  }
}

function exists(key) {
  return (
    document.cookie.split(';').filter((item) => item.includes(`${key}=`))
      .length !== 0
  )
}

function get(key) {
  const regexp = new RegExp(`(?:(?:^|.*;\\s*)${key}\\s*\\=\\s*([^;]*).*$)|^.*$`)
  return document.cookie.replace(regexp, '$1')
}

function set(key, value, options) {
  const optionStr = Object.keys(options).reduce((accum, optKey) => {
    return `${accum}; ${optKey}=${options[optKey]}`
  }, '')

  document.cookie = `${key}=${value}${optionStr}`
}
