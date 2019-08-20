import debounce from 'debounce'

export default function(func) {
  return debounce(func, 300)
}
